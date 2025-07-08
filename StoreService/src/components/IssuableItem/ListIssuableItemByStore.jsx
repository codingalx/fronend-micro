import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton, Autocomplete, TextField, Button, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../common/theme";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { 
  getIssuableItemsByStore,
  getAllStores,
  getReceivableItemById,
  getForIssuableItemsById,
  getStoreIssueVoucherById
} from "../../Api/storeApi";
import { getItemById } from "../../Api/storeApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import Header from "../../common/Header";

const ListIssuableItemByStore = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [issuableItems, setIssuableItems] = useState([]);
  const [loading, setLoading] = useState({
    stores: true,
    items: false
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllStores();
  }, []);

  const fetchAllStores = async () => {
    try {
      setLoading(prev => ({...prev, stores: true}));
      const response = await getAllStores(tenantId);
      setStores(response.data);
      setLoading(prev => ({...prev, stores: false}));
    } catch (error) {
      setError(error.message);
      console.error('Error fetching stores:', error);
      setLoading(prev => ({...prev, stores: false}));
    }
  };

  const fetchDetails = async (item) => {
    try {
      // Fetch item code
      const itemResponse = await getItemById(tenantId, item.itemId);
      const itemCode = itemResponse.data?.itemCode || 'N/A';

      // Fetch receivable item quantity
      const receivableResponse = await getReceivableItemById(tenantId, item.receivableItemId);
      const receivableQuantity = receivableResponse.data?.quantity || 'N/A';

      // Fetch issuable item reference number based on type
      let issuableRef = 'N/A';
      if (item.type === "ISIV") {
        const isivResponse = await getForIssuableItemsById(tenantId, item.issuableItemId);
        issuableRef = isivResponse.data?.itemTransferNo || 'N/A';
      } else if (item.type === "SIV") {
        const sivResponse = await getStoreIssueVoucherById(tenantId, item.issuableItemId);
        issuableRef = sivResponse.data?.siv_NO || 'N/A';
      }

      return {
        ...item,
        itemCode,
        receivableQuantity,
        issuableRef
      };
    } catch (error) {
      console.error(`Error fetching details for item ${item.id}:`, error);
      return {
        ...item,
        itemCode: 'Error',
        receivableQuantity: 'Error',
        issuableRef: 'Error'
      };
    }
  };

  const fetchIssuableItemsByStore = async () => {
    if (!selectedStore) return;
    
    try {
      setLoading(prev => ({...prev, items: true}));
      const response = await getIssuableItemsByStore(tenantId, selectedStore.id);
      
      // Fetch details for each item in parallel
      const itemsWithDetails = await Promise.all(
        response.data.map(async (item) => {
          return await fetchDetails(item);
        })
      );

      setIssuableItems(itemsWithDetails);
      setLoading(prev => ({...prev, items: false}));
    } catch (error) {
      setError(error.message);
      console.error('Error fetching issuable items by store:', error);
      setLoading(prev => ({...prev, items: false}));
    }
  };

  const handleCreateAdditional = (itemId) => {
    navigate('/store/create-issuable-item', { state: { itemId } });
  };

  const handleDelete = (id, type, itemCode) => {
    navigate('/store/delete-issuable-item', { 
      state: { 
        issuableItemId: id,
        type: type,
        itemCode: itemCode
      } 
    });
  };

  const columns = [
    { field: "type", headerName: "Type", flex: 0.5 },
    { 
      field: "issuableRef", 
      headerName: "Reference No", 
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      )
    },
    { 
      field: "itemCode", 
      headerName: "Item Code", 
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={`ID: ${params.row.itemId}`}>
          <span>{params.value}</span>
        </Tooltip>
      )
    },
    { field: "storeName", headerName: "Store Name", flex: 1 },
    { field: "shelfCode", headerName: "Shelf Code", flex: 1 },
    { field: "cellCode", headerName: "Cell Code", flex: 1 },
    { field: "deductedQuantity", headerName: "Deducted Qty", flex: 0.8 },
    { 
      field: "receivableQuantity", 
      headerName: "Original Qty", 
      flex: 0.8,
      renderCell: (params) => (
        <Tooltip title="Quantity from original receivable item">
          <span>{params.value}</span>
        </Tooltip>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <Tooltip title="Create Additional Issue">
            <IconButton
              onClick={() => handleCreateAdditional(params.row.itemId)}
              color="primary"
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Issuable Item">
            <IconButton
              onClick={() => handleDelete(params.row.id, params.row.type, params.row.itemCode)}
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
      <Header subtitle="List Issuable Items By Store" />
      
      <Box m="20px 0">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={stores}
              getOptionLabel={(option) => option.storeName || ''}
              value={selectedStore}
              onChange={(event, newValue) => setSelectedStore(newValue)}
              loading={loading.stores}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Store"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading.stores ? 'Loading...' : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              color="secondary"
              onClick={fetchIssuableItemsByStore}
              disabled={!selectedStore || loading.items}
              fullWidth
              sx={{ height: '56px',
                 width: '200px'
               }}
            >
              List Issuable Items
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={issuableItems}
          columns={columns}
          loading={loading.items}
          getRowId={(row) => row.id}
          autoHeight
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default ListIssuableItemByStore;