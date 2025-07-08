import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import { listDutyStation } from "../../Api/employeeApi";
import { canAccessResource } from "../../Api/SecurityService";
import EmployeeServiceResourceName from "../../Api/EmployeeServiceResourceName";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; // Adjust the import based on your structure



const ListDutyStation = ( {refreshKey} ) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [authState] = useAtom(authAtom); // Access the shared authentication state
  const userRoles = authState.roles
  const tenantId = authState.tenantId


  
  const [allDutystation, setAllDutystation] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDutyStation();
    checkPermissions();
  }, [refreshKey]); 

  const fetchDutyStation = async () => {
    try {
      const response = await listDutyStation(tenantId);
      setAllDutystation(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleEditdutyStation = (id) => {
    navigate('/employee/update_dutyStation', { state: { id } });
  };

  const handleDeleteDutyStation = (id,name) => {
    navigate('/employee/delete_dutyStation', { state: {  id ,name} });
  };

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(EmployeeServiceResourceName.UPDATE_DUTY_STATION, userRoles);
    const deleteAccess = await canAccessResource(EmployeeServiceResourceName.DELETE_DUTY_STATION, userRoles);
  
    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
  };



  const columns = [
    { field: "name", headerName: "Country Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          
          {canDelete && (
            <Tooltip title="Delete duty station">
     
           <IconButton
                onClick={() => handleDeleteDutyStation(params.row.id,params.row.name)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}


          {canEdit && (
            <Tooltip title="Update duty station">
              <IconButton
                onClick={() => handleEditdutyStation(params.row.id)}
                color="primary"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header subtitle= "List Of duty station"/>
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={allDutystation}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default ListDutyStation;