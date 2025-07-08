import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import {
  addComplaintHandling,
  listDepartments,
} from "../../Api/ComplaintHandlingApi";
import Header from "../../common/Header";

const CreateComplaintHandling = ({ complaintId }) => {
  const [departments, setDepartments] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  useEffect(() => {
    if (!tenantId) {
      console.error("Tenant ID is undefined. Cannot fetch departments.");
      setNotification({
        open: true,
        message: "Tenant ID is missing. Please login again.",
        severity: "error",
      });
      return;
    }
    const fetchDepartments = async () => {
      try {
        const response = await listDepartments(tenantId);
        console.log("Fetched Departments Data:", response.data);
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setNotification({
          open: true,
          message: "Failed to fetch departments.",
          severity: "error",
        });
      }
    };
    fetchDepartments();
  }, [tenantId]);

  const validationSchema = Yup.object().shape({
    departmentId: Yup.string().required("Department is required"),
  });

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      await addComplaintHandling(tenantId, {
        complaintId, // Use the prop, not from form
        departmentId: values.departmentId,
      });
      setNotification({
        open: true,
        message: "Complaint handling created successfully!",
        severity: "success",
      });
      resetForm();
    } catch (error) {
      console.error("Error creating complaint handling:", error);
      setNotification({
        open: true,
        message: "Failed to create complaint handling.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box m="20px">
      <Header subtitle="Create Complaint Handling" />
      <Formik
        initialValues={{
          departmentId: "",
        }}
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
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                labelId="department-label"
                name="departmentId"
                value={values.departmentId}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.departmentId && !!errors.departmentId}
                label="Department"
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.departmentName}
                  </MenuItem>
                ))}
              </Select>
              {touched.departmentId && errors.departmentId && (
                <Box color="red" fontSize="12px">
                  {errors.departmentId}
                </Box>
              )}
            </FormControl>
            <Button type="submit" color="secondary" variant="contained">
              Create Complaint Handling
            </Button>
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

export default CreateComplaintHandling;
