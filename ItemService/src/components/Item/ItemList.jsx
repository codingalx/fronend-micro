import React, { useEffect, useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import { Tooltip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { getAllItems, getItemsByCategory, getItemsBySubCategory } from "../../Api/ItemServiceApi";
import Header from "../Header";

const ListItems = ({ refreshKey }) => {
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    loadAllItems();
  }, [refreshKey]);

  const loadAllItems = async () => {
    try {
      setLoading(true);
      const response = await getAllItems(tenantId);
      if (response?.data?.length) {
        setAllItems(response.data);
        setFilteredItems(response.data);
        extractFilterOptions(response.data);
      }
    } catch (error) {
      console.error("Error fetching items", error);
    } finally {
      setLoading(false);
    }
  };

  const extractFilterOptions = (items) => {
    const uniqueCategories = [...new Set(items.map(item => item.category).filter(Boolean))];
    setCategories(uniqueCategories);
    
    updateSubCategoryOptions(items, selectedCategory);
  };

  const updateSubCategoryOptions = (items, category) => {
    const relevantItems = category 
      ? items.filter(item => item.category === category) 
      : items;
    
    const uniqueSubCategories = [
      ...new Set(relevantItems.map(item => item.subCategory).filter(Boolean))
    ];
    setSubCategories(uniqueSubCategories);
  };

  // Handle category change
  const handleCategoryChange = async (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    setSelectedSubCategory(""); // Reset subcategory when category changes
    
    try {
      setLoading(true);
      if (!category) {
        // If "All Categories" is selected, show all items
        setFilteredItems(allItems);
        updateSubCategoryOptions(allItems, "");
      } else {
        // Fetch items by category
        const response = await getItemsByCategory(tenantId, category);
        if (response?.data?.length) {
          setFilteredItems(response.data);
          updateSubCategoryOptions(response.data, category);
        } else {
          setFilteredItems([]);
          setSubCategories([]);
        }
      }
    } catch (error) {
      console.error("Error fetching items by category", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle subcategory change
  const handleSubCategoryChange = async (event) => {
    const subCategory = event.target.value;
    setSelectedSubCategory(subCategory);
    
    try {
      setLoading(true);
      if (!subCategory) {
        // If "All Subcategories" is selected, show items for the selected category
        if (selectedCategory) {
          const response = await getItemsByCategory(tenantId, selectedCategory);
          setFilteredItems(response?.data || []);
        } else {
          setFilteredItems(allItems);
        }
      } else {
        // Fetch items by subcategory
        const response = await getItemsBySubCategory(tenantId, subCategory);
        setFilteredItems(response?.data || []);
      }
    } catch (error) {
      console.error("Error fetching items by subcategory", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (itemId, name) => {
    navigate(`/item/delete-item`, { state: { itemId, name } });
  };

  const handleEdit = (itemId) => {
    navigate(`/item/update-item`, { state: { itemId } });
  };

  const columns = [
    { field: "itemCode", headerName: "Item Code", flex: 1 },
    { field: "itemName", headerName: "Item Name", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "subCategory", headerName: "Subcategory", flex: 1 },
    { field: "itemCategory", headerName: "Item Type", flex: 1 },
    { field: "stockMovementType", headerName: "Stock Movement", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    { field: "unitPrice", headerName: "Unit Price", flex: 1 },
    { field: "totalPrice", headerName: "Total Price", flex: 1 },
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
            <IconButton onClick={() => handleDelete(params.row.id, params.row.itemName)} color="error" size="small">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Box m="20px">
      <Header subtitle="List of Items" />
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Filter by Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              label="Filter by Category"
            >
              <MenuItem value="">
                <em>All Categories</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Filter by Subcategory</InputLabel>
            <Select
              value={selectedSubCategory}
              onChange={handleSubCategoryChange}
              label="Filter by Subcategory"
              disabled={!selectedCategory && subCategories.length === 0}
            >
              <MenuItem value="">
                <em>All Subcategories</em>
              </MenuItem>
              {subCategories.map((subCat) => (
                <MenuItem key={subCat} value={subCat}>
                  {subCat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={filteredItems}
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

export default ListItems;