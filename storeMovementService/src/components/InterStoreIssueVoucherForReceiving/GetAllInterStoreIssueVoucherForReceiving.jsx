import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import {

  getAllInterStoreIssueVoucherForReceiving,
} from "../../Api/storeMovementAp";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom"; // Adjust the import based on your structure

const GetAllInterStoreIssueVoucherForReceiving = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); // Access the shared authentication state
  const tenantId = authState.tenantId;
  console.log(tenantId);

  const [allInterReceiving, setAllInterReceiving] = useState([]);

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllGatePassInformation();
  }, [refreshKey]);

  const fetchAllGatePassInformation = async () => {
    try {
      const response = await getAllInterStoreIssueVoucherForReceiving(tenantId);
      setAllInterReceiving(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleEditInterStoreReceiving = (id) => {
    navigate("/storeMovent/update_inter_Store_receiving", { state: { id } });
  };

  const handleDeleteInterStoreReceiving = (id) => {
    navigate("/storeMovent/delete_inter_Store_receiving", { state: { id } });
  };

  const columns = [
    { field: "receivingISIV_NO", headerName: "receivingISIV_NO", flex: 1 },
    { field: "plateNo", headerName: "plateNo", flex: 1 },
    { field: "transferDate", headerName: "transferDate", flex: 1 },

    { field: "driverName", headerName: "driverName", flex: 1 },
    { field: "transporters", headerName: "transporters", flex: 1 },

    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Tooltip title="Delete inter store receiving">
            <IconButton
              onClick={() => handleDeleteInterStoreReceiving(params.row.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Update Inter store receiving ">
            <IconButton
              onClick={() => handleEditInterStoreReceiving(params.row.id)}
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
      <Header subtitle="Get All InterStore IssueVoucher Receiving" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={allInterReceiving}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default GetAllInterStoreIssueVoucherForReceiving;
