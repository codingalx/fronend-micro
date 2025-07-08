import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  Typography,
  useMediaQuery,
  Paper,
  Fade,
} from "@mui/material";
import * as yup from "yup";
import { Formik } from "formik";
import { getUserByuseName, resetPassWord } from "../../../configuration/authApi";
import { useLocation } from "react-router-dom";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const ResetPassWord = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
     const [authState] = useAtom(authAtom); 
      const tenantId = authState.tenantId
  const location = useLocation();
  const [userId, setUserId] = useState(null);
  const username = location.state?.username || authState.username;


  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [uses, setUses] = useState([]);

  useEffect(() => {
    if (username) {
      fetchAllUsers(username);
    }
  }, [username]); // Fetch user data when username changes


  const fetchAllUsers = async () => {
    try {
      const response = await getUserByuseName(tenantId,username);
      const data = response.data;
      setUses(data);
      if (data.id) {
        setUserId(data.id);
      }
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      await resetPassWord(tenantId,userId, values);
      setNotification({
        open: true,
        message: "User password changed successfully!",
        severity: "success",
      });
      resetForm();
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to change the user password. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const validationSchema = yup.object().shape({
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")

      ,
    confirmPassword: yup
      .string()
      .required("Confirm password is required")
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  });

  return (
    <Fade in={true} timeout={500}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        mt={-10}
        sx={{
          backgroundColor: "#f0f2f5",
          padding: "20px",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: isNonMobile ? "50%" : "90%",
            padding: "30px",
            borderRadius: "12px",
            backgroundColor: "#ffffff",
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
            Reset Password
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Enter your new password and confirm it below.
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
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
                  gap="20px"
                  gridTemplateColumns={isNonMobile ? "1fr 1fr" : "1fr"}
                  mt="20px"
                >
                  <TextField
                    fullWidth
                    type="password"
                    label="New Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    variant="outlined"
                    sx={{ backgroundColor: "#f9f9f9" }}
                  />
                  <TextField
                    fullWidth
                    type="password"
                    label="Confirm Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.confirmPassword}
                    name="confirmPassword"
                    error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                    variant="outlined"
                    sx={{ backgroundColor: "#f9f9f9" }}
                  />
                </Box>
                <Box display="flex" justifyContent="center" mt="20px">
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    size="large"
                    sx={{
                      fontWeight: "bold",
                      textTransform: "none",
                      borderRadius: "8px",
                      padding: "10px 20px",
                    }}
                  >
                    Reset Password
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
            <Alert
              onClose={handleCloseSnackbar}
              severity={notification.severity}
              sx={{ width: "100%" }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        </Paper>
      </Box>
    </Fade>
  );
};

export default ResetPassWord;