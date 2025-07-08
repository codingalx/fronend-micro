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
import { Formik, Form } from "formik";
import * as yup from "yup";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import { getAllDepartments, getClearanceDepartment, updateClearanceDepartment } from "../../Api/separationApi";
import { useLocation, useNavigate } from "react-router-dom";
import useMediaQuery from '@mui/material/useMediaQuery';
import NotPageHandle from "../../common/NoPageHandle";
import Header from "../../common/Header";

const UpdateClearanceDepartment = () => {
  const location = useLocation();
  const clearanceDepartmentId = location.state?.clearanceDepartmentId;
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [initialValues, setInitialValues] = useState({
    departmentId: "",
    sequencePriority: 0,
  });
  
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  const fetchData = async () => {
    if (!tenantId || !clearanceDepartmentId) {
      console.error("Tenant ID or Clearance Department ID is not set.");
      return;
    }
    try {
      const [departmentsResponse, clearanceResponse] = await Promise.all([
        getAllDepartments(tenantId),
        getClearanceDepartment(tenantId, clearanceDepartmentId),
      ]);

      if (departmentsResponse.status === 200) {
        setDepartments(departmentsResponse.data);
      }
      if (clearanceResponse.status === 200) {
        const department = departmentsResponse.data.find(d => d.id === clearanceResponse.data.departmentId);
        if (department) {
          setDepartmentName(department.departmentName);
        }
        setInitialValues({
          departmentId: clearanceResponse.data.departmentId,
          sequencePriority: clearanceResponse.data.sequencePriority,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setNotification({
        open: true,
        message: "Failed to fetch data: " + (error.response?.data?.message || error.message),
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormSubmit = async (values) => {
    try {
      const response = await updateClearanceDepartment(tenantId, clearanceDepartmentId, values.sequencePriority, values);
      if (response.status === 200) {
        setNotification({
          open: true,
          message: "Clearance department updated successfully!",
          severity: "success",
        });

        setTimeout(() => {
          navigate(-1);
        }, 2000); 
      } else {
        setNotification({
          open: true,
          message: "Error updating clearance department. Please try again.",
          severity: "error",
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: "An error occurred. Please try again.",
        severity: "error",
      });
      console.error("Error updating clearance department:", error);
    }
  };
  
  const validationSchema = yup.object().shape({
    departmentId: yup.string().required("Department is required"),
    sequencePriority: yup.number().required("Sequence Priority is required").min(0, "Must be at least 0"),
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  if (!clearanceDepartmentId) {
    return <NotPageHandle message="No Clearance Department selected to Update " navigateTo="/separation/create-clearance-department" />;
  }

  return (
    <Box m="20px">
      <Header subtitle="Update Clearance Department"/>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
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
                label="Department"
                value={departmentName || ""}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ gridColumn: "span 2" }}
              />

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

            <Box display="flex" justifyContent={isNonMobile ? "start" : "center"} mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update Clearance Department
              </Button>
            </Box>
          </Form>
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

export default UpdateClearanceDepartment;