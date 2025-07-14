import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  Autocomplete,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik, Form } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  updateReceivableItem,
  getReceivableItemById,
  getAllItems,
  getAllStores,
  getAllShelves,
  getAllCells,
  getAllForReceivableItems,
  getAllGoodReceivingNotes
} from "../../Api/storeApi";
import NoPageHandle from "../../common/NoPageHandle";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import Header from "../../common/Header";

const UpdateReceivableItem = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const location = useLocation();
  const navigate = useNavigate();
  const { receivableItemId } = location.state || {};

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [items, setItems] = useState([]);
  const [stores, setStores] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [cells, setCells] = useState([]);
  const [receivableItems, setReceivableItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingStores, setLoadingStores] = useState(false);
  const [loadingShelves, setLoadingShelves] = useState(false);
  const [loadingCells, setLoadingCells] = useState(false);
  const [loadingReceivableItems, setLoadingReceivableItems] = useState(false);
  const [initialValues, setInitialValues] = useState({
    itemId: "",
    shelfId: "",
    receivableItemId: "",
    storeId: "",
    cellId: "",
    quantity: 0,
    type: "ISIV" // Initialize with default type
  });

  useEffect(() => {
    fetchAllItems();
    fetchAllStores();
    if (receivableItemId) {
      fetchReceivableItem();
    }
  }, []);

  const fetchAllItems = async () => {
    setLoadingItems(true);
    try {
      const response = await getAllItems(tenantId);
      setItems(response.data.map(item => ({
        id: item.id,
        label: item.itemCode || `Item ${item.id}`,
        name: item.itemName
      })));
    } catch (error) {
      console.error("Error fetching items:", error);
      setNotification({
        open: true,
        message: "Failed to fetch items. Please try again.",
        severity: "error",
      });
    } finally {
      setLoadingItems(false);
    }
  };

  const fetchAllStores = async () => {
    setLoadingStores(true);
    try {
      const response = await getAllStores(tenantId);
      setStores(response.data.map(store => ({
        id: store.id,
        label: store.storeName || `Store ${store.id}`,
      })));
    } catch (error) {
      console.error("Error fetching stores:", error);
      setNotification({
        open: true,
        message: "Failed to fetch stores. Please try again.",
        severity: "error",
      });
    } finally {
      setLoadingStores(false);
    }
  };

  const fetchShelvesByStore = async (storeId) => {
    if (!storeId) return;
    setLoadingShelves(true);
    try {
      const response = await getAllShelves(tenantId, storeId);
      setShelves(response.data.map(shelf => ({
        id: shelf.id,
        label: shelf.shelfCode || `Shelf ${shelf.id}`,
      })));
    } catch (error) {
      console.error("Error fetching shelves:", error);
      setNotification({
        open: true,
        message: "Failed to fetch shelves. Please try again.",
        severity: "error",
      });
    } finally {
      setLoadingShelves(false);
    }
  };

  const fetchCellsByShelf = async (shelfId) => {
    if (!shelfId) return;
    setLoadingCells(true);
    try {
      const response = await getAllCells(tenantId, shelfId);
      setCells(response.data.map(cell => ({
        id: cell.id,
        label: cell.cellCode || `Cell ${cell.id}`,
      })));
    } catch (error) {
      console.error("Error fetching cells:", error);
      setNotification({
        open: true,
        message: "Failed to fetch cells. Please try again.",
        severity: "error",
      });
    } finally {
      setLoadingCells(false);
    }
  };

  const fetchReceivableItems = async (currentType) => {
    setLoadingReceivableItems(true);
    try {
      let response;
      if (currentType === "ISIV") {
        response = await getAllForReceivableItems(tenantId);
        setReceivableItems(response.data.map(item => ({
          id: item.id,
          label: item.receivingISIV_NO || `Receivable ${item.id}`,
        })));
      } else {
        response = await getAllGoodReceivingNotes(tenantId);
        setReceivableItems(response.data.map(item => ({
          id: item.id,
          label: item.grn_NO || `GRN ${item.id}`,
        })));
      }
    } catch (error) {
      console.error("Error fetching receivable items:", error);
      setNotification({
        open: true,
        message: "Failed to fetch receivable items. Please try again.",
        severity: "error",
      });
    } finally {
      setLoadingReceivableItems(false);
    }
  };

  const fetchReceivableItem = async () => {
    try {
      const response = await getReceivableItemById(tenantId, receivableItemId);
      const data = response.data;
      
      // Set the type based on the receivable item
      const itemType = data.type || "ISIV";
      
      // Fetch shelves and cells based on the stored values
      if (data.storeId) {
        await fetchShelvesByStore(data.storeId);
      }
      if (data.shelfId) {
        await fetchCellsByShelf(data.shelfId);
      }
      
      // Fetch receivable items for the current type
      await fetchReceivableItems(itemType);
      
      setInitialValues({
        itemId: data.itemId,
        shelfId: data.shelfId,
        receivableItemId: data.receivableItemId,
        storeId: data.storeId,
        cellId: data.cellId,
        quantity: data.quantity,
        type: itemType
      });
    } catch (error) {
      console.error("Error fetching receivable item:", error);
      setNotification({
        open: true,
        message: "Failed to fetch receivable item details. Please try again.",
        severity: "error",
      });
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      await updateReceivableItem(tenantId, receivableItemId, {
        itemId: values.itemId,
        shelfId: values.shelfId,
        receivableItemId: values.receivableItemId,
        storeId: values.storeId,
        cellId: values.cellId,
        quantity: values.quantity,
        type: values.type
      });
      setNotification({
        open: true,
        message: "Receivable item updated successfully!",
        severity: "success",
      });
      resetForm();
      // navigate(-1);
        navigate('/store/create-receivable-item');
    } catch (error) {
      console.error("Failed to update receivable item:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to update receivable item. Please try again.",
        severity: "error",
      });
    }
  };

  const checkoutSchema = yup.object().shape({
    itemId: yup.string().required("Item is required"),
    shelfId: yup.string().required("Shelf is required"),
    receivableItemId: yup.string().required("Receivable item is required"),
    storeId: yup.string().required("Store is required"),
    cellId: yup.string().required("Cell is required"),
    quantity: yup.number()
      .min(1, "Quantity must be at least 1")
      .required("Quantity is required"),
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const handleTypeChange = (event, setFieldValue) => {
    const newType = event.target.value;
    setFieldValue("type", newType);
    setFieldValue("receivableItemId", ""); // Reset receivable item when type changes
    fetchReceivableItems(newType);
  };
  const handleNavigate = () => {
        navigate('/store/create-receivable-item');
    }



  if (!receivableItemId) {
    return (
      <NoPageHandle
        message="No receivable item selected for update."
        navigateTo={handleNavigate}
      />
    );
  }

  return (
    <Box m="20px">
      <Header subtitle="Update Receivable Item" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {/* Type Radio Buttons */}
              <Box sx={{ gridColumn: "span 4" }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Type</FormLabel>
                  <RadioGroup
                    row
                    aria-label="type"
                    name="type"
                    value={values.type}
                    onChange={(e) => handleTypeChange(e, setFieldValue)}
                  >
                    <FormControlLabel
                      value="ISIV"
                      control={<Radio />}
                      label="ISIV"
                    />
                    <FormControlLabel
                      value="GRN"
                      control={<Radio />}
                      label="GRN"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              {/* Item ID Autocomplete */}
              <Autocomplete
                sx={{ gridColumn: "span 2" }}
                options={items}
                loading={loadingItems}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                value={items.find(item => item.id === values.itemId) || null}
                onChange={(event, newValue) => {
                  setFieldValue("itemId", newValue?.id || "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Item"
                    error={!!touched.itemId && !!errors.itemId}
                    helperText={touched.itemId && errors.itemId}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingItems ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />

              {/* Receivable Item Autocomplete */}
              <Autocomplete
                sx={{ gridColumn: "span 2" }}
                options={receivableItems}
                loading={loadingReceivableItems}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                value={receivableItems.find(item => item.id === values.receivableItemId) || null}
                onChange={(event, newValue) => {
                  setFieldValue("receivableItemId", newValue?.id || "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={values.type === "ISIV" ? "ISIV Number" : "GRN Number"}
                    error={!!touched.receivableItemId && !!errors.receivableItemId}
                    helperText={touched.receivableItemId && errors.receivableItemId}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingReceivableItems ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />

              {/* Store Autocomplete */}
              <Autocomplete
                sx={{ gridColumn: "span 2" }}
                options={stores}
                loading={loadingStores}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                value={stores.find(store => store.id === values.storeId) || null}
                onChange={(event, newValue) => {
                  setFieldValue("storeId", newValue?.id || "");
                  setFieldValue("shelfId", "");
                  setFieldValue("cellId", "");
                  if (newValue?.id) {
                    fetchShelvesByStore(newValue.id);
                  } else {
                    setShelves([]);
                    setCells([]);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Store"
                    error={!!touched.storeId && !!errors.storeId}
                    helperText={touched.storeId && errors.storeId}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingStores ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />

              {/* Shelf Autocomplete */}
              <Autocomplete
                sx={{ gridColumn: "span 2" }}
                options={shelves}
                loading={loadingShelves}
                disabled={!values.storeId}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                value={shelves.find(shelf => shelf.id === values.shelfId) || null}
                onChange={(event, newValue) => {
                  setFieldValue("shelfId", newValue?.id || "");
                  setFieldValue("cellId", "");
                  if (newValue?.id) {
                    fetchCellsByShelf(newValue.id);
                  } else {
                    setCells([]);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Shelf"
                    error={!!touched.shelfId && !!errors.shelfId}
                    helperText={touched.shelfId && errors.shelfId}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingShelves ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />

              {/* Cell Autocomplete */}
              <Autocomplete
                sx={{ gridColumn: "span 2" }}
                options={cells}
                loading={loadingCells}
                disabled={!values.shelfId}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                value={cells.find(cell => cell.id === values.cellId) || null}
                onChange={(event, newValue) => {
                  setFieldValue("cellId", newValue?.id || "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cell"
                    error={!!touched.cellId && !!errors.cellId}
                    helperText={touched.cellId && errors.cellId}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingCells ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />

              <TextField
                fullWidth
                type="number"
                label="Quantity"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.quantity}
                name="quantity"
                error={!!touched.quantity && !!errors.quantity}
                helperText={touched.quantity && errors.quantity}
                sx={{ gridColumn: "span 2" }}
                inputProps={{ min: 1 }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button 
                type="submit" 
                color="secondary" 
                variant="contained"
              >
                Update Receivable Item
              </Button>
            </Box>
          </Form>
        )}
      </Formik>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={notification.severity}
          elevation={6}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateReceivableItem;