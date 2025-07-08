import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import { getAllGatePassInformation } from "../../Api/storeMovementAp";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; // Adjust the import based on your structure

const GetAllGatePassInformation = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); // Access the shared authentication state
    const tenantId = authState.tenantId

  const [allGateInformation, SetAllGateInformation] = useState([]);

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllGatePassInformation();
  }, [refreshKey]);

  const fetchAllGatePassInformation = async () => {
    try {
      const response = await getAllGatePassInformation(tenantId);
      SetAllGateInformation(response.data);
         console.log(response.data); // Check the structure
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleEditGatePassInformation = (id) => {
    navigate("/storeMovent/update_gatepass_infomation", { state: { id } });
  };


  const handleDeleteGatePassInformation = (id) => {
    navigate("/storeMovent/delete_gatepass_infomation", { state: { id } });
  };

    const handleGatePassInformation = (id) => {
    navigate("/storeMovent/decision_gatepass_infomation", { state: { id } });
  };

  
   

  const columns = [
    { field: "movementType", headerName: "movementType", flex: 1 },
    { field: "gatePassNo", headerName: "gatePassNo", flex: 1 },
    { field: "movementTypeNo", headerName: "movementTypeNo", flex: 1 },
   
    { field: "transferType", headerName: "transferType", flex: 1 },
       { field: "securityOfficer", headerName: "securityOfficer", flex: 1 },

 {
  field: "actions",
  headerName: "Actions",
  width: 150,
  renderCell: (params) => (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Tooltip title="Delete gate pass information">
        <IconButton
          onClick={() => handleDeleteGatePassInformation(params.row.id)}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>

    
        <Tooltip title="Make Decision">
          <IconButton onClick={() => handleGatePassInformation(params.row.id)} color="primary">
            <EditIcon />
          </IconButton>
        </Tooltip>
  

      <Tooltip title="Update gate pass information">
        <IconButton
          onClick={() => handleEditGatePassInformation(params.row.id)}
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
      <Header subtitle="List All Gate information" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={allGateInformation}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default GetAllGatePassInformation;
