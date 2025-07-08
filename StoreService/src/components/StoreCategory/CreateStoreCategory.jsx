import React, { useEffect, useState } from "react";
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
import Header from "../../common/Header";
import { createStoreCategory, getAllStoreCategories } from "../../Api/storeApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import ListStoreCategory from "./ListStoreCategory";

const CreateStoreCategory = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;
    const [loading, setLoading] = useState(true);
  

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [refreshKey, setRefreshKey] = useState(0); 

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };
   useEffect(() => {
      fetchStoreCategories();
    }, [refreshKey]);

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
        (categorie) => categorie.name === values.name
    );

    if (categoryNameExist) {
      setNotification({
          open: true,
          message: " Category name already exists. Please use a different one.",
          severity: "warning",
      });
      return;
  }


      await createStoreCategory(tenantId, values);
      setNotification({
        open: true,
        message: "Store category created successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to create store category. Please try again.",
        severity: "error",
      });
    }
  };

  const initialValues = {
    name: "",
    description: "",
  };

  const checkoutSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string(),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create Store Category" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
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
                Create Store Category
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

      <ListStoreCategory refreshKey={refreshKey} />
    </Box>
  );
};

export default CreateStoreCategory;