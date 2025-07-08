import React, { useEffect, useState,useContext } from "react";
import { Box,Tooltip ,useTheme,IconButton  } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../common/Header";
import { tokens } from "../common/theme";
import { listFamily } from "../../Api/employeeApi";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { canAccessResource } from "../../Api/SecurityService";
import EmployeeServiceResourceName from "../../Api/EmployeeServiceResourceName";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import NotFoundHandle from "../common/NotFoundHandle";


const ListFamily = ({ employerId, refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [family, setFamily] = useState([]);
  const [error, setError] = useState(null);
    const [authState] = useAtom(authAtom); 
        const tenantId = authState.tenantId
        const userRoles = authState.roles



  
  const handleEditFamily = (employerId, id) => {
    navigate('/employee/update_family', { state: { employerId, id } });
  };

  const handleDelete = (employerId, id) => {
    navigate('/employee/delete_family', { state: { employerId, id } });
  };
  
  
  useEffect(() => {
    fetchFamily();
    checkPermissions();
  }, [refreshKey]);

  
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(EmployeeServiceResourceName.UPDATE_FAMILY, userRoles);
    const deleteAccess = await canAccessResource(EmployeeServiceResourceName.DELETE_FAMILY, userRoles);
  
    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
  };

  const fetchFamily= async () => {
    try {
      const response = await listFamily(tenantId,employerId);
      const data = response.data;
      setFamily(data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };


  if (! employerId) {
    return <NotFoundHandle message="No employee  selected to get family list." navigateTo="/employee/list" />;
  }

  const columns = [
    { field: "relationshipType", headerName: "Relationship Type", flex: 1, cellClassName: "name-column--cell" },
    { field: "firstName", headerName: "FirstName", flex: 1, cellClassName: "name-column--cell" },
    { field: "middleName", headerName: "MiddleName", flex: 1, cellClassName: "name-column--cell" },
    { field: "lastName", headerName: "LastName", flex: 1, cellClassName: "name-column--cell" },
  
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
     renderCell: (params) => (
        <Box  sx={{ display: 'flex', justifyContent: 'center' }}>

          {canDelete &&(
               <Tooltip title="Delete Skill of Employee">
               <IconButton  onClick={() => handleDelete(employerId, params.row.id)}  color="error">
                 <DeleteIcon />
               </IconButton>
             </Tooltip>

          )}

          {canEdit &&(
                <Tooltip title="Update">
                <IconButton
                   onClick={() => handleEditFamily(employerId, params.row.id)}
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
        <Header  subtitle="List of Employer Family" />
        <Box m="40px 0 0 0" height="75vh">
          <DataGrid
            rows={family}
            columns={columns}
            getRowId={(row) => row.id}
            checkboxSelection={false}
          />
        </Box>

      </Box>
    );
  };
export default ListFamily;
