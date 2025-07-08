import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { getAllStores, getStoreCategoryById } from "../../Api/storeApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import Header from "../../common/Header";

const ListStore = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [stores, setStores] = useState([]);
  const [categoryNames, setCategoryNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStores();
  }, [refreshKey]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await getAllStores(tenantId);
      const storesData = response.data;
      setStores(storesData);
      
      // Get unique category IDs
      const categoryIds = [...new Set(
        storesData.map(store => store.category).filter(Boolean)
      )];
      
      // Fetch category names
      const names = {};
      await Promise.all(
        categoryIds.map(async (id) => {
          try {
            const categoryResponse = await getStoreCategoryById(tenantId, id);
            names[id] = categoryResponse.data.name;
          } catch (error) {
            console.error(`Error fetching category ${id}:`, error);
            names[id] = `Unknown (${id})`;
          }
        })
      );
      
      setCategoryNames(names);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching stores:', error);
      setLoading(false);
    }
  };

  const handleUpdate = (id) => {
    navigate('/store/update-store', { state: { storeId: id } });
  };

  const handleDelete = (id, name) => {
    navigate('/store/delete-store', { state: { storeId: id, name } });
  };

  const handleCreateShelf = (store) => {
    navigate('/store/create-shelf', { 
      state: { 
        storeId: store.id,
        storeName: store.storeName,
        categoryId: store.category,
        categoryName: categoryNames[store.category] || 'Unknown'
      } 
    });
  };


  const renderCategory = (params) => {
    if (!params.row.category) {
      return 'None';
    }
    return categoryNames[params.row.category] || `Loading... (${params.row.category})`;
  };

  const columns = [
    { field: "srNo", headerName: "SR No", flex: 1 },
    { field: "storeName", headerName: "Store Name", flex: 1 },
    { 
      field: "category", 
      headerName: "Category", 
      flex: 1,
      renderCell: renderCategory,
    },
    { field: "subCategory", headerName: "Sub Category", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "poBox", headerName: "PO Box", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
         
          <Tooltip title="Update Store">
            <IconButton
              onClick={() => handleUpdate(params.row.id)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Store">
            <IconButton
              onClick={() => handleDelete(params.row.id, params.row.storeName)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
           <Tooltip title="Create Shelf">
            <IconButton
              onClick={() => handleCreateShelf(params.row)}
              color="success"
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header subtitle="List Of Stores" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={stores}
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

export default ListStore;