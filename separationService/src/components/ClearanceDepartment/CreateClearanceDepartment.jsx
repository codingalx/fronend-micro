import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import { createClearanceDepartment, getAllDepartments } from "../../Api/separationApi";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../common/Header"; 
import ListClearanceDepartment from "./ListClearanceDepartment"; 

const CreateClearanceDepartment = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [departments, setDepartments] = useState([]);
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId; 
  const [refreshKey, setRefreshKey] = useState(0); 

  const fetchDepartments = async () => {
    if (!tenantId) {
      console.error("Tenant ID is not set. Cannot fetch departments.");
      return;
    }

    try {
      const response = await getAllDepartments(tenantId);
      if (response.status === 200) {
        setDepartments(response.data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error.response || error);
      setNotification({
        open: true,
        message: "Failed to fetch departments: " + (error.response?.data?.message || error.message),
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const departmentData = {
        departmentId: values.departmentId,
        sequencePriority: values.sequencePriority,
      };

      const response = await createClearanceDepartment(tenantId, departmentData); 

      if (response.status === 201) {
        setNotification({
          open: true,
          message: "Clearance department created successfully!",
          severity: "success",
        });
        resetForm();
        setRefreshKey(prev => prev + 1); 
      } else {
        setNotification({
          open: true,
          message: "Error creating clearance department. Please try again.",
          severity: "error",
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: "An error occurred. Please try again.",
        severity: "error",
      });
      console.error("Error creating clearance department:", error);
    }
  };

  const initialValues = {
    departmentId: "", 
    sequencePriority: 0,
  };

  const clearanceDepartmentSchema = Yup.object().shape({
    departmentId: Yup.string().required("Department is required"),
    sequencePriority: Yup.number()
      .required("Sequence Priority is required")
      .min(0, 'Sequence Priority must be at least 0'),
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box m="20px">
      <Header subtitle="Create Clearance Department" />
      <Formik
        initialValues={initialValues}
        validationSchema={clearanceDepartmentSchema}
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
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel id="department-label">Select Department</InputLabel>
                <Select
                  labelId="department-label"
                  value={values.departmentId}
                  onChange={handleChange}
                  name="departmentId"
                  label="Select Department"
                  error={!!touched.departmentId && !!errors.departmentId}
                  onBlur={handleBlur}
                >
                  <MenuItem value="">
                    <em>--Select a Department--</em>
                  </MenuItem>
                  {departments.map((department) => (
                    <MenuItem key={department.id} value={department.id}>
                      {department.departmentName}
                    </MenuItem>
                  ))}
                </Select>
                {touched.departmentId && errors.departmentId && (
                  <Box color="red" fontSize="12px">{errors.departmentId}</Box>
                )}
              </FormControl>

              <TextField
                fullWidth
                type="number"
                label="Sequence Priority"
                value={values.sequencePriority}
                onChange={handleChange}
                onBlur={handleBlur}
                name="sequencePriority"
                error={!!touched.sequencePriority && !!errors.sequencePriority}
                helperText={touched.sequencePriority && errors.sequencePriority}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>

            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Clearance Department
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

      <ListClearanceDepartment key={refreshKey} />
    </Box>
  );
};

export default CreateClearanceDepartment;