import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik, Form } from "formik";
import Header from "../../common/Header";
import { createCell } from "../../Api/storeApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import { useLocation } from "react-router-dom";
import ListCell from "./ListCell"; 
import NotPageHandle from "../../common/NoPageHandle";

const CreateCell = () => {
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    if (!state?.shelfId || !state?.storeId || !state?.storeType) {
      setNotification({
        open: true,
        message: "Missing required shelf, store, or store type information.",
        severity: "error",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      const payload = {
        cellCode: values.cellCode,
        shelfRow: values.shelfRow,
        storeType: state.storeType, // Using storeType from state
        shelfId: state.shelfId,
        storeId: state.storeId,
      };

      await createCell(tenantId, payload);

      setNotification({
        open: true,
        message: "Cell created successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to create cell. Please try again.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const initialValues = {
    cellCode: "",
    shelfRow: "",
    storeType: state?.storeType || "", // Will be empty if not provided
    shelfCode: state?.shelfCode || "",
    storeName: state?.storeName || "",
  };

  const checkoutSchema = yup.object().shape({
    cellCode: yup.string().required("Cell code is required"),
    shelfRow: yup.string().required("Shelf row is required"),
  });
  

  if (!state?.shelfId || !state?.storeId || !state?.storeType) {
    return (
      <NotPageHandle
        message="Incomplete information to create cell. Please select a shelf first."
        navigateTo="/create-shelf"
      />
    );
  }

  return (
    <Box m="20px">
      <Header subtitle="Create Cell" />

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
              gap="20px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {/* Cell Code input */}
              <TextField
                fullWidth
                type="text"
                label="Cell Code"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cellCode}
                name="cellCode"
                error={!!touched.cellCode && !!errors.cellCode}
                helperText={touched.cellCode && errors.cellCode}
                sx={{ gridColumn: "span 2" }}
              />
              
              {/* Shelf Row input */}
              <TextField
                fullWidth
                type="text"
                label="Shelf Row"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.shelfRow}
                name="shelfRow"
                error={!!touched.shelfRow && !!errors.shelfRow}
                helperText={touched.shelfRow && errors.shelfRow}
                sx={{ gridColumn: "span 2" }}
              />

              {/* Shelf Code (read-only) */}
              <TextField
                fullWidth
                label="Shelf Code"
                value={values.shelfCode}
                InputProps={{ readOnly: true }}
                sx={{ gridColumn: "span 2" }}
              />

              {/* Store Name (read-only) */}
              <TextField
                fullWidth
                label="Store Name"
                value={values.storeName}
                InputProps={{ readOnly: true }}
                sx={{ gridColumn: "span 2" }}
              />

              {/* Store Type (read-only) */}
              <TextField
                fullWidth
                label="Store Type"
                value={state.storeType} // Directly using state.storeType
                InputProps={{ readOnly: true }}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>

            {/* Hidden inputs for IDs and storeType */}
            <input type="hidden" name="shelfId" value={state.shelfId} />
            <input type="hidden" name="storeId" value={state.storeId} />
            <input type="hidden" name="storeType" value={state.storeType} />

            {/* Submit Button */}
            <Box display="flex" justifyContent="start" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Create Cell"
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

      <ListCell refreshKey={refreshKey} />
    </Box>
  );
};

export default CreateCell;