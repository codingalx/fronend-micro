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
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import { createUniform, getAllUniform } from "../../../configuration/BenefitApi";



const CreateUniform = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom); 
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
  const [uniform, setUniform] = useState([])

  useEffect(() => {
    fetchAllUniform();
}, []);

  const fetchAllUniform = async () => {
    try {
        const response = await getAllUniform(tenantId);
        const data = response.data;
        setUniform(data);
    } catch (error) {
        console.error("Error fetching  uniform:", error.message);
    }
};

  const handleFormSubmit = async (values, { resetForm }) => {
    try {

      const uniformExist = uniform.some(
        (uniform) => uniform.uniform === values.uniform
    );

    if (uniformExist) {
      setNotification({
          open: true,
          message: "uniform already exists. Please use a different one.",
          severity: "warning",
      });
      return;
  }

      await createUniform(tenantId,values);
      setNotification({
        open: true,
        message: "uniform  created successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey(prev => prev + 1); 
      
    } 
    catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to uniform . Please try again.",
        severity: "error",
      });
    }
  };

  const initialValues = {
    jobTitle: "",
    sex: "",
    JobGrade:"",
    category:"",
    subCategory:"",
    uniformItem:"",
    descriptionOfItem:"",
    quantity:0,
    remark:""
  };

  const checkoutSchema = yup.object().shape({
    name: yup.string().required("name is required"),
    description: yup.string().required("description is required"),
  });

  


  return (
    <Box m="20px">
      <Header subtitle= "Create  Uniform" />
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
                label="Document Type Name"
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
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
          
    </Box>
  );
};

export default CreateUniform;