import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import { getAllStoreIssueVouncher } from "../../Api/storeMovementAp";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; // Adjust the import based on your structure

const GetAllStoreIssueVoucher = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); // Access the shared authentication state
    const tenantId = authState.tenantId

  const [allSoreIssueVouncher, setAllSoreIssueVouncher] = useState([]);

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllPayRollGroup();
  }, [refreshKey]);

  const fetchAllPayRollGroup = async () => {
    try {
      const response = await getAllStoreIssueVouncher(tenantId);
      setAllSoreIssueVouncher(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleEditStoreIssueVouncher = (id) => {
    navigate("/storeMovent/update_storeIssued_voucher", { state: { id } });
  };

  const handleDeleteStoreIssueVouncher = (id) => {
    navigate("/storeMovent/delete_storeIssued_voucher", { state: { id } });
  };

   


  const columns = [
    { field: "receiver", headerName: "receiver", flex: 1 },
    { field: "department", headerName: "department", flex: 1 },
    { field: "requisitionDate", headerName: "requisitionDate", flex: 1 },
    { field: "type", headerName: "type", flex: 1 },
    { field: "siv_NO", headerName: "siv_NO", flex: 1 },

    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Tooltip title="Delete Store Issue Vouncher">
            <IconButton
              onClick={() => handleDeleteStoreIssueVouncher(params.row.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Update Store Issue Vouncher">
            <IconButton
              onClick={() => handleEditStoreIssueVouncher(params.row.id)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header subtitle="List Store Issue Vouncher" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={allSoreIssueVouncher}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default GetAllStoreIssueVoucher;
