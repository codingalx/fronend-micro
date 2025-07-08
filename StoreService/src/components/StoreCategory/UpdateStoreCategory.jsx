import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik, Form } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { updateStoreCategory, getStoreCategoryById, getAllStoreCategories } from "../../Api/storeApi";
import NoPageHandle from "../../common/NoPageHandle";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import Header from "../../common/Header";

const UpdateStoreCategory = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
      const [loading, setLoading] = useState(true);
  
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { categoryId } = location.state || {};

  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
      fetchCategory();
      fetchStoreCategories();

  }, []);

  const fetchCategory = async () => {
    try {
      const response = await getStoreCategoryById(tenantId, categoryId);
      setCategoryData(response.data);
    } catch (error) {
      console.error("Error fetching store category:", error.message);
      setNotification({
        open: true,
        message: "Failed to fetch store category data. Please try again.",
        severity: "error",
      });
    }
  };

  
      const [categories, setCategories] = useState([]);
    
      const fetchStoreCategories = async () => {
        try {
          setLoading(true);
          const response = await getAllStoreCategories(tenantId);
          setCategories(response.data);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          console.error('Error fetching store categories:', error);
          setLoading(false);
        }
      };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {

         const categoryNameExist = categories.some(
        (categorie) => categorie.name === values.name && categorie.id !== categoryId
    );

    if (categoryNameExist) {
      setNotification({
          open: true,
          message: " Category name already exists to update please use another name. Please use a different one.",
          severity: "warning",
      });
      return;
  }

      await updateStoreCategory(tenantId, categoryId, values);
      setNotification({
        open: true,
        message: "Store category updated successfully!",
        severity: "success",
      });
      resetForm();
          navigate('/store/store_setup', { state: { activeTab: 0} }); 

      // navigate(-1);
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to update store category. Please try again.",
        severity: "error",
      });
    }
  };
      const handleNavigate = () => {
        navigate('/store/store_setup', { state: { id, activeTab: 0 } });
    }

  const checkoutSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string(),
  });

  if (!categoryId) {
    return (
      <NoPageHandle
        message="No store category selected for update."
         onNavigate={handleNavigate}
      />
    );
  }

  return (
    <Box m="20px">
      <Header subtitle="Update Store Category" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={categoryData}
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
              <TextField
                fullWidth
                type="text"
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 2" }}
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
              <Button type="submit" color="secondary" variant="contained">
                Update Store Category
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
        <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateStoreCategory;