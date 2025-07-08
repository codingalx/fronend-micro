import React, { useEffect, useState, } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import { listTitleName } from "../../Api/employeeApi";
import EmployeeServiceResourceName from "../../Api/EmployeeServiceResourceName";
import { canAccessResource } from "../../Api/SecurityService";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; // Adjust the import based on your structure


const ListTitleName = ( {refreshKey} ) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

const [authState] = useAtom(authAtom); // Access the shared authentication state
const userRoles = authState.roles
const tenantId = authState.tenantId


  
  const [allTitleName, setAllTitleName] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllTitlename();
    checkPermissions();
  }, [refreshKey]); 

  const fetchAllTitlename = async () => {
    try {
      const response = await listTitleName(tenantId);
      setAllTitleName(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleEditTitleName = (id) => {
    navigate('/employee/update_titleName', { state: { id } });
  };

  const handleDeletetitleName = (id,titleName) => {
    navigate('/employee/delete_titleName', { state: {  id ,titleName} });
  };

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);


  const checkPermissions = async () => {
    const editAccess = await canAccessResource(EmployeeServiceResourceName.UPDATE_TITLE_NAME, userRoles);
    const deleteAccess = await canAccessResource(EmployeeServiceResourceName.DELETE_TITLE_NAME, userRoles);
  
    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
  };



  const columns = [
    { field: "titleName", headerName: "Title Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          
          {canDelete && (
            <Tooltip title="Delete title name">
     
           <IconButton
                onClick={() => handleDeletetitleName(params.row.id,params.row.titleName)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}


          {canEdit && (
            <Tooltip title="Update title name">
              <IconButton
                onClick={() => handleEditTitleName(params.row.id)}
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
      <Header subtitle= "List Of title Name"/>
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={allTitleName}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default ListTitleName;