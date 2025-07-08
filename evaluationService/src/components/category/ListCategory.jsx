
import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import EvaluationServiceResourceName from "../../../configuration/EvaluationServiceResourceName";
import Header from "../common/Header";
import { canAccessResource } from "../../../configuration/SecurityService";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import { getAllCategory } from "../../../configuration/EvaluationApi";




const ListCategory = ( {refreshKey} ) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); 
const userRoles = authState.roles
const tenantId = authState.tenantId;

  const [allCategory, setAllcategory] = useState([]);
  
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllCategory();
    checkPermissions();
  }, [refreshKey]); 

  const fetchAllCategory = async () => {
    try {
      const response = await getAllCategory(tenantId);
      setAllcategory(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleEditCategory = (id) => {
    navigate('/evaluation/update_category', { state: { id } });
  };

  const handleDeleteCategory = (id,name) => {
    navigate('/evaluation/delete_category', { state: {  id ,name} });
  };

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);


  const checkPermissions = async () => {
    const editAccess = await canAccessResource(EvaluationServiceResourceName.UPDATE_EVALUATION_CATEGORY, userRoles);
    const deleteAccess = await canAccessResource(EvaluationServiceResourceName.DELETE_EVALUATION_CATEGORY, userRoles);
  
    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
  };

 
  const columns = [
    { field: "name", headerName: "Country Name", flex: 1 },
    { field: "weight", headerName: "Weight", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          
          {canDelete && (
            <Tooltip title="Delete Evaluation Category">
           <IconButton
                onClick={() => handleDeleteCategory(params.row.id,params.row.name)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}


          {canEdit && (
            <Tooltip title="Update evaluation Category">
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
      <Header subtitle= "List Of Evaluation Category"/>
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={allCategory}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default ListCategory;