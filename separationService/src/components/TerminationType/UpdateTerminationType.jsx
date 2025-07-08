import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Snackbar, Alert } from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import { updateTerminationType, getTerminationType } from "../../Api/separationApi";
import { useLocation, useNavigate } from "react-router-dom";
import NotPageHandle from "../../common/NoPageHandle";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import Header from "../../common/Header";

const UpdateTerminationType = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const location = useLocation();
  const navigate = useNavigate();
  const terminationTypeId = location.state?.terminationTypeId;

  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [terminationTypeData, setTerminationTypeData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchTerminationType();
  }, []);

  const fetchTerminationType = async () => {
    if (!terminationTypeId) return;
    try {
      const response = await getTerminationType(tenantId, terminationTypeId);
      setTerminationTypeData(response.data);
    } catch (error) {
      console.error("Error fetching termination type:", error);
      setNotification({
        open: true,
        message: "Failed to fetch termination type.",
        severity: "error",
      });
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      await updateTerminationType(tenantId, terminationTypeId, values);
      setNotification({
        open: true,
        message: "Termination type updated successfully!",
        severity: "success",
      });
      setTimeout(() => navigate(-1), 2000);
    } catch (error) {
      console.error("Failed to update termination type:", error);
      setNotification({
        open: true,
        message: "Failed to update termination type. Please try again.",
        severity: "error",
      });
    }
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string(),
  });

  if (!terminationTypeId) {
    return (
      <NotPageHandle 
        message="No Termination Type selected to update" 
        navigateTo="/create-termination-type" 
      />
    );
  }

  return (
    <Box m="20px">
      <Header subtitle="Update Termination Type" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={terminationTypeData}
        validationSchema={validationSchema}
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
                Update Termination Type
              </Button>
            </Box>
          </form>
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

export default UpdateTerminationType;