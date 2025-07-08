import React, { useEffect, useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import { Tooltip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { getAllInspections, getInspectionById, getItemById } from "../../Api/ItemServiceApi";
import Header from "../Header";

const ListInspectedItem = ({ refreshKey }) => {
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAllItems();
  }, [refreshKey]);

 const loadAllItems = async () => {
  try {
    setLoading(true);
    const response = await getAllInspections(tenantId);

 

    if (response?.data?.length) {
      const inspectionsWithItemNames = await Promise.all(
        response.data.map(async (inspection) => {
          try {
            const itemResponse = await getItemById(tenantId, inspection.itemId);
            return {
              ...inspection,
              itemName: itemResponse?.data?.itemName || "N/A",
            };
          } catch (error) {
            console.error(`Error fetching item ${inspection.itemId}:`, error);
            return {
              ...inspection,
              itemName: "N/A",
            };
          }
        })
      );
      setAllItems(inspectionsWithItemNames);
    } else {
      setAllItems([]);
    }
  } catch (error) {
    console.error("Error fetching inspections", error);
  } finally {
    setLoading(false);
  }
};


  const handleDelete = (inspectionId, name) => {
    navigate(`/item/delete-inspection`, { state: { inspectionId, name } });
  };

  const handleEdit = (inspectionId) => {
    navigate(`/item/update-inspection`, { state: { inspectionId} });
  };

  const columns = [
    { field: "commercialInvoice", headerName: "Commercial Invoice", flex: 1 },
    { field: "wayBillDate", headerName: "Way Bill Date", flex: 1 },
    { field: "storeName", headerName: "Store Name", flex: 1 },
    { field: "inspectionNumber", headerName: "Inspection Number", flex: 1 },
    { field: "workOrderNumber", headerName: "Work Order Number", flex: 1 },
    { field: "deliveryDate", headerName: "Delivery Date", flex: 1 },
    { field: "purchaseOrderNumber", headerName: "Purchase Order Number", flex: 1 },
    { field: "contractNumber", headerName: "Contract Number", flex: 1 },
    { 
      field: "itemName",  
      headerName: "Item Name",  
      flex: 1,
    },
    { field: "invoiceType", headerName: "Invoice Type", flex: 1 },
    { field: "donor", headerName: "Donor", flex: 1 },
    { 
      field: "actions", 
      headerName: "Actions", 
      width: 200, 
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit Item" arrow>
            <IconButton onClick={() => handleEdit(params.row.id)} color="primary" size="small">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Item" arrow>
            <IconButton 
              onClick={() => handleDelete(params.row.id, params.row.itemName)} 
              color="error" 
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Box m="20px">
      <Header subtitle="List of Inspected Items" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={allItems}
          columns={columns}
          loading={loading}
          autoHeight
          getRowId={(row) => row.id}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </Box>
    </Box>
  );
};

export default ListInspectedItem;