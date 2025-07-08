import React, { useEffect, useState, useContext } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import { listCourseCategory } from "../../../configuration/TrainingApi";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { canAccessResource } from "../../../configuration/SecurityService";
import TrainingServiceResourceName from '../../../configuration/TrainingServiceResourceName'
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';

const ListCourseCategory = ( {refreshKey} ) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
     const [authState] = useAtom(authAtom); // Access the shared authentication state
      const tenantId = authState.tenantId
      const userRoles = authState.roles;
  
  const [category, setCategory] = useState([]);

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrainingCourseCategory();
    checkPermissions();
  }, [refreshKey]); 

  const fetchTrainingCourseCategory = async () => {
    try {
      const response = await listCourseCategory(tenantId);
      setCategory(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleEditCategory = (id) => {
    navigate('/training/editcategory', { state: {  id } });
  };

  const handleDeleteCategory = (id,categoryName) => {
    navigate('/training/deletecategory', { state: { categoryName, id } });
  };

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);


  const checkPermissions = async () => {
    const editAccess = await canAccessResource(TrainingServiceResourceName.UPDATE_TRAINING_COURSE_CATEGORY, userRoles);
    const deleteAccess = await canAccessResource(TrainingServiceResourceName.DELETE_TRAINING_COURSE_CATEGORY, userRoles);

    console.log("Edit Access:", editAccess);
    console.log("Delete Access:", deleteAccess);
  
    setCanEdit(!editAccess);
    setCanDelete(!deleteAccess);
  };

  const columns = [
    { field: "categoryName", headerName: "Category Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          
          {canDelete && (
            <Tooltip title="Delete Course Category">
     
           <IconButton
                onClick={() => handleDeleteCategory(params.row.id,params.row.categoryName)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}


          {canEdit && (
            <Tooltip title="Update Course Category">
              <IconButton
                onClick={() => handleEditCategory(params.row.id)}
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
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={category}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default ListCourseCategory;