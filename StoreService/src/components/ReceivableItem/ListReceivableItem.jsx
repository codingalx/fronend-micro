import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { 
  getAllReceivableItems,
  getGoodReceivingNoteById,
  getForReceivableItemsById,
  getItemById
} from "../../Api/storeApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import Header from "../../common/Header";

const ListReceivableItem = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [receivableItems, setReceivableItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReceivableItems();
  }, [refreshKey]);

  const fetchDetails = async (item) => {
    try {
      // Fetch item code if itemId exists
      let itemCode = 'N/A';
      if (item.itemId) {
        const itemResponse = await getItemById(tenantId, item.itemId);
        itemCode = itemResponse.data?.itemCode || 'N/A';
      }

      // Fetch receivable item reference number based on type
      let receivableRef = 'N/A';
      if (item.type === "ISIV" && item.receivableItemId) {
        const isivResponse = await getForReceivableItemsById(tenantId, item.receivableItemId);
        receivableRef = isivResponse.data?.receivingISIV_NO || 'N/A';
      } else if (item.type === "GRN" && item.receivableItemId) {
        const grnResponse = await getGoodReceivingNoteById(tenantId, item.receivableItemId);
        receivableRef = grnResponse.data?.grn_NO || 'N/A';
      }

      return {
        ...item,
        itemCode,
        receivableRef,
        type: item.type || 'N/A'
      };
    } catch (error) {
      console.error(`Error fetching details for item ${item.id}:`, error);
      return {
        ...item,
        itemCode: 'Error',
        receivableRef: 'Error',
        type: item.type || 'Error'
      };
    }
  };

  const fetchReceivableItems = async () => {
    try {
      setLoading(true);
      const response = await getAllReceivableItems(tenantId);
      
      // Fetch details for each item in parallel
      const itemsWithDetails = await Promise.all(
        response.data.map(async (item) => {
          return await fetchDetails(item);
        })
      );

      setReceivableItems(itemsWithDetails);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching receivable items:', error);
      setLoading(false);
    }
  };

  const handleUpdate = (id) => {
    navigate('/store/update-receivable-item', { state: { receivableItemId: id } });
  };

  const handleDelete = (id, type, itemCode) => {
    navigate('/store/delete-receivable-item', { 
      state: { 
        receivableItemId: id,
        type: type,
        itemCode: itemCode // Added itemCode to the delete state
      } 
    });
  };

  const columns = [
    { field: "type", headerName: "Type", flex: 0.5 },
    { 
      field: "receivableRef", 
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
        <Tooltip title={`ID: ${params.row.itemId || 'N/A'}`}>
          <span>{params.value}</span>
        </Tooltip>
      )
    },
    { field: "storeName", headerName: "Store Name", flex: 1 },
    { field: "shelfCode", headerName: "Shelf Code", flex: 1 },
    { field: "cellCode", headerName: "Cell Code", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 0.8 },
 
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <Tooltip title="Update Receivable Item">
            <IconButton
              onClick={() => handleUpdate(params.row.id)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Receivable Item">
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
      <Header subtitle="List Of Receivable Items" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={receivableItems}
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

export default ListReceivableItem;