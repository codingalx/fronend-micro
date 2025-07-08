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
import { createCountry, listAllCountry } from "../../Api/employeeApi";
import ListCountry from "./ListCountry";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 



const CreateCountry = () => {
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
  const [countryName, setCountryName] = useState([])

  useEffect(() => {
    fetchAllcountry();
}, []);

  const fetchAllcountry = async () => {
    try {
        const response = await listAllCountry(tenantId);
        const data = response.data;
        setCountryName(data);
    } catch (error) {
        console.error("Error fetching country:", error.message);
        
    }
};


  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const countryNameExists = countryName.some(
        (country) => country.name === values.name
    );

    if (countryNameExists) {
      setNotification({
          open: true,
          message: " Country Name already exists. Please use a different one.",
          severity: "warning",
      });
      return;
  }

      await createCountry(tenantId,values);
      setNotification({
        open: true,
        message: "Country  created successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey(prev => prev + 1); 
      
    } 
    catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to create Country. Please try again.",
        severity: "error",
      });
    }
  };

  const initialValues = {
    name: "",
    abbreviatedName: "",
    code: ""
  };

  const checkoutSchema = yup.object().shape({
    name: yup.string().required("name is required"),
    abbreviatedName: yup.string().required("abbreviatedName is required"),
    code: yup.string().required("code is required"),
  });

  

 

  return (
    <Box m="20px">
      <Header subtitle= "Create Country" />
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
                type="text"
                label="Country Name"
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
                type="text"
                label="abbreviated Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.abbreviatedName}
                name="abbreviatedName"
                error={!!touched.abbreviatedName && !!errors.abbreviatedName}
                helperText={touched.abbreviatedName && errors.abbreviatedName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="code"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.code}
                name="code"
                error={!!touched.code && !!errors.code}
                helperText={touched.code && errors.code}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Country
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
      <ListCountry  refreshKey={refreshKey}/>
          
    </Box>
  );
};

export default CreateCountry;