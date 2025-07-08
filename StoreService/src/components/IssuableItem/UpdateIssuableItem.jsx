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
  updateIssuableItem,
  getIssuableItemById,
  getAllItems,
  getAllStores,
  getAllShelves,
  getAllCells,
  getAllReceivableItems,
  getAllForIssuableItems,
  getAllStoreIssueVoucher,
  getReceivableItemById
} from "../../Api/storeApi";
import NoPageHandle from "../../common/NoPageHandle";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import Header from "../../common/Header";

const UpdateIssuableItem = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const location = useLocation();
  const navigate = useNavigate();
  const { issuableItemId } = location.state || {};

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
  const [issuableItems, setIssuableItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingStores, setLoadingStores] = useState(false);
  const [loadingShelves, setLoadingShelves] = useState(false);
  const [loadingCells, setLoadingCells] = useState(false);
  const [loadingReceivableItems, setLoadingReceivableItems] = useState(false);
  const [loadingIssuableItems, setLoadingIssuableItems] = useState(false);
  const [availableQuantity, setAvailableQuantity] = useState(null);
  const [initialValues, setInitialValues] = useState({
    itemCode: "",
    shelfId: "",
    issuableItemId: "",
    storeId: "",
    cellId: "",
    receivableItemId: "",
    deductedQuantity: 0,
    type: "ISIV"
  });

  useEffect(() => {
    fetchAllItems();
    fetchAllStores();
    if (issuableItemId) {
      fetchIssuableItem();
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

  const fetchReceivableItems = async (itemId) => {
    setLoadingReceivableItems(true);
    try {
      const response = await getAllReceivableItems(tenantId, itemId);
      setReceivableItems(response.data.map(item => ({
        id: item.id,
        label: `${item.quantity} units in (${item.storeName}) store` || `Receivable ${item.id}`,
        quantity: item.quantity,
        itemId: item.itemId
      })));
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

  const fetchIssuableItems = async (currentType) => {
    setLoadingIssuableItems(true);
    try {
      let response;
      if (currentType === "ISIV") {
        response = await getAllForIssuableItems(tenantId);
        setIssuableItems(response.data.map(item => ({
          id: item.id,
          label: item.itemTransferNo || `ISIV ${item.id}`,
        })));
      } else {
        response = await getAllStoreIssueVoucher(tenantId);
        setIssuableItems(response.data.map(item => ({
          id: item.id,
          label: item.siv_NO || `SIV ${item.id}`,
        })));
      }
    } catch (error) {
      console.error("Error fetching issuable items:", error);
      setNotification({
        open: true,
        message: "Failed to fetch issuable items. Please try again.",
        severity: "error",
      });
    } finally {
      setLoadingIssuableItems(false);
    }
  };

  const fetchReceivableItemQuantity = async (receivableItemId) => {
    try {
      const response = await getReceivableItemById(tenantId, receivableItemId);
      const quantity = response.data?.quantity || 0;
      setAvailableQuantity(quantity);
      return quantity;
    } catch (error) {
      console.error("Error fetching receivable item quantity:", error);
      setAvailableQuantity(null);
      return 0;
    }
  };

  const fetchIssuableItem = async () => {
    try {
      const response = await getIssuableItemById(tenantId, issuableItemId);
      const data = response.data;
      
      const itemType = data.type || "ISIV";
      
      if (data.storeId) {
        await fetchShelvesByStore(data.storeId);
      }
      if (data.shelfId) {
        await fetchCellsByShelf(data.shelfId);
      }
      
      // Fetch receivable items for the specific item
      if (data.itemId) {
        await fetchReceivableItems(data.itemId);
      }
      
      await fetchIssuableItems(itemType);
      
      if (data.receivableItemId) {
        await fetchReceivableItemQuantity(data.receivableItemId);
      }
      
      setInitialValues({
        itemCode: data.itemId,
        shelfId: data.shelfId,
        issuableItemId: data.issuableItemId,
        storeId: data.storeId,
        cellId: data.cellId,
        receivableItemId: data.receivableItemId,
        deductedQuantity: data.deductedQuantity,
        type: itemType
      });
    } catch (error) {
      console.error("Error fetching issuable item:", error);
      setNotification({
        open: true,
        message: "Failed to fetch issuable item details. Please try again.",
        severity: "error",
      });
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      if (availableQuantity !== null && values.deductedQuantity > availableQuantity) {
        setNotification({
          open: true,
          message: `Cannot deduct ${values.deductedQuantity} units. Only ${availableQuantity} units available.`,
          severity: "error",
        });
        return;
      }

      await updateIssuableItem(tenantId, issuableItemId, {
        itemId: values.itemCode,
        shelfId: values.shelfId,
        issuableItemId: values.issuableItemId,
        storeId: values.storeId,
        cellId: values.cellId,
        receivableItemId: values.receivableItemId,
        deductedQuantity: values.deductedQuantity,
        type: values.type
      });
      
      setNotification({
        open: true,
        message: "Issuable item updated successfully!",
        severity: "success",
      });
      resetForm();
      // navigate(-1);
       navigate('/store/create-issuable-item');
    } catch (error) {
      console.error("Failed to update issuable item:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to update issuable item. Please try again.",
        severity: "error",
      });
    }
  };

  const checkoutSchema = yup.object().shape({
    itemCode: yup.string().required("Item is required"),
    shelfId: yup.string().required("Shelf is required"),
    issuableItemId: yup.string().required("Issuable item is required"),
    storeId: yup.string().required("Store is required"),
    cellId: yup.string().required("Cell is required"),
    receivableItemId: yup.string().required("Receivable item is required"),
    deductedQuantity: yup.number()
      .min(1, "Deducted quantity must be at least 1")
      .required("Deducted quantity is required"),
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const handleIssuableTypeChange = (event, setFieldValue) => {
    const newType = event.target.value;
    setFieldValue("type", newType);
    setFieldValue("issuableItemId", "");
    fetchIssuableItems(newType);
  };

  const handleReceivableItemChange = async (event, newValue, setFieldValue) => {
    if (newValue && values.itemCode && newValue.itemId !== values.itemCode) {
      setNotification({
        open: true,
        message: "Selected receivable item doesn't match the selected product",
        severity: "error",
      });
      return;
    }
    
    setFieldValue("receivableItemId", newValue?.id || "");
    if (newValue?.id) {
      await fetchReceivableItemQuantity(newValue.id);
    } else {
      setAvailableQuantity(null);
    }
  };
    const handleNavigate = () => {
        navigate('/store/create-issuable-item');
    }
    

  if (!issuableItemId) {
    return (
      <NoPageHandle
        message="No issuable item selected for update."
        navigateTo={handleNavigate}
      />
    );
  }

  return (
    <Box m="20px">
      <Header subtitle="Update Issuable Item" />
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
              {/* Issuable Type Radio Buttons */}
              <Box sx={{ gridColumn: "span 4" }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Issuable Type</FormLabel>
                  <RadioGroup
                    row
                    aria-label="issuableType"
                    name="type"
                    value={values.type}
                    onChange={(e) => handleIssuableTypeChange(e, setFieldValue)}
                  >
                    <FormControlLabel
                      value="ISIV"
                      control={<Radio />}
                      label="ISIV"
                    />
                    <FormControlLabel
                      value="SIV"
                      control={<Radio />}
                      label="SIV"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              {/* Available Quantity Display */}
              {availableQuantity !== null && (
                <Box sx={{ gridColumn: "span 4" }}>
                  <Alert severity="info">
                    Available Quantity: {availableQuantity} units
                  </Alert>
                </Box>
              )}

              {/* Item Code Autocomplete */}
              <Autocomplete
                sx={{ gridColumn: "span 2" }}
                options={items}
                loading={loadingItems}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                value={items.find(item => item.id === values.itemCode) || null}
                onChange={(event, newValue) => {
                  setFieldValue("itemCode", newValue?.id || "");
                  setFieldValue("receivableItemId", "");
                  setAvailableQuantity(null);
                  if (newValue?.id) {
                    fetchReceivableItems(newValue.id);
                  } else {
                    setReceivableItems([]);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Item"
                    error={!!touched.itemCode && !!errors.itemCode}
                    helperText={touched.itemCode && errors.itemCode}
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
                onChange={(event, newValue) => handleReceivableItemChange(event, newValue, setFieldValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Receivable Item"
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

              {/* Issuable Item Autocomplete */}
              <Autocomplete
                sx={{ gridColumn: "span 2" }}
                options={issuableItems}
                loading={loadingIssuableItems}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                value={issuableItems.find(item => item.id === values.issuableItemId) || null}
                onChange={(event, newValue) => {
                  setFieldValue("issuableItemId", newValue?.id || "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={values.type === "ISIV" ? "ISIV Number" : "SIV Number"}
                    error={!!touched.issuableItemId && !!errors.issuableItemId}
                    helperText={touched.issuableItemId && errors.issuableItemId}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingIssuableItems ? <CircularProgress color="inherit" size={20} /> : null}
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

              {/* Deducted Quantity Field */}
              <TextField
                fullWidth
                type="number"
                label="Deducted Quantity"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.deductedQuantity}
                name="deductedQuantity"
                error={
                  !!touched.deductedQuantity && 
                  (!!errors.deductedQuantity || 
                  (availableQuantity !== null && values.deductedQuantity > availableQuantity))
                }
                helperText={
                  touched.deductedQuantity && (
                    errors.deductedQuantity || 
                    (availableQuantity !== null && values.deductedQuantity > availableQuantity 
                      ? `Cannot exceed available quantity (${availableQuantity})` 
                      : null)
                  )
                }
                sx={{ gridColumn: "span 2" }}
                inputProps={{ 
                  min: 1,
                  max: availableQuantity || undefined
                }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button 
                type="submit" 
                color="secondary" 
                variant="contained"
                disabled={
                  availableQuantity !== null && 
                  values.deductedQuantity > availableQuantity
                }
              >
                Update Issuable Item
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

export default UpdateIssuableItem;