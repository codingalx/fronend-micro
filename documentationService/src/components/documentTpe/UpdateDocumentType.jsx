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
import { useLocation, useNavigate } from "react-router-dom";
import NotFoundHandle from "../common/NotFoundHandle";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; // Adjust the import based on your structure
import { getDocumentTypeById, updateDocumentType,getAllDocumentType } from "../../../configuration/DocumentationApi";



const UpdateDocumentType = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom); // Access the shared authentication state
  const tenantId = authState.tenantId
  const [allDocumentType, setAllDocumentType] = useState([]);



  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate()

   const location = useLocation();
   const { id } = location.state || {};

  

  const [document, setDocument] = useState({
    name: "",
    description: "",
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [refreshKey, setRefreshKey] = useState(0);

  const handleFormSubmit = async (values, { resetForm }) => {
    try {

      const documentExists = allDocumentType.some(
        (document) => document.name === values.name && document.id !== id
      );

      if (documentExists) {
        setNotification({
          open: true,
          message: "Document already exists. Please use a different one.",
          severity: "warning",
        });
        return;
      }

      await updateDocumentType(tenantId,id,values);
      setNotification({
        open: true,
        message: "document  updated successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey(prev => prev + 1); 
      navigate('/document/document_type'); //

    } 
    catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to update document type . Please try again.",
        severity: "error",
      });
    }
  };

   useEffect(() => {
    fetchDocumentType();
    fetchAllDocumentType();
      }, []);
  
      const fetchDocumentType = async () => {
          try {
              const response = await getDocumentTypeById(tenantId,id);
              setDocument(response.data);
          } catch (error) {
              setError(error.message);
              console.error(error.message);
          }
      };


      const fetchAllDocumentType = async () => {
        try {
          const response = await getAllDocumentType(tenantId);
          setAllDocumentType(response.data);
        } catch (error) {
          console.error("Error fetching document type:", error.message);
        }
      };

 


  const checkoutSchema = yup.object().shape({
    name: yup.string().required("name is required"),
    description: yup.string().required("description is required"),
  });

  if (!id) {
    return <NotFoundHandle message="No document type selected for updation." navigateTo="/document/document_type" />;
  }

  

 

  return (
    <Box m="20px">
      <Header subtitle= "Update Document type" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={document}
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
                label="Document type"
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
                Update DocumentType
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

export default UpdateDocumentType;