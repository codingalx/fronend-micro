import React, { useEffect, useState, useContext } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { listLanguageName } from "../../Api/employeeApi";
import Header from "../common/Header";
import { canAccessResource } from "../../Api/SecurityService";

import EmployeeServiceResourceName from "../../Api/EmployeeServiceResourceName";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; // Adjust the import based on your structure


const ListLanguageName = ( {refreshKey} ) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  
    const [authState] = useAtom(authAtom); // Access the shared authentication state
    const userRoles = authState.roles
    const tenantId = authState.tenantId

  
  const [allLangaugeName, setAllLangaugeName] = useState([]);
  
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllLanguageName();
    checkPermissions();
  }, [refreshKey]); 

  const fetchAllLanguageName = async () => {
    try {
      const response = await listLanguageName(tenantId);
      setAllLangaugeName(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleEditlanguageName = (id) => {
    navigate('/employee/update_languageName', { state: { id } });
  };

  const handleDeleteLanguageName = (id,languageName) => {
    navigate('/employee/delete_languageName', { state: {  id ,languageName} });
  };

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);


  const checkPermissions = async () => {
    const editAccess = await canAccessResource(EmployeeServiceResourceName.UPDATE_LANGUAGE_NAME, userRoles);
    const deleteAccess = await canAccessResource(EmployeeServiceResourceName.DELETE_LANGUAGE_NAME, userRoles);
  
    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
  };



  const columns = [
    { field: "languageName", headerName: "language Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          
          {canDelete && (
            <Tooltip title="Delete language Name">
     
           <IconButton
                onClick={() => handleDeleteLanguageName(params.row.id,params.row.languageName)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}


          {canEdit && (
            <Tooltip title="Update language name">
              <IconButton
                onClick={() => handleEditlanguageName(params.row.id)}
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
      <Header subtitle= "List Of Language Name"/>
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={allLangaugeName}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default ListLanguageName;