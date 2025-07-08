import React, { useState,useEffect } from "react";
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
import { createTitleName, listTitleName } from "../../Api/employeeApi";
import ListTitleName from "./ListTitleName";

import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; // Adjust the import based on your structure




const CreateTitleName = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom); // Access the shared authentication state
  const tenantId = authState.tenantId
  

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });



  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [refreshKey, setRefreshKey] = useState(0);

  const [titleName, setTitleName] = useState()
  
      useEffect(() => {
        fetchAllTitleName();
    }, []);
    
      const fetchAllTitleName = async () => {
        try {
            const response = await listTitleName(tenantId);
            const data = response.data;
            setTitleName(data);
        } catch (error) {
            console.error("Error fetching title Name:", error.message);
        }
    };
    

  const handleFormSubmit = async (values, { resetForm }) => {
    try {

      const titleNameExists = titleName.some(
        (titleName) => titleName.titleName === values.titleName
    );

    if (titleNameExists) {
      setNotification({
          open: true,
          message: " title Name already exists. Please use a different one.",
          severity: "warning",
      });
      return;
  }

      await createTitleName(tenantId,values);
      setNotification({
        open: true,
        message: "Title name created successfully!",
        severity: "success",
      });

      resetForm(); 
      setRefreshKey((prev) => prev + 1); 
    } catch (error) {
      console.error("Failed to submit form data:", error);

      setNotification({
        open: true,
        message: "Failed to create title name. Please try again.",
        severity: "error",
      });
    }
  };

  const initialValues = {
    titleName: "",
    description: "",
  };

  const checkoutSchema = yup.object().shape({
    titleName: yup.string().required("Title name cannot be blank"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create Title Name" />
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
                label="Title Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.titleName}
                name="titleName"
                error={!!touched.titleName && !!errors.titleName}
                helperText={touched.titleName && errors.titleName}
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
            <Box display="flex" justifyContent="center" mt="20px">
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
      <ListTitleName  refreshKey={refreshKey}/>

    </Box>
  );
};

export default CreateTitleName;
