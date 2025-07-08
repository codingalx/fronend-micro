import React, { useEffect, useState,useContext } from "react";
import { Box,  useTheme,Tooltip,IconButton  } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../common/Header";
import { tokens } from "../common/theme";
import { listOfReference } from "../../Api/employeeApi";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { canAccessResource } from "../../Api/SecurityService";
import EmployeeServiceResourceName from "../../Api/EmployeeServiceResourceName";
import NotFoundHandle from "../common/NotFoundHandle";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 




const ListReference = ({ employerId, refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [reference, setReference] = useState([]);
  const [error, setError] = useState(null);
     const [authState] = useAtom(authAtom); // Access the shared authentication state
      const tenantId = authState.tenantId
      const userRoles = authState.roles;


  
  const handleEditReference = (employerId, id) => {
    navigate('/employee/update_reference', { state: { employerId, id } });
  };

  const handleDelete = (employerId, id) => {
    navigate('/employee/delete_reference', { state: { employerId, id } });
  };
  

  useEffect(() => {
    fetchReference();
    checkPermissions();
  }, [refreshKey]);

  const fetchReference = async () => {
    try {
      const response = await listOfReference(tenantId,employerId);
      const data = response.data;
      setReference(data);
      console.log(data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(EmployeeServiceResourceName.UPDATE_REFERENCE, userRoles);
    const deleteAccess = await canAccessResource(EmployeeServiceResourceName.DELETE_REFERENCE, userRoles);
  
    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
  };

  if (!employerId) {
    return <NotFoundHandle message="No employee   selected to get all employee refernce." navigateTo="/employee/list" />;
  }

  const columns = [
    { field: "fullName", headerName: "FullName", flex: 1, cellClassName: "name-column--cell" },
  { field: "phoneNumber", headerName: "phoneNumber", flex: 1, cellClassName: "name-column--cell" },
  { field: "jobTitle", headerName: "jobTitle", flex: 1, cellClassName: "name-column--cell" },
  { field: "workAddress", headerName: "workAddress", flex: 1, cellClassName: "name-column--cell" },
  { field: "email", headerName: "email", flex: 1, cellClassName: "name-column--cell" },
  { field: "description", headerName: "description", flex: 1, cellClassName: "name-column--cell" },
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
   renderCell: (params) => (
      <Box  sx={{ display: 'flex', justifyContent: 'center' }}>
         
         {canDelete &&(
            <Tooltip title="Delete Reference of Employer">
            <IconButton onClick={() => handleDelete(employerId, params.row.id)}   color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>

         )}

         {canEdit &&(
            <Tooltip title="Update">
            <IconButton
                 onClick={() => handleEditReference(employerId, params.row.id)}
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
      <Header  subtitle="List of employer reference" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={reference}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
     
    </Box>
  );
};

export default ListReference;
