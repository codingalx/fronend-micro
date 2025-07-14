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
import { getAllCells } from "../../Api/storeApi";
import { getAllShelves, getStoreById, getAllStores } from "../../Api/storeApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import Header from "../../common/Header";

const ListCell = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [cells, setCells] = useState([]);
  const [enhancedCells, setEnhancedCells] = useState([]);
  const [stores, setStores] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [filteredShelves, setFilteredShelves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [storeLoading, setStoreLoading] = useState(false);
  const [shelfLoading, setShelfLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedShelf, setSelectedShelf] = useState(null);
  const [storeSearchInput, setStoreSearchInput] = useState("");
  const [shelfSearchInput, setShelfSearchInput] = useState("");
  const [hasFetched, setHasFetched] = useState(false);

  // Fetch stores on mount
  useEffect(() => {
    fetchStores();
  }, []);

  // Fetch shelves when store is selected
  useEffect(() => {
    if (selectedStore) {
      fetchShelves(selectedStore.id);
    } else {
      setShelves([]);
      setFilteredShelves([]);
      setSelectedShelf(null);
    }
  }, [selectedStore]);

  // Filter shelves based on search input
  useEffect(() => {
    if (shelfSearchInput && shelves.length > 0) {
      const filtered = shelves.filter(shelf => 
        shelf.shelfCode.toLowerCase().includes(shelfSearchInput.toLowerCase())
      );
      setFilteredShelves(filtered);
    } else {
      setFilteredShelves(shelves);
    }
  }, [shelfSearchInput, shelves]);

  // Enhance cell data when cells change
  useEffect(() => {
    if (cells.length > 0) {
      enhanceCellData();
    } else {
      setEnhancedCells([]);
    }
  }, [cells]);

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

  const fetchShelves = async (storeId) => {
    try {
      setShelfLoading(true);
      const response = await getAllShelves(tenantId, storeId);
      setShelves(response.data);
      setFilteredShelves(response.data);
      setShelfLoading(false);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching shelves:', error);
      setShelfLoading(false);
    }
  };

  const fetchCells = async () => {
    if (!selectedShelf) return;
    
    try {
      setLoading(true);
      setHasFetched(true);
      const response = await getAllCells(tenantId, selectedShelf.id);
      setCells(response.data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching cells:', error);
    } finally {
      setLoading(false);
    }
  };

  const enhanceCellData = async () => {
    setEnhancing(true);
    try {
      const enhancedData = await Promise.all(cells.map(async (cell) => {
        let detailedShelfCode = cell.shelfCode;
        let detailedStoreName = 'Unknown';
        let storeId = null;

        // Get shelf details
        if (selectedShelf) {
          detailedShelfCode = selectedShelf.shelfCode;
          storeId = selectedShelf.store;

          // Get store details
          if (storeId) {
            try {
              const storeResponse = await getStoreById(tenantId, storeId);
              detailedStoreName = storeResponse.data.storeName;
            } catch (error) {
              console.error(`Error fetching store ${storeId}:`, error);
            }
          }
        }

        return {
          ...cell,
          enhancedShelfCode: detailedShelfCode,
          enhancedStoreName: detailedStoreName,
          storeId: storeId, // Add storeId to the cell data
          cellCode: cell.cellCode || 'N/A',
          capacity: cell.capacity || 'N/A'
        };
      }));

      setEnhancedCells(enhancedData);
    } catch (error) {
      console.error('Error enhancing cell data:', error);
      setEnhancedCells(cells.map(cell => ({
        ...cell,
        enhancedShelfCode: selectedShelf?.shelfCode || 'Error loading',
        enhancedStoreName: selectedStore?.storeName || 'Error loading',
        storeId: selectedStore?.id || null, // Add storeId even in error case
        cellCode: cell.cellCode || 'N/A',
        capacity: cell.capacity || 'N/A'
      })));
    } finally {
      setEnhancing(false);
    }
  };

  const handleUpdate = (cell) => {
    navigate('/store/update-cell', { 
      state: { 
        cellId: cell.id,
        shelfId: cell.shelfId,
        storeId: cell.storeId, // Include storeId in the navigation state
        cellData: cell
      } 
    });
  };

  const handleDelete = (cell) => {
    navigate('/store/delete-cell', { 
      state: { 
        cellId: cell.id,
        shelfId: cell.shelfId,
        storeId: cell.storeId, // Include storeId in the navigation state
        name: cell.cellCode,
        cellData: cell
      } 
    });
  };

  const columns = [
    { field: "cellCode", headerName: "Cell Code", flex: 1 },
    { field: "shelfRow", headerName: "Shelf Row", flex: 1 },
    { field: "enhancedShelfCode", headerName: "Shelf Code", flex: 1 },
    { field: "enhancedStoreName", headerName: "Store Name", flex: 1 },
    { field: "storeType", headerName: "Store Type", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <Tooltip title="Update Cell">
            <IconButton 
              onClick={() => handleUpdate(params.row)} 
              color="primary"
              sx={{ color: colors.blueAccent[500] }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Cell">
            <IconButton 
              onClick={() => handleDelete(params.row)} 
              color="error"
              sx={{ color: colors.redAccent[500] }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const filteredStores = stores.filter(store => 
    store.storeName.toLowerCase().includes(storeSearchInput.toLowerCase()) || 
    store.srNo.toLowerCase().includes(storeSearchInput.toLowerCase())
  );

  return (
    <Box m="20px">
      <Header subtitle="List Of Cells" />
      
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        {/* Store Search */}
        <Autocomplete
          options={filteredStores}
          getOptionLabel={(option) => `${option.storeName} (${option.srNo})`}
          value={selectedStore}
          onChange={(event, newValue) => {
            setSelectedStore(newValue);
            setSelectedShelf(null);
            setHasFetched(false);
          }}
          inputValue={storeSearchInput}
          onInputChange={(event, newInputValue) => setStoreSearchInput(newInputValue)}
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
        
        {/* Shelf Search - only enabled when store is selected */}
        <Autocomplete
          options={filteredShelves}
          getOptionLabel={(option) => option.shelfCode}
          value={selectedShelf}
          onChange={(event, newValue) => {
            setSelectedShelf(newValue);
            setHasFetched(false);
          }}
          inputValue={shelfSearchInput}
          onInputChange={(event, newInputValue) => setShelfSearchInput(newInputValue)}
          loading={shelfLoading}
          disabled={!selectedStore}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Search Shelf" 
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {shelfLoading ? <CircularProgress color="inherit" size={20} /> : null}
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
          onClick={fetchCells}
          disabled={!selectedShelf || loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? <CircularProgress size={24} /> : "List Cells"}
        </Button>
      </Box>
      
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={hasFetched ? enhancedCells : []}
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

export default ListCell;