import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import { getExcuseById, updateExcuse } from "../../Api/Attendance-Api";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../Header";

const UpdateExcuse = () => {
  const location = useLocation();
  const { ExcuseId } = location.state || {};
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const Excuseschema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string(),
  });

  const [excuseData, setExcuseData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    loadData();
  }, [ExcuseId]);

  const loadData = async () => {
    try {
      const response = await getExcuseById(ExcuseId);
      setExcuseData({
        name: response.data.name,
        description: response.data.description,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setNotification({
        open: true,
        message: "Error fetching excuse to update",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      await updateExcuse(ExcuseId, values);
      setNotification({
        open: true,
        message: "Excuse updated successfully!",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/attendance/set_up", { state: { activeTab: 4 } });
      }, 1000);
    } catch (error) {
      console.error("Error updating excuse:", error);
      setNotification({
        open: true,
        message: "Error updating excuse",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box m="20px">
      <Header subtitle="Update Excuse Types" />
      <Formik
        initialValues={excuseData}
        validationSchema={Excuseschema}
        onSubmit={handleFormSubmit}
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
                label="Name"
                name="name"
                sx={{ gridColumn: "span 2" }}
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                margin="normal"
                sx={{
                  gridColumn: "span 2",
                  "& .MuiInputBase-root": {
                    height: "auto",
                  },
                }}
                multiline
                rows={4}
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
    </Box>
  );
};

export default UpdateExcuse;
