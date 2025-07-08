import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert
} from "@mui/material";
import * as yup from "yup";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";

import { createExcuseType } from "../../Api/Attendance-Api";
import ListExcuse from "./ListExcuse";
import Header from "../Header";


const CreateExcuse = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [refreshKey, setRefreshKey] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required("Excuse Name  is required"),
    description: yup.string(),
  });

  const initialValues = {
    name: "",
    description: "",
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      await createExcuseType(values);
      setNotification({
        open: true,
        message: "Excuse created successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error creating excuse:", error);
      setNotification({
        open: true,
        message: "Error creating excuse!",
        severity: "error",
      });
    }
  };

  return (
    <Box m="20px">
      <Header subtitle="Create Excuse Types" />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
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
                label="Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                multiline
                rows={4}
                sx={{
                  gridColumn: "span 2",
                  "& .MuiInputBase-root": {
                    height: "auto",
                  },
                }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Excuse
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
<ListExcuse refreshKey={refreshKey} />
    </Box>
  );
};

export default CreateExcuse;
