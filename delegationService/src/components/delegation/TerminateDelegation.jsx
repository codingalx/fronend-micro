import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import Header from "../common/Header";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import { terminateDelegation } from "../../../configuration/DelegationApi";
import { useLocation, useNavigate } from "react-router-dom";

const TerminateDelegation = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {};
  
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      // Check the values before sending them
      console.log("Submitting termination data:", values);
      
      await terminateDelegation(tenantId, id, values);
      setNotification({
        open: true,
        message: "Delegation terminated successfully!",
        severity: "success",
      });
      navigate('/delegation/create');
      resetForm();
    } catch (error) {
      console.error("Failed to submit form data:", error);
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
        setNotification({
          open: true,
          message: "Failed to terminate delegation. Please try again.",
          severity: "error",
        });
      } else {
        setNotification({
          open: true,
          message: "An unexpected error occurred.",
          severity: "error",
        });
      }
    }
  };

  const initialValues = {
    terminationDate: "",
    terminationReason: "",
  };

  const checkoutSchema = yup.object().shape({
    terminationDate: yup.date().required("Termination Date is required").min(new Date(), "Termination date must be in the present or future"),
    terminationReason: yup.string().required("Termination Reason is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Terminate Delegation" />
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
          <form onSubmit={handleSubmit}>
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
                type="date"
                label="Termination Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.terminationDate}
                name="terminationDate"
                error={!!touched.terminationDate && !!errors.terminationDate}
                helperText={touched.terminationDate && errors.terminationDate}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="text"
                label="Termination Reason"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.terminationReason}
                name="terminationReason"
                error={!!touched.terminationReason && !!errors.terminationReason}
                helperText={touched.terminationReason && errors.terminationReason}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Terminate Delegation
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TerminateDelegation;