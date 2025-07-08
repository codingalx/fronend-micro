import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { getAllStoreCategories } from "../../Api/storeApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import Header from "../../common/Header";

const ListStoreCategory = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStoreCategories();
  }, [refreshKey]);
  const [categories, setCategories] = useState([]);

  const fetchStoreCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllStoreCategories(tenantId);
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching store categories:', error);
      setLoading(false);
    }
  };

  const handleUpdate = (id) => {
    navigate('/store/update-store-category', { state: { categoryId: id } });
  };

  const handleDelete = (id, name) => {
    navigate('/store/delete-store-category', { state: { categoryId: id, name } });
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="Update Category">
            <IconButton
              onClick={() => handleUpdate(params.row.id)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Category">
            <IconButton
              onClick={() => handleDelete(params.row.id, params.row.name)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header subtitle="List Of Store Categories" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={categories}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          autoHeight
          checkboxSelection={false}
         
        />
      </Box>
    </Box>
  );
};

export default ListStoreCategory;