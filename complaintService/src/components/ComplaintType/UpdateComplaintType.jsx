import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, TextField, Snackbar, Alert } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  getComplaintType,
  updateComplaintType,
} from "../../Api/ComplaintTypeApi";
import NotPageHandle from "../../common/NoPageHandle";
import Header from "../../common/Header";

const UpdateComplaintType = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const complaintTypeId = location.state?.complaintTypeId; // Retrieve complaintTypeId from location.state
  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
  });

  if (!complaintTypeId) {
    return (
      <NotPageHandle
        message="No Complaint Type selected to update"
        navigateTo="/complaint/create-complaint-type"
      />
    );
  }

  const fetchComplaintType = async () => {
    try {
      const tenantId = localStorage.getItem("tenantId"); // Assuming tenantId is stored in localStorage
      const response = await getComplaintType(tenantId, complaintTypeId);
      setInitialValues({
        name: response.data.name, // Accessing response.data to get the actual data
        description: response.data.description,
      });
    } catch (error) {
      console.error("Error fetching complaint type:", error);
      setNotification({
        open: true,
        message: "Failed to fetch complaint type.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaintType();
  }, [complaintTypeId]);

  const handleFormSubmit = async (values) => {
    try {
      const tenantId = localStorage.getItem("tenantId");
      await updateComplaintType(tenantId, complaintTypeId, values);
      setNotification({
        open: true,
        message: "Complaint type updated successfully!",
        severity: "success",
      });
      setTimeout(() => navigate("/complaint/create-complaint-type"), 20); // Redirect after success
    } catch (error) {
      console.error("Error updating complaint type:", error);
      setNotification({
        open: true,
        message: "Failed to update complaint type.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <p>Loading...</p>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header subtitle="Update Complaint Type" />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
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
                "& > div": { gridColumn: "span 2" },
              }}
            >
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={values.name}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={values.description}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update Complaint Type
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

export default UpdateComplaintType;
