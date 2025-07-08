
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
import {  getFieldofstudyById, listFieldOfstudy, updateFieldofstudy } from "../../../configuration/organizationApi";
import NotFoundHandle from "../common/NotFoundHandle";
import { useLocation, useNavigate } from "react-router-dom";




const UpdateFieldStudy = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom) 
  const tenantId = authState.tenantId
  
       const location = useLocation();
       const navigate = useNavigate();
        const { id } = location.state || {};
  


  const [refreshKey, setRefreshKey] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
    const [allFieldStudy, setAllFieldStudy] = useState([]);
  
  
 
  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };


  const [fieldstudy, setFieldStudy] = useState({
    fieldOfStudy: "",
    description: "",
  })

  useEffect(() => {
    fetchFieldStudy();
}, []);

  const fetchFieldStudy = async () => {
    try {
        const response = await listFieldOfstudy(tenantId);
        const data = response.data;
        setAllFieldStudy(data);
    } catch (error) {
        console.error("Error fetching field of study:", error.message);
    }
};

  useEffect(() => {
    fetchgetAllFieldStudy();
      }, []);
  
      const fetchgetAllFieldStudy = async () => {
          try {
              const response = await getFieldofstudyById(tenantId,id);
              setFieldStudy(response.data);
          } catch (error) {
              setError(error.message);
              console.error(error.message);
          }
      };


  const handleFormSubmit = async (values, { resetForm }) => {
    try {

      const fieldStudyExists = allFieldStudy.some(
        (allFieldStudy) => allFieldStudy.fieldOfStudy === values.allFieldStudy && allFieldStudy.id !== id
    );

    if (fieldStudyExists) {
      setNotification({
          open: true,
          message: " field of study already exists. Please use a different one.",
          severity: "warning",
      });
      return;
  }

      await updateFieldofstudy(tenantId,id,values);
      setNotification({
        open: true,
        message: "field of study  update successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey(prev => prev + 1); 
      navigate('/manage_organization_info', { state: { activeTab: 10 } }); //

      
    } 
    catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to update field of study . Please try again.",
        severity: "error",
      });
    }
  };




  const checkoutSchema = yup.object().shape({
    fieldOfStudy: yup.string().required("name is required"),
  });

  if (!id) {
    return <NotFoundHandle message="No field selected for updation." navigateTo="/employee/country" />;
  }


  return (
    <Box m="20px">
      <Header subtitle= "Update Field of study" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={fieldstudy}
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
          
    </Box>
  );
};

export default UpdateFieldStudy;