
import React, { useEffect, useState ,useContext} from "react";
import { Box, Tooltip,IconButton , useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../common/Header";
import { tokens } from "../common/theme";
import { listOfEducation } from "../../Api/employeeApi";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { canAccessResource } from "../../Api/SecurityService";
import EmployeeServiceResourceName from "../../Api/EmployeeServiceResourceName";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const ListEducation = ({ employerId, refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
   const [authState] = useAtom(authAtom); 
      const userRoles = authState.roles
      const tenantId = authState.tenantId


 

  const [education, setEducation] = useState([]);
  const [error, setError] = useState(null);

  
  const handleEditEducation = (employerId, id) => {
    navigate('/employee/update_education', { state: { employerId, id } });
  };

  const handleDelete = (employerId, id) => {
    navigate('/employee/delete_education', { state: { employerId, id } });
  };

  useEffect(() => {
    fetchEducation();
    checkPermissions();
  }, [refreshKey]);

  const fetchEducation = async () => {
    try {
      const response = await listOfEducation(tenantId,employerId);
      const data = response.data;
      setEducation(data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);


  const checkPermissions = async () => {
    // Check permissions for actions
    const editAccess = await canAccessResource(EmployeeServiceResourceName.UPDATE_EDUCATION, userRoles);
    const deleteAccess = await canAccessResource(EmployeeServiceResourceName.DELETE_EDUCATION, userRoles);
  
    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
  };

  const columns = [

   
    { field: "institution", headerName: "institution", flex: 1 ,cellClassName: "name-column--cell"},
   
    { field: "startDate", headerName: "Start Date", flex: 1 ,cellClassName: "name-column--cell"},
    { field: "endDate", headerName: "End Date", flex: 1,cellClassName: "name-column--cell" },
    { field: "result", headerName: "result", flex: 1,cellClassName: "name-column--cell" },
   { field: "fileName", headerName: "Document", flex: 1 ,cellClassName: "name-column--cell"},
    
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
   renderCell: (params) => (
      <Box  sx={{ display: 'flex', justifyContent: 'center' }}>
        {canDelete  &&(
            <Tooltip title="Delete education of Employer">
            <IconButton onClick={() => handleDelete(employerId, params.row.id)}   color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
        
        {canEdit &&(
             <Tooltip title="Update">
             <IconButton
                   onClick={() => handleEditEducation(employerId, params.row.id)}   color="primary"  >
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
      <Header  subtitle="List of Employer education" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={education}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
     
    </Box>
  );
};

export default ListEducation;

