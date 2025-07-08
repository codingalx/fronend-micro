import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import { getAllGoodReceivingNote } from "../../Api/storeMovementAp";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; // Adjust the import based on your structure

const GetAllGoodReceivingNote = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); // Access the shared authentication state
    const tenantId = authState.tenantId

  const [allReceivingNote, setAllReceivingNote] = useState([]);

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllReceivingNote();
  }, [refreshKey]);

  const fetchAllReceivingNote = async () => {
    try {
      const response = await getAllGoodReceivingNote(tenantId);
      setAllReceivingNote(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleEditGoodReceivingNote = (id) => {
    navigate("/storeMovent/update_goodReceiving_note", { state: { id } });
  };

  const handleDeleteGoodReceivingNote = (id) => {
    navigate("/storeMovent/delete_goodReceiving_note", { state: { id } });
  };



  

   


  const columns = [
    { field: "receivedDate", headerName: "received Date", flex: 1 },
    { field: "supplierName", headerName: "supplierName", flex: 1 },
    { field: "entryType", headerName: "entryType", flex: 1 },
    { field: "assetType", headerName: "assetType", flex: 1 },
    { field: "grn_NO", headerName: "grn_NO", flex: 1 },

    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Tooltip title="Delete good receiving note">
            <IconButton
              onClick={() => handleDeleteGoodReceivingNote(params.row.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Update good receiving note">
            <IconButton
              onClick={() => handleEditGoodReceivingNote(params.row.id)}
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
      <Header subtitle="List Good receiving Note" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={allReceivingNote}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default GetAllGoodReceivingNote;
