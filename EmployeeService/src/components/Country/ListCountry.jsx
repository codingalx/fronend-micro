import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import EmployeeServiceResourceName from "../../Api/EmployeeServiceResourceName";
import Header from "../common/Header";
import { listAllCountry } from "../../Api/employeeApi";
import { canAccessResource } from "../../Api/SecurityService";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; // Adjust the import based on your structure




const ListCountry = ( {refreshKey} ) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); // Access the shared authentication state
const userRoles = authState.roles
const tenantId = authState.tenantId;

  const [allCounty, setAllcounty] = useState([]);
  
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllCounty();
    checkPermissions();
  }, [refreshKey]); 

  const fetchAllCounty = async () => {
    try {
      const response = await listAllCountry(tenantId);
      setAllcounty(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleEditSkill = (id) => {
    navigate('/employee/update_country', { state: { id } });
  };

  const handleDeleteSkill = (id,name) => {
    navigate('/employee/delete_country', { state: {  id ,name} });
  };

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);


  const checkPermissions = async () => {
    const editAccess = await canAccessResource(EmployeeServiceResourceName.UPDATE_SKILL, userRoles);
    const deleteAccess = await canAccessResource(EmployeeServiceResourceName.DELETE_SKILL, userRoles);
  
    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
  };



  const columns = [
    { field: "name", headerName: "Country Name", flex: 1 },
    { field: "abbreviatedName", headerName: "Abbreviated Name", flex: 1 },
    { field: "code", headerName: "Code", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          
          {canDelete && (
            <Tooltip title="Delete County">
           <IconButton
                onClick={() => handleDeleteSkill(params.row.id,params.row.name)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}


          {canEdit && (
            <Tooltip title="Update Country">
              <IconButton
                onClick={() => handleEditSkill(params.row.id)}
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
      <Header subtitle= "List Of country"/>
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={allCounty}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default ListCountry;