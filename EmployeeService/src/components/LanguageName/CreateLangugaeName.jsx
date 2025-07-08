import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Snackbar, Alert } from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import Header from "../common/Header";
import ListLanguageName from "./ListLanguageName";
import { createLanguageName, listLanguageName } from "../../Api/employeeApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
  


const CreateLangugaeName = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

   const [languageName, setLanguageName] = useState()

    useEffect(() => {
      fetchAllLangugaeName();
  }, []);
  
    const fetchAllLangugaeName = async () => {
      try {
          const response = await listLanguageName(tenantId);
          const data = response.data;
          setLanguageName(data);
      } catch (error) {
          console.error("Error fetching langugae name:", error.message);
      }
  };
  

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [refreshKey, setRefreshKey] = useState(0);

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const langugaeNameExists = languageName.some(
        (languageName) => languageName.languageName === values.languageName
    );

    if (langugaeNameExists) {
      setNotification({
          open: true,
          message: " Langugae Name already exists. Please use a different one.",
          severity: "warning",
      });
      return;
  }

      await createLanguageName(tenantId,values);
      setNotification({
        open: true,
        message: "language Name  created successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to create language name . Please try again.",
        severity: "error",
      });
    }
  };

  const initialValues = {
    languageName: "",
    description: "",
  };

  const checkoutSchema = yup.object().shape({
    languageName: yup.string().required("language Name is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create Language Name" />
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
                variant="outlined"
                type="text"
                label="languageName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.languageName}
                name="languageName"
                error={!!touched.languageName && !!errors.languageName}
                helperText={touched.languageName && errors.languageName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="description"
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
                Create
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
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
      <ListLanguageName refreshKey={refreshKey}/>
      
    </Box>
  );
};

export default CreateLangugaeName;
