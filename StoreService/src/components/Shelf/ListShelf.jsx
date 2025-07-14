import React, { useEffect, useState } from "react";
import { 
  Box, 
  useTheme, 
  Tooltip, 
  IconButton, 
  TextField, 
  Button, 
  Autocomplete,
  CircularProgress
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../common/theme";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { getAllShelves, getStoreById, getStoreCategoryById } from "../../Api/storeApi";
import { getAllStores } from "../../Api/storeApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import Header from "../../common/Header";

const ListShelf = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [shelves, setShelves] = useState([]);
  const [enhancedShelves, setEnhancedShelves] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [storeLoading, setStoreLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [hasFetched, setHasFetched] = useState(false);

  // Fetch stores on mount
  useEffect(() => {
    fetchStores();
  }, []);

  // Enhance shelf data when shelves change
  useEffect(() => {
    if (shelves.length > 0) {
      enhanceShelfData();
    } else {
      setEnhancedShelves([]);
    }
  }, [shelves]);

  const fetchStores = async () => {
    try {
      setStoreLoading(true);
      const response = await getAllStores(tenantId);
      setStores(response.data);
      setStoreLoading(false);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching stores:', error);
      setStoreLoading(false);
    }
  };

  const fetchShelves = async () => {
    if (!selectedStore) return;
    
    try {
      setLoading(true);
      setHasFetched(true);
      const response = await getAllShelves(tenantId, selectedStore.id);
      setShelves(response.data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching shelves:', error);
    } finally {
      setLoading(false);
    }
  };

  const enhanceShelfData = async () => {
    setEnhancing(true);
    try {
      const enhancedData = await Promise.all(shelves.map(async (shelf) => {
        let detailedStoreName = shelf.storeName;
        if (shelf.store) {
          try {
            const storeResponse = await getStoreById(tenantId, shelf.store);
            detailedStoreName = storeResponse.data.storeName || shelf.storeName;
          } catch (error) {
            console.error(`Error fetching store ${shelf.store}:`, error);
            detailedStoreName = `Unknown (${shelf.store})`;
          }
        }

        let categoryName = 'None';
        if (shelf.storeCategoryId) {
          try {
            const categoryResponse = await getStoreCategoryById(tenantId, shelf.storeCategoryId);
            categoryName = categoryResponse.data.name;
          } catch (error) {
            console.error(`Error fetching category ${shelf.storeCategoryId}:`, error);
            categoryName = `Unknown (${shelf.storeCategoryId})`;
          }
        }

        return {
          ...shelf,
          originalStoreName: shelf.storeName,
          enhancedStoreName: detailedStoreName,
          storeCategoryName: categoryName,
          // storeType: shelf.storeType === 'INTERNAL' ? 'Internal' : 'External'
        };
      }));

      setEnhancedShelves(enhancedData);
    } catch (error) {
      console.error('Error enhancing shelf data:', error);
      setEnhancedShelves(shelves.map(shelf => ({
        ...shelf,
        originalStoreName: shelf.storeName,
        enhancedStoreName: shelf.storeName,
        storeCategoryName: 'Error loading category',
        // storeType: shelf.storeType === 'INTERNAL' ? 'Internal' : 'External'
      })));
    } finally {
      setEnhancing(false);
    }
  };

  const handleUpdate = (shelf) => {
    navigate('/store/update-shelf', { 
      state: { 
        shelfId: shelf.id,
        storeId: shelf.store,
    
      } 
    });
  };

  const handleDelete = (shelf) => {
    navigate('/store/delete-shelf', { 
      state: { 
        shelfId: shelf.id,
        storeId: shelf.store,
        name: shelf.shelfCode,
        shelfData: shelf
      } 
    });
  };

  const handleCreateCell = (shelf) => {
    navigate('/store/create-cell', {
      state: {
        shelfId: shelf.id,
        storeId: shelf.store,
      }
    });
  };

  const columns = [
    { field: "shelfCode", headerName: "Shelf Code", flex: 1 },
    { field: "enhancedStoreName", headerName: "Store Name", flex: 1 },
    { field: "storeCategoryName", headerName: "Store Category", flex: 1 },
    { field: "storeType", headerName: "Store Type", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 220,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
         
          <Tooltip title="Update Shelf">
            <IconButton 
              onClick={() => handleUpdate(params.row)} 
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Shelf">
            <IconButton 
              onClick={() => handleDelete(params.row)} 
              color="error"   
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
           <Tooltip title="Create Cell">
            <IconButton 
              onClick={() => handleCreateCell(params.row)} 
              color="success"
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const filteredStores = stores.filter(store => 
    store.storeName.toLowerCase().includes(searchInput.toLowerCase()) || 
    store.srNo.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <Box m="20px">
      <Header subtitle="List Of Shelves" />
      
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Autocomplete
          options={filteredStores}
          getOptionLabel={(option) => `${option.storeName} (${option.srNo})`}
          value={selectedStore}
          onChange={(event, newValue) => {
            setSelectedStore(newValue);
            setHasFetched(false);
          }}
          inputValue={searchInput}
          onInputChange={(event, newInputValue) => setSearchInput(newInputValue)}
          loading={storeLoading}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Search Store" 
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {storeLoading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
        
        <Button 
          color="secondary" 
          variant="contained" 
          onClick={fetchShelves}
          disabled={!selectedStore || loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? <CircularProgress size={24} /> : "List Shelves"}
        </Button>
      </Box>
      
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={hasFetched ? enhancedShelves : []}
          columns={columns}
          loading={loading || enhancing}
          getRowId={(row) => row.id}
          autoHeight
          checkboxSelection={false}
        
        />
      </Box>
    </Box>
  );
};

export default ListShelf;