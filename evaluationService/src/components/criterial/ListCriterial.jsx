import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import EvaluationServiceResourceName from "../../../configuration/EvaluationServiceResourceName";
import { canAccessResource } from "../../../configuration/SecurityService";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import { getAllCriterial, getAllCategory } from "../../../configuration/EvaluationApi";

const ListCriterial = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); 
  const userRoles = authState.roles;
  const tenantId = authState.tenantId;
  const [allCriterial, setCriterial] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    fetchAllCategories();
    fetchAllCriterial();
    checkPermissions();
  }, [refreshKey]);

  const fetchAllCategories = async () => {
    try {
      const response = await getAllCategory(tenantId);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  const fetchAllCriterial = async () => {
    try {
      const response = await getAllCriterial(tenantId);
      const criterialData = response.data.map(criterial => ({
        ...criterial,
        categoryName: getCategoryName(criterial.categoryId)
      }));
      setCriterial(criterialData);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching criterial:", error.message);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const handleEditCriterial = (id) => {
    navigate('/evaluation/update_criterial', { state: { id } });
  };

  const handleDeleteCriterial = (id, name) => {
    navigate('/evaluation/delete_criterial', { state: { id, name } });
  };

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(EvaluationServiceResourceName.ADD_EVALUATION_CRITERIA, userRoles);
    const deleteAccess = await canAccessResource(EvaluationServiceResourceName.ADD_EVALUATION_CRITERIA, userRoles);
  
    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
  };

  const columns = [
    {
      field: "categoryId",
      headerName: "Category Name",
      flex: 1,
      renderCell: (params) => getCategoryName(params.row.categoryId),
    },
    { field: "name", headerName: "Criterial Name", flex: 1 },
    { field: "weight", headerName: "Weight", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {canDelete && (
            <Tooltip title="Delete Evaluation Criterial">
              <IconButton
                onClick={() => handleDeleteCriterial(params.row.id, params.row.name)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          {canEdit && (
            <Tooltip title="Update Evaluation Criterial">
              <IconButton
                onClick={() => handleEditCriterial(params.row.id)}
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
      <Header subtitle="List Of Evaluation Criterial" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={allCriterial}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default ListCriterial;