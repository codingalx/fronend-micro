import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import { createRetirement, getEmployeeById } from "../../Api/separationApi";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../common/Header";
import ListRetirementUser from "./ListRetirementUser";

const CreateRetirement = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [authState] = useAtom(authAtom);
  const [employeeData, setEmployeeData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const username = authState.username;
  const tenantId = authState.tenantId;

  const fetchEmployeeData = async () => {
    return await getEmployeeById(tenantId, username);
  };

  const fetchData = async () => {
    try {
      const employeeResponse = await fetchEmployeeData();
      setEmployeeData(employeeResponse.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setNotification({
        open: true,
        message: "Failed to fetch data. Please try again.",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      const retirementData = {
        retirementType: values.retirementType,
        retirementDate: values.retirementDate,
      };

      formData.append("retirement", new Blob([JSON.stringify(retirementData)], { 
        type: "application/json" 
      }));
      formData.append("file", values.file);

      const response = await createRetirement(tenantId, formData);

      if (response.status === 201) {
        setNotification({
          open: true,
          message: "Retirement record created successfully!",
          severity: "success",
        });
        resetForm();
        // Manually reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      
      if (error.response && error.response.status === 409) {
        errorMessage = "You have already submitted a retirement request.";
      }
      
      setNotification({
        open: true,
        message: errorMessage,
        severity: "error",
      });
      console.error("Error creating retirement:", error);
    }
  };

  const initialValues = {
    retirementType: "AGE",
    retirementDate: "",
    file: null,
  };

  const retirementSchema = yup.object().shape({
    retirementDate: yup
      .date()
      .required("Retirement date is required")
      .test("is-future", "Retirement date must be in the future or today", (value) => {
        if (!value) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return value >= today;
      }),
    file: yup
      .mixed()
      .required("File is required")
      .test("fileSize", "File is too large (max 10MB)", (value) => value && value.size <= 10485760)
      .test("fileType", "Only PDF files are allowed", (value) => value && value.type === "application/pdf"),
  });

  const handleFileChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    setFieldValue("file", file);
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box m="20px">
      <Header subtitle="Create Retirement" />
      <Formik
        initialValues={initialValues}
        validationSchema={retirementSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
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
                label="Employee Name"
                value={employeeData ? `${employeeData.firstName} ${employeeData.middleName || ''} ${employeeData.lastName}` : ''}
                InputLabelProps={{ shrink: true }}
                sx={{ gridColumn: "span 2" }}
              />

              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel id="retirement-type-label">Retirement Type</InputLabel>
                <Select
                  labelId="retirement-type-label"
                  value={values.retirementType}
                  onChange={handleChange}
                  name="retirementType"
                  label="Retirement Type"
                  error={!!touched.retirementType && !!errors.retirementType}
                >
                  <MenuItem value="AGE">Age</MenuItem>
                  <MenuItem value="MEDICAL">Medical</MenuItem>
                </Select>
                {touched.retirementType && errors.retirementType && (
                  <Box color="red" fontSize="12px">{errors.retirementType}</Box>
                )}
              </FormControl>

              <TextField
                fullWidth
                type="date"
                label="Retirement Date"
                value={values.retirementDate}
                onChange={handleChange}
                onBlur={handleBlur}
                name="retirementDate"
                error={!!touched.retirementDate && !!errors.retirementDate}
                helperText={touched.retirementDate && errors.retirementDate}
                InputLabelProps={{ shrink: true }}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="file"
                inputRef={fileInputRef}
                onChange={(e) => handleFileChange(e, setFieldValue)}
                error={!!touched.file && !!errors.file}
                helperText={touched.file && errors.file}
                sx={{ gridColumn: "span 2" }}
                inputProps={{ accept: "application/pdf" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Retirement
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

      <ListRetirementUser refreshKey={refreshKey} />
    </Box>
  );
};

export default CreateRetirement;