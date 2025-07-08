import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Snackbar, Alert } from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import Header from "../common/Header";
import { getTitleNameById,listTitleName,updateTitleName } from "../../Api/employeeApi";
import NotFoundHandle from "../common/NotFoundHandle";

import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; // Adjust the import based on your structure


const UpdateTitleName = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
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

    const [title, setTitle] = useState()
    
        useEffect(() => {
          fetchAllTitleName();
      }, []);
      
        const fetchAllTitleName = async () => {
          try {
              const response = await listTitleName(tenantId);
              const data = response.data;
              setTitle(data);
          } catch (error) {
              console.error("Error fetching title Name:", error.message);
          }
      };
      

  const [titleName, setTitleName] = useState({
    titleName: "",
    description: "",
  });

  const handleFormSubmit = async (values) => {
    try {

      const titleNameExists = title.some(
        (title) => title.titleName === values.titleName && title.id !== id
    );

    if (titleNameExists) {
      setNotification({
          open: true,
          message: " title Name already exists. Please use a different one.",
          severity: "warning",
      });
      return;
  }

      await updateTitleName(tenantId,id, values);
      setNotification({
        open: true,
        message: "Title Name updated successfully!",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/employee/title_name");
      }, 250);
      
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to update Title Name. Please try again.",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchTitleName();
  }, []);

  const fetchTitleName = async () => {
    try {
      const response = await getTitleNameById(tenantId,id);
      setTitleName(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch title name:", error.message);
      setNotification({
        open: true,
        message: "Failed to load data. Please try again.",
        severity: "error",
      });
    }
  };

  const checkoutSchema = yup.object().shape({
    titleName: yup.string().required("Title name cannot be blank"),
  });
  
  if (!id) {
    return <NotFoundHandle message="No title Name selected for updation." navigateTo="/employee/title_name" />;
  }

  return (
    <Box m="20px">
      <Header subtitle="Update Title Name" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={titleName}
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
                Update
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
    </Box>
  );
};

export default UpdateTitleName;
