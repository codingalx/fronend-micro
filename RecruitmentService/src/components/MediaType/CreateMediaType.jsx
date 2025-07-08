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
import { Formik } from "formik";
import Header from "../common/Header";
import { createMediaType, listMediaType } from "../../../configuration/RecruitmentApp";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import ListMediaType from "./ListMediaType";

const CreateMediaType = () => {
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
  const [mediaNames, setMediaNames] = useState([]);

  useEffect(() => {
    fetchAllMediaTypes();
  }, []);

  const fetchAllMediaTypes = async () => {
    try {
      const response = await listMediaType(tenantId);
      const data = response.data;
      setMediaNames(data);
    } catch (error) {
      console.error("Error fetching media types:", error.message);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const mediaNameExists = mediaNames.some(
        (mediaType) => mediaType.mediaTypeName === values.mediaTypeName
      );

      if (mediaNameExists) {
        setNotification({
          open: true,
          message: "Media Name already exists. Please use a different one.",
          severity: "warning",
        });
        return;
      }

      await createMediaType(tenantId, values);
      setNotification({
        open: true,
        message: "Media type created successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey(prev => prev + 1);
      
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to create media. Please try again.",
        severity: "error",
      });
    }
  };

  const initialValues = {
    mediaTypeName: "",
    description: "",
  };

  const checkoutSchema = yup.object().shape({
    mediaTypeName: yup.string().required("Media name is required"),
    description: yup.string().required("Description is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create Media Type" />
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
                label="Media Type Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.mediaTypeName}
                name="mediaTypeName"
                error={!!touched.mediaTypeName && !!errors.mediaTypeName}
                helperText={touched.mediaTypeName && errors.mediaTypeName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
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
                Create Media Type
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
            <ListMediaType  refreshKey={refreshKey}/>
      
    </Box>
  );
};

export default CreateMediaType;