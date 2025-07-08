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
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik, Form } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { updateStore, getStoreById, getAllStoreCategories } from "../../Api/storeApi";
import NoPageHandle from "../../common/NoPageHandle";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import Header from "../../common/Header";

const UpdateStore = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { storeId } = location.state || {};

  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const [storeCategories, setStoreCategories] = useState([]);
  const [initialValues, setInitialValues] = useState({
    categoryId: "",
    subCategory: "",
    srNo: "",
    storeName: "",
    address: "",
    description: "",
    poBox: "",
  });

  useEffect(() => {
    fetchAllStoreCategories();
  }, []);

  useEffect(() => {
   fetchStore();
   }, []);

  const fetchAllStoreCategories = async () => {
    try {
      const response = await getAllStoreCategories(tenantId);
      setStoreCategories(response.data);
    } catch (error) {
      console.error("Error fetching store categories:", error.message);
      setNotification({
        open: true,
        message: "Failed to fetch store categories. Please try again.",
        severity: "error",
      });
    }
  };

  const fetchStore = async () => {
    try {
      const response = await getStoreById(tenantId, storeId);
      setInitialValues({
        categoryId: response.data.category,
        subCategory: response.data.subCategory,
        srNo: response.data.srNo,
        storeName: response.data.storeName,
        address: response.data.address,
        description: response.data.description,
        poBox: response.data.poBox,
      });
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      await updateStore(tenantId, storeId, values);
      setNotification({
        open: true,
        message: "Store updated successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey((prev) => prev + 1);
      navigate('/store/store_setup', { state: {  activeTab: 1 } });
      // navigate(-1);
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to update store. Please try again.",
        severity: "error",
      });
    }
  };

  const checkoutSchema = yup.object().shape({
    categoryId: yup.string().required("Category is required"),
    subCategory: yup.string().required("Sub-category is required"),
    srNo: yup.string().required("Serial number is required"),
    storeName: yup.string().required("Store name is required"),
    address: yup.string().required("Address is required"),
    description: yup.string(),
    poBox: yup.string(),
  });

      const handleNavigate = () => {
        navigate('/store/store_setup', { state: {  activeTab: 1 } });
    }



  if (!storeId) {
    return (
      <NoPageHandle
        message="No store selected for update."
         onNavigate={handleNavigate}
      />
    );
  }

  return (
    <Box m="20px">
      <Header subtitle="Update Store" />
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
              {/* Category Dropdown */}
              <FormControl 
                fullWidth 
                error={!!touched.categoryId && !!errors.categoryId}
                sx={{ gridColumn: "span 2" }}
              >
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="categoryId"
                  name="categoryId"
                  value={values.categoryId}
                  label="Category"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {storeCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {touched.categoryId && errors.categoryId && (
                  <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 1.5 }}>
                    {errors.categoryId}
                  </Box>
                )}
              </FormControl>

              {/* Rest of your form fields remain the same */}
              <TextField
                fullWidth
                type="text"
                label="Sub-Category"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.subCategory}
                name="subCategory"
                error={!!touched.subCategory && !!errors.subCategory}
                helperText={touched.subCategory && errors.subCategory}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="text"
                label="Serial Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.srNo}
                name="srNo"
                error={!!touched.srNo && !!errors.srNo}
                helperText={touched.srNo && errors.srNo}
                sx={{ gridColumn: "span 2" }}
              />

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

              <TextField
                fullWidth
                type="text"
                label="PO Box"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.poBox}
                name="poBox"
                error={!!touched.poBox && !!errors.poBox}
                helperText={touched.poBox && errors.poBox}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="text"
                label="Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
                name="address"
                error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 2" }}
                multiline
                rows={2}
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button 
                type="submit" 
                color="secondary" 
                variant="contained"
              >
                Update Store
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

export default UpdateStore;