import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { getAllStoreRequisitions, getItemById, getStoreById } from "../../Api/storeApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import Header from "../../common/Header";

const ListStoreRequisition = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemNames, setItemNames] = useState({});
  const [storeNames, setStoreNames] = useState({});

  useEffect(() => {
    fetchRequisitions();
  }, [refreshKey]);

  const fetchRequisitions = async () => {
    try {
      setLoading(true);
      const response = await getAllStoreRequisitions(tenantId);
      const requisitionsData = response.data;
      setRequisitions(requisitionsData);
      
      // Get unique item IDs
      const itemIds = [...new Set(
        requisitionsData.map(req => req.itemCode).filter(Boolean)
      )];
      
      // Get unique store IDs
      const storeIds = [...new Set(
        requisitionsData.map(req => req.requestStoreId).filter(Boolean)
      )];
      
      // Fetch item names
      const itemNamesMap = {};
      await Promise.all(
        itemIds.map(async (id) => {
          try {
            const itemResponse = await getItemById(tenantId, id);
            itemNamesMap[id] = itemResponse.data.itemCode || `Item (${id})`;
          } catch (error) {
            console.error(`Error fetching item ${id}:`, error);
            itemNamesMap[id] = `Unknown Item (${id})`;
          }
        })
      );
      
      // Fetch store names
      const storeNamesMap = {};
      await Promise.all(
        storeIds.map(async (id) => {
          try {
            const storeResponse = await getStoreById(tenantId, id);
            storeNamesMap[id] = storeResponse.data.storeName || `Store (${id})`;
          } catch (error) {
            console.error(`Error fetching store ${id}:`, error);
            storeNamesMap[id] = `Unknown Store (${id})`;
          }
        })
      );
      
      setItemNames(itemNamesMap);
      setStoreNames(storeNamesMap);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching store requisitions:', error);
      setLoading(false);
    }
  };

  const handleUpdate = (id) => {
    navigate('/store/update-store-requisition', { state: { requisitionId: id } });
  };

  const handleDelete = (id, srNo) => {
    navigate('/store/delete-store-requisition', { state: { requisitionId: id, srNo } });
  };

  const renderItem = (params) => {
    if (!params.row.itemCode) return 'None';
    return itemNames[params.row.itemCode] || `Loading... (${params.row.itemCode})`;
  };

  const renderStore = (params) => {
    if (!params.row.requestStoreId) return 'None';
    return storeNames[params.row.requestStoreId] || `Loading... (${params.row.requestStoreId})`;
  };

  const columns = [
    { field: "srNo", headerName: "SR No", flex: 1 },
    { field: "requisitionDate", headerName: "Requisition Date", flex: 1 },
    { field: "requestedBy", headerName: "Requested By", flex: 1 },
    { 
      field: "itemCode", 
      headerName: "Item", 
      flex: 1,
      renderCell: renderItem
    },
    { 
      field: "requestStoreId", 
      headerName: "Store", 
      flex: 1,
      renderCell: renderStore
    },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    { field: "createdBy", headerName: "Created By", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <Tooltip title="Update Requisition">
            <IconButton
              onClick={() => handleUpdate(params.row.id)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Requisition">
            <IconButton
              onClick={() => handleDelete(params.row.id, params.row.srNo)}
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
      <Header subtitle="List Of Store Requisitions" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={requisitions}
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

export default ListStoreRequisition;