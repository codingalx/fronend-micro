import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik, Form } from "formik";
import Header from "../../common/Header";
import { updateShelf, getShelfById, getAllStores, getStoreCategoryById } from "../../Api/storeApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import { useLocation, useNavigate } from "react-router-dom";
import NoPageHandle from "../../common/NoPageHandle";

const UpdateShelf = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;
  const location = useLocation();
  const navigate = useNavigate();
  const { shelfId, storeId } = location.state || {}; // Get both shelfId and storeId from state

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [stores, setStores] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({
    shelfCode: "",
    storeName: "",
    storeType: "INTERNAL",
    storeCategoryId: "",
    storeId: "",
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await fetchAllStores();
      await fetchShelfDetails();
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setNotification({
        open: true,
        message: "Failed to load shelf data",
        severity: "error",
      });
      setLoading(false);
    }
  };

  const fetchAllStores = async () => {
    try {
      const response = await getAllStores(tenantId);
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching stores:", error.message);
      throw error;
    }
  };

  const fetchShelfDetails = async () => {
    try {
      // Use both storeId from state and shelfId to fetch shelf details
      const shelfResponse = await getShelfById(tenantId, storeId, shelfId);
      const shelfData = shelfResponse.data;
      
      // Set initial values
      setInitialValues({
        shelfCode: shelfData.shelfCode,
        storeName: shelfData.storeName,
        storeType: shelfData.storeType,
        storeCategoryId: shelfData.storeCategoryId,
        storeId: shelfData.store,
      });

      // Fetch category name if available
      if (shelfData.storeCategoryId) {
        await fetchCategoryName(shelfData.storeCategoryId);
      }
    } catch (error) {
      console.error("Error fetching shelf details:", error.message);
      throw error;
    }
  };

  const fetchCategoryName = async (categoryId) => {
    if (!categoryId) {
      setCategoryName("");
      return;
    }
    
    setLoadingCategory(true);
    try {
      const response = await getStoreCategoryById(tenantId, categoryId);
      setCategoryName(response.data.name);
    } catch (error) {
      console.error("Error fetching category:", error.message);
      setCategoryName("Unknown Category");
    } finally {
      setLoadingCategory(false);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      await updateShelf(tenantId, shelfId, values);
      setNotification({
        open: true,
        message: "Shelf updated successfully!",
        severity: "success",
      });
      setTimeout(() => navigate(-1), 1500);
       navigate('/store/store_setup', { state: { id, activeTab: 2 } });
    } catch (error) {
      console.error("Failed to update shelf:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to update shelf. Please try again.",
        severity: "error",
      });
    }
  };

  const handleStoreChange = (event, setFieldValue, stores) => {
    const selectedStoreId = event.target.value;
    setFieldValue("storeId", selectedStoreId);
    
    const selectedStore = stores.find(store => store.id === selectedStoreId);
    if (selectedStore) {
      setFieldValue("storeCategoryId", selectedStore.category);
      fetchCategoryName(selectedStore.category);
    } else {
      setFieldValue("storeCategoryId", "");
      setCategoryName("");
    }
  };

  const checkoutSchema = yup.object().shape({
    shelfCode: yup.string().required("Shelf code is required"),
    storeName: yup.string().required("Store name is required"),
    storeType: yup.string().required("Store type is required"),
    storeCategoryId: yup.string().required("Store category is required"),
    storeId: yup.string().required("Store is required"),
  });

  if (loading) {
    return (
      <Box m="20px" display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }
   const handleNavigate = () => {
        navigate('/store/store_setup', { state: { id, activeTab: 2 } });
    }

if (!shelfId || !storeId) {
     return (
       <NoPageHandle
         message="No store selected for update."
         navigateTo={handleNavigate}
       />
     );
   }
  return (
    <Box m="20px">
      <Header subtitle="Update Shelf" />
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
              <TextField
                fullWidth
                type="text"
                label="Shelf Code"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.shelfCode}
                name="shelfCode"
                error={!!touched.shelfCode && !!errors.shelfCode}
                helperText={touched.shelfCode && errors.shelfCode}
                sx={{ gridColumn: "span 2" }}
              />

              <FormControl 
                fullWidth 
                error={!!touched.storeId && !!errors.storeId}
                sx={{ gridColumn: "span 2" }}
              >
                <InputLabel id="store-select-label">Store</InputLabel>
                <Select
                  labelId="store-select-label"
                  id="storeId"
                  name="storeId"
                  value={values.storeId}
                  label="Store"
                  onChange={(e) => handleStoreChange(e, setFieldValue, stores)}
                  onBlur={handleBlur}
                >
                  {stores.map((store) => (
                    <MenuItem key={store.id} value={store.id}>
                      {store.storeName} ({store.srNo})
                    </MenuItem>
                  ))}
                </Select>
                {touched.storeId && errors.storeId && (
                  <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 1.5 }}>
                    {errors.storeId}
                  </Box>
                )}
              </FormControl>

              <TextField
                fullWidth
                type="text"
                label="Store Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.storeName}
                name="storeName"
                error={!!touched.storeName && !!errors.storeName}
                helperText={touched.storeName && errors.storeName}
                sx={{ gridColumn: "span 2" }}
              />

              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <TextField
                  label="Store Category"
                  value={loadingCategory ? "Loading..." : categoryName}
                  InputProps={{
                    readOnly: true,
                    endAdornment: loadingCategory && (
                      <CircularProgress size={20} />
                    ),
                  }}
                  helperText="Automatically populated when store is selected"
                />
              </FormControl>

              <input type="hidden" name="storeCategoryId" value={values.storeCategoryId} />

              <FormControl 
                fullWidth 
                error={!!touched.storeType && !!errors.storeType}
                sx={{ gridColumn: "span 2" }}
              >
                <InputLabel id="store-type-label">Store Type</InputLabel>
                <Select
                  labelId="store-type-label"
                  id="storeType"
                  name="storeType"
                  value={values.storeType}
                  label="Store Type"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <MenuItem value="INTERNAL">Internal</MenuItem>
                   <MenuItem value="MERCHANDISE">Merchandise</MenuItem>
                </Select>
                {touched.storeType && errors.storeType && (
                  <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 1.5 }}>
                    {errors.storeType}
                  </Box>
                )}
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="start" mt="20px" gap={2}>
              <Button 
                type="submit" 
                color="secondary" 
                variant="contained"
              >
                Update Shelf
              </Button>
              <Button 
                variant="outlined" 
                color="error"
                onClick={() => navigate('/shelves')}
              >
                Cancel
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

export default UpdateShelf;