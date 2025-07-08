
import React, { useEffect, useState } from "react";
import { Box, Tooltip, useTheme,IconButton  } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../common/Header";
import { tokens } from "../common/theme";
import { listExperience } from "../../Api/employeeApi";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { canAccessResource } from "../../Api/SecurityService";
import EmployeeServiceResourceName from "../../Api/EmployeeServiceResourceName";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import NotFoundHandle from "../common/NotFoundHandle";



const ListExperence = ({ employerId, refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [experence, setExperence] = useState([]);
    const [authState] = useAtom(authAtom); 
          const tenantId = authState.tenantId
          const userRoles = authState.roles

  
  const handleEditExperence = (employerId, id) => {
    navigate('/employee/update_experience', { state: { employerId, id } });
  };

  const handleDelete = (employerId, id) => {
    navigate('/employee/delete_experience', { state: { employerId, id } });
  };
  

  useEffect(() => {
    fetchExperence();
    checkPermissions();
  }, [refreshKey]);

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(EmployeeServiceResourceName.UPDATE_EXPERIENCE, userRoles);
    const deleteAccess = await canAccessResource(EmployeeServiceResourceName.DELETE_EXPERIENCE, userRoles);
  
    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
  };

  const fetchExperence = async () => {
    try {
      const response = await listExperience(tenantId,employerId);
      const data = response.data;
      setExperence(data);
      console.log(data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  if (!( employerId)) {
    return <NotFoundHandle message="No employee  selected to get experience list." navigateTo="/employee/list" />;
  }

  const columns = [
    { field: "institution", headerName: "Institution", flex: 1  ,cellClassName: "name-column--cell" },
    { field: "employmentType", headerName: "Employment Type", flex: 1 ,cellClassName: "name-column--cell" },
    { field: "jobTitle", headerName: "Job Title", flex: 1 ,cellClassName: "name-column--cell"},
    { field: "salary", headerName: "Salary", flex: 1 ,cellClassName: "name-column--cell"},
    { field: "startDate", headerName: "Start Date", flex: 1 ,cellClassName: "name-column--cell"},
    { field: "endDate", headerName: "End Date", flex: 1,cellClassName: "name-column--cell" },
    { field: "responsibility", headerName: "Responsibility", flex: 1,cellClassName: "name-column--cell" },
  
    
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
   renderCell: (params) => (
      <Box  sx={{ display: 'flex', justifyContent: 'center' }}>
      
       {canDelete &&(
              <Tooltip title="Delete Skill of Employee">
              <IconButton onClick={() => handleDelete(employerId, params.row.id)}  color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
       )}

       {canEdit && (
        
        <Tooltip title="Update">
        <IconButton
             onClick={() => handleEditExperence(employerId, params.row.id)}  color="primary" >
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
      <Header subtitle="List of employee exprience"/>
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={experence}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
      </Box>
  );
};

export default ListExperence;

