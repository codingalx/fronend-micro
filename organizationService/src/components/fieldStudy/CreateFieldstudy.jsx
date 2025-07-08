
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
import ListFieldStudy from './ListFieldStudy'
import { createFieldOfstudy, listFieldOfstudy } from "../../../configuration/organizationApi";


const CreateFieldstudy = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom) 
  const tenantId = authState.tenantId
  const [refreshKey, setRefreshKey] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  
 
  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };


  const [fieldstudy, setFieldStudy] = useState()

  useEffect(() => {
    fetchFieldStudy();
}, []);

  const fetchFieldStudy = async () => {
    try {
        const response = await listFieldOfstudy(tenantId);
        const data = response.data;
        setFieldStudy(data);
    } catch (error) {
        console.error("Error fetching field of study:", error.message);
    }
};

  const handleFormSubmit = async (values, { resetForm }) => {
    try {

      const fieldStudyExists = fieldstudy.some(
        (fieldstudy) => fieldstudy.fieldOfStudy === values.fieldOfStudy
    );

    if (fieldStudyExists) {
      setNotification({
          open: true,
          message: " field of study already exists. Please use a different one.",
          severity: "warning",
      });
      return;
  }

      await createFieldOfstudy(tenantId,values);
      setNotification({
        open: true,
        message: "field of study  created successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey(prev => prev + 1); 
      
    } 
    catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to create field of study . Please try again.",
        severity: "error",
      });
    }
  };

  const initialValues = {
    fieldOfStudy: "",
    description: "",
  };


  const checkoutSchema = yup.object().shape({
    fieldOfStudy: yup.string().required("name is required"),
  });


  return (
    <Box m="20px">
      <Header subtitle= "Create Field of study" />
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
                label="Field of study"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fieldOfStudy}
                name="fieldOfStudy"
                error={!!touched.fieldOfStudy && !!errors.fieldOfStudy}
                helperText={touched.fieldOfStudy && errors.fieldOfStudy}
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
      <ListFieldStudy  refreshKey={refreshKey}/>
          
    </Box>
  );
};

export default CreateFieldstudy;