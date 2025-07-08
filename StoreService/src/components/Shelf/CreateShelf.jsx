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
import { createShelf, getAllShelves } from "../../Api/storeApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import { useLocation } from "react-router-dom";
import ListShelf from "./ListShelf"; // Import ListShelf component
import NotPageHandle from "../../common/NoPageHandle";

const CreateShelf = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;
  const location = useLocation();
  const { state } = location;

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [refreshKey, setRefreshKey] = useState(0);

 
 if (!state?.storeId) {
      return (
        <NotPageHandle
          message="No Store selected to create cell."
          navigateTo="/store/create-store"
        />
      );
    }

  const checkShelfCodeExists = async (shelfCode) => {
    try {
      const response = await getAllShelves(tenantId, state?.storeId);
      return response.data.some(shelf => shelf.shelfCode === shelfCode);
    } catch (error) {
      console.error("Error checking shelf code:", error);
      return false;
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    if (!state?.storeId) {
      setNotification({
        open: true,
        message: "No store selected. Please select a store first.",
        severity: "error",
      });
      return;
    }

    setIsCheckingCode(true);
    try {
      const codeExists = await checkShelfCodeExists(values.shelfCode);
      if (codeExists) {
        setNotification({
          open: true,
          message: "Shelf code already exists. Please use a different code.",
          severity: "error",
        });
        return;
      }

      setIsSubmitting(true);
      await createShelf(tenantId, values);
      setNotification({
        open: true,
        message: "Shelf created successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey((prev) => prev + 1); // This will refresh ListShelf
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to create shelf. Please try again.",
        severity: "error",
      });
    } finally {
      setIsCheckingCode(false);
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const initialValues = {
    shelfCode: "",
    storeName: state?.storeName || "",
    storeType: "INTERNAL",
    storeCategoryId: state?.categoryId || "",
    storeId: state?.storeId || "",
  };

  const checkoutSchema = yup.object().shape({
    shelfCode: yup.string().required("Shelf code is required"),
    storeName: yup.string().required("Store name is required"),
    storeType: yup.string().required("Store type is required"),
    storeCategoryId: yup.string().required("Store category is required"),
    storeId: yup.string().required("Store is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create Shelf" />
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
          isSubmitting: formikIsSubmitting,
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

              {/* Store Name (read-only) */}
              <TextField
                fullWidth
                type="text"
                label="Store Name"
                value={values.storeName}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ gridColumn: "span 2" }}
              />

              {/* Store Category (read-only) */}
              <TextField
                fullWidth
                type="text"
                label="Store Category"
                value={state?.categoryName || ""}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ gridColumn: "span 2" }}
              />

              {/* Hidden fields for required values */}
              <input type="hidden" name="storeId" value={values.storeId} />
              <input type="hidden" name="storeCategoryId" value={values.storeCategoryId} />

              {/* Store Type Dropdown */}
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
            <Box display="flex" justifyContent="start" mt="20px">
              <Button 
                type="submit" 
                color="secondary" 
                variant="contained"
                disabled={isCheckingCode || isSubmitting}
              >
                {isCheckingCode || isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Create Shelf"
                )}
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

      {/* Add ListShelf component here */}
      <ListShelf refreshKey={refreshKey} />
    </Box>
  );
};

export default CreateShelf;