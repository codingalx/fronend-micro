import React, { useState,useEffect } from "react";
import { Box, Button, TextField, Snackbar, Alert } from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import Header from "../common/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { getLanguageNameById ,listLanguageName,updateLanguageName} from "../../Api/employeeApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; // Adjust the import based on your structure
import NotFoundHandle from "../common/NotFoundHandle";
  


const UpdateLanguageName = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
    const [authState] = useAtom(authAtom); // Access the shared authentication state
    const tenantId = authState.tenantId

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const location = useLocation();
  const navigate = useNavigate();

  const { id } = location.state || {};



  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

    const [languageName, setLanguageName] = useState({
        languageName: "",
        description: "",
    });


    useEffect(() => {
        fetchLanguageName();
          }, []);

      
          const fetchLanguageName = async () => {
              try {
                  const response = await getLanguageNameById(tenantId,id);
                  setLanguageName(response.data);
              } catch (error) {
                  setError(error.message);
                  console.error(error.message);
              }
          };

           const [language, setLanguage] = useState()
          
              useEffect(() => {
                fetchAllLangugaeName();
            }, []);
            
              const fetchAllLangugaeName = async () => {
                try {
                    const response = await listLanguageName(tenantId);
                    const data = response.data;
                    setLanguage(data);
                } catch (error) {
                    console.error("Error fetching langugae name:", error.message);
                }
            };
            
          


  const [refreshKey, setRefreshKey] = useState(0);

  const handleFormSubmit = async (values, { resetForm }) => {
    try {

      const langugaeNameExists = language.some(
        (language) => language.languageName === values.languageName &&  language.id !== id
    );

    if (langugaeNameExists) {
      setNotification({
          open: true,
          message: " Langugae Name already exists. Please use a different one.",
          severity: "warning",
      });
      return;
  }


      
      await updateLanguageName(tenantId,id, values);
      setNotification({
        open: true,
        message: "language Name  update successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey((prev) => prev + 1);
      setTimeout(() => {
        navigate('/employee/language_name'); //
      }, 250);
    
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to update language name . Please try again.",
        severity: "error",
      });
    }
  };

 

  const checkoutSchema = yup.object().shape({
    languageName: yup.string().required("language Name is required"),
  });

  if (!id) {
    return <NotFoundHandle message="No langugae Name selected for updation." navigateTo="/employee/language_name" />;
  }

  return (
    <Box m="20px">
      <Header subtitle="Update Language Name" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={languageName}
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
                Update
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
    </Box>
  );
};

export default UpdateLanguageName;
