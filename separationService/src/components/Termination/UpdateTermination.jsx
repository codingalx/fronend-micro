import React, { useState, useEffect } from "react";
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
  updateTermination,
  getTermination,
  getEmployeeById,
  getTerminationFile,
  getAllTerminationTypes,
} from "../../Api/separationApi";
import { useLocation, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import NotPageHandle from "../../common/NoPageHandle";
import Header from "../../common/Header";

const UpdateTermination = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)"); 
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [authState] = useAtom(authAtom);
  const [employeeData, setEmployeeData] = useState(null);
  const [terminationTypes, setTerminationTypes] = useState([]);
  const [terminationData, setTerminationData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const terminationId = location.state?.terminationId;
  const tenantId = authState.tenantId;


  const fetchEmployeeData = async () => {
    try {
      const response = await getEmployeeById(tenantId, authState.username);
      setEmployeeData(response.data);
    } catch (error) {
      console.error("Failed to fetch employee data:", error);
    }
  };

  const fetchTerminationTypes = async () => {
    try {
      const response = await getAllTerminationTypes(tenantId);
      setTerminationTypes(response.data);
    } catch (error) {
      console.error("Failed to fetch termination types:", error);
    }
  };

  const fetchTerminationData = async () => {
    if (!terminationId) return;
    
    try {
      const [terminationResponse, fileResponse] = await Promise.all([
        getTermination(tenantId, terminationId),
        getTerminationFile(tenantId, terminationId).catch(() => null) 
      ]);

      setTerminationData({
        ...terminationResponse.data,
        existingFile: fileResponse?.data ? {
          fileName: fileResponse.data.fileName,
          fileBytes: fileResponse.data.fileBytes
        } : null
      });
    } catch (error) {
      console.error("Error fetching termination data:", error);
      setNotification({
        open: true,
        message: "Failed to fetch termination record.",
        severity: "error",
      });
    }
  };

  const fetchData = async () => {
    await Promise.all([
      fetchEmployeeData(),
      fetchTerminationTypes(),
      fetchTerminationData()
    ]);
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

      if (values.file) {
        formData.append("file", values.file); 
      } else {
        formData.append("file", new Blob([]), ""); 
      }

      const response = await updateTermination(tenantId, terminationId, formData);

      if (response.status === 200) {
        setNotification({
          open: true,
          message: "Termination record updated successfully!",
          severity: "success",
        });
        resetForm();
        navigate(-1);
      } else {
        setNotification({
          open: true,
          message: "Error updating termination record. Please try again.",
          severity: "error",
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: "An error occurred. Please try again.",
        severity: "error",
      });
      console.error("Error updating termination:", error);
    }
  };

  const terminationSchema = yup.object().shape({
    terminationTypeId: yup.string().required("Termination type is required"),
    terminationDate: yup
      .date()
      .required("Termination date is required")
      .min(new Date(), "Termination date cannot be in the past")
      .test(
        "is-valid-date",
        "Termination date cannot be in the past",
        (value) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const selectedDate = new Date(value);
          selectedDate.setHours(0, 0, 0, 0);
          return selectedDate >= today;
        }
      ),
    reason: yup.string().required("Reason is required"),
    file: yup
      .mixed()
      .nullable()
      .test("fileSize", "File is too large", (value) => !value || (value && value.size <= 10485760))
      .test("fileType", "Unsupported file type", (value) => !value || (value && value.type === "application/pdf")),
  });

  const handleFileChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    setFieldValue("file", file);
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  if (!terminationId) {
    return <NotPageHandle message="No Termination selected to Update" navigateTo="/create-termination" />;
  }

  return (
    <Box m="20px">
      <Header subtitle="Update Termination" />
      
      {terminationData && (
        <Formik
          initialValues={{
            terminationTypeId: terminationData.terminationTypeId,
            terminationDate: terminationData.terminationDate.split("T")[0],
            reason: terminationData.reason,
            file: null,
            existingFile: terminationData.existingFile
          }}
          validationSchema={terminationSchema}
          enableReinitialize
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
                  value={employeeData ? `${employeeData.firstName} ${employeeData.middleName || ""} ${employeeData.lastName}` : ""}
                  disabled
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
                  label="Reason for Termination"
                  value={values.reason}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="reason"
                  error={!!touched.reason && !!errors.reason}
                  helperText={touched.reason && errors.reason}
                  InputLabelProps={{ shrink: true }}
                  sx={{ gridColumn: "span 2" }}
                />

                {values.existingFile && (
                  <Box sx={{ gridColumn: "span 2", display: "flex", alignItems: "center" }}>
                    <span>Existing File: {values.existingFile.fileName}</span>
                  </Box>
                )}

                <TextField
                  fullWidth
                  type="file"
                  onChange={(e) => handleFileChange(e, setFieldValue)}
                  error={!!touched.file && !!errors.file}
                  helperText={touched.file && errors.file}
                  sx={{ gridColumn: "span 2" }}
                />
              </Box>
              <Box display="flex" justifyContent="center" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Update Termination
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateTermination; 