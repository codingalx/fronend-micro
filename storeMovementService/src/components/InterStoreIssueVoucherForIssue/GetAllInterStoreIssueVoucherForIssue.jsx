import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import {  getAllInterStoreIssueVoucherForIssue } from "../../Api/storeMovementAp";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; // Adjust the import based on your structure

const GetAllInterStoreIssueVoucherForIssue = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); // Access the shared authentication state
    const tenantId = authState.tenantId

  const [allInterIssue, setAllInterIssue] = useState([]);

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllGatePassInformation();
  }, [refreshKey]);

  const fetchAllGatePassInformation = async () => {
    try {
      const response = await getAllInterStoreIssueVoucherForIssue(tenantId);
      setAllInterIssue(response.data);
       
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleEditInterStoreIssue = (id) => {
    navigate("/storeMovent/update_inter_Store_Issue", { state: { id } });
  };


  const handleDeleteInterStoreIssue = (id) => {
    navigate("/storeMovent/delete_inter_Store_Issue", { state: { id } });
  };

    const handleInterStoreIssueDecision= (id) => {
    navigate("/storeMovent/decision_inter_Store_Issue", { state: { id } });
  };
 
  
   

  const columns = [
    { field: "itemTransferNo", headerName: "itemTransferNo", flex: 1 },
    { field: "plateNo", headerName: "plateNo", flex: 1 },
    { field: "transferDate", headerName: "transferDate", flex: 1 },
   
    { field: "driverName", headerName: "driverName", flex: 1 },
    

 {
  field: "actions",
  headerName: "Actions",
  width: 150,
  renderCell: (params) => (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Tooltip title="Delete inter store issue">
        <IconButton
          onClick={() => handleDeleteInterStoreIssue(params.row.id)}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>

      {params.row.status==='PENDING' && (
        <Tooltip title="Make Decision">
          <IconButton onClick={() => handleInterStoreIssueDecision(params.row.id)} color="primary">
            <EditIcon />
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title="Update Inter store issue ">
        <IconButton
          onClick={() => handleEditInterStoreIssue(params.row.id)}
          color="primary"
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
    </Box>
  ),
}
  ];

  return (
    <Box m="20px">
      <Header subtitle="Get All InterStore IssueVoucher ForIssue" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={allInterIssue}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default GetAllInterStoreIssueVoucherForIssue;
