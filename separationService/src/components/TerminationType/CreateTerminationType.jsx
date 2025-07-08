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
import Header from "../../common/Header";
import { addTerminationType, getAllTerminationTypes } from "../../Api/separationApi";
import ListTerminationType from "./ListTerminationType"; 
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';

const CreateTerminationType = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [refreshKey, setRefreshKey] = useState(0); 
  const [terminationTypes, setTerminationTypes] = useState([]);

  useEffect(() => {
    fetchAllTerminationTypes();
  }, []);

  const fetchAllTerminationTypes = async () => {
    try {
      const response = await getAllTerminationTypes(tenantId);
      setTerminationTypes(response.data);
    } catch (error) {
      console.error("Error fetching termination types:", error.message);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const terminationTypeExists = terminationTypes.some(
        (type) => type.name === values.name
      );

      if (terminationTypeExists) {
        setNotification({
          open: true,
          message: "Termination type with this name already exists.",
          severity: "warning",
        });
        return;
      }

      await addTerminationType(tenantId, values);
      setNotification({
        open: true,
        message: "Termination type created successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to create termination type. Please try again.",
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
      <Header subtitle="Create Termination Type" />
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
                Create Termination Type
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

      
      <ListTerminationType refreshKey={refreshKey} />
    </Box>
  );
};

export default CreateTerminationType;