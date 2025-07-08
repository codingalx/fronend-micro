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
import {
  createTermination,
  getAllTerminationTypes,
  getEmployeeById,
} from "../../Api/separationApi";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../common/Header";
import ListTerminationUser from "./ListTerminationUser"; 

const CreateTermination = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [terminationTypes, setTerminationTypes] = useState([]);
  const [authState] = useAtom(authAtom);
  const [employeeData, setEmployeeData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); 
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const username = authState.username;
  const tenantId = authState.tenantId;

  const fetchTerminationTypes = async () => {
    return await getAllTerminationTypes(tenantId);
  };

  const fetchEmployeeData = async () => {
    return await getEmployeeById(tenantId, username);
  };

  const fetchData = async () => {
    try {
      const [terminationTypesResponse, employeeResponse] = await Promise.all([
        fetchTerminationTypes(),
        fetchEmployeeData(),
      ]);

      setTerminationTypes(terminationTypesResponse.data);
      setEmployeeData(employeeResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setNotification({
        open: true,
        message: "Failed to fetch data.",
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
      const terminationData = {
        terminationTypeId: values.terminationTypeId,
        terminationDate: values.terminationDate,
        reason: values.reason,
      };

      formData.append("termination", new Blob([JSON.stringify(terminationData)], { type: "application/json" }));
      formData.append("file", values.file);

      const response = await createTermination(tenantId, formData);

      if (response.status === 201) {
        setNotification({
          open: true,
          message: "Termination record created successfully!",
          severity: "success",
        });
        resetForm();
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setRefreshKey((prev) => prev + 1); 
      }
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      
      if (error.response && error.response.status === 409) {
        errorMessage = "You have already submitted a termination request.";
      }
      
      setNotification({
        open: true,
        message: errorMessage,
        severity: "error",
      });
      console.error("Error creating termination:", error);
    }
  };

  const initialValues = {
    terminationTypeId: "",
    terminationDate: "",
    reason: "",
    file: null,
  };

  const terminationSchema = yup.object().shape({
    terminationTypeId: yup.string().required("Termination type is required"),
    terminationDate: yup
      .date()
      .required("Termination date is required")
      .test("is-future", "Termination date must be in the future or today", (value) => {
        if (!value) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return value >= today;
      }),
    reason: yup.string().required("Reason is required"),
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
      <Header subtitle="Create Termination" />
      <Formik
        initialValues={initialValues}
        validationSchema={terminationSchema}
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
                <InputLabel id="termination-type-label">Termination Type</InputLabel>
                <Select
                  labelId="termination-type-label"
                  value={values.terminationTypeId}
                  onChange={handleChange}
                  name="terminationTypeId"
                  label="Termination Type"
                  error={!!touched.terminationTypeId && !!errors.terminationTypeId}
                >
                  {terminationTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
                {touched.terminationTypeId && errors.terminationTypeId && (
                  <Box color="red" fontSize="12px">{errors.terminationTypeId}</Box>
                )}
              </FormControl>
              <TextField
                fullWidth
                type="date"
                label="Termination Date"
                value={values.terminationDate}
                onChange={handleChange}
                onBlur={handleBlur}
                name="terminationDate"
                error={!!touched.terminationDate && !!errors.terminationDate}
                helperText={touched.terminationDate && errors.terminationDate}
                InputLabelProps={{ shrink: true }}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Reason"
                value={values.reason}
                onChange={handleChange}
                onBlur={handleBlur}
                name="reason"
                error={!!touched.reason && !!errors.reason}
                helperText={touched.reason && errors.reason}
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
                Create Termination
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

      <ListTerminationUser refreshKey={refreshKey} />
    </Box>
  );
};

export default CreateTermination;