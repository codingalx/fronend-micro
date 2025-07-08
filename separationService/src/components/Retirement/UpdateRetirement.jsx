import React, { useEffect, useState } from "react";
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
  updateRetirement,
  getRetirement,
  getEmployeeById,
  getRetirementFile,
} from "../../Api/separationApi";
import { useLocation, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import NotPageHandle from "../../common/NoPageHandle";
import Header from "../../common/Header";

const UpdateRetirement = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)"); 
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [authState] = useAtom(authAtom);
  const [employeeData, setEmployeeData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const retirementId = location.state?.retirementId;
  const tenantId = authState.tenantId;

  const [initialValues, setInitialValues] = useState({
    retirementType: "AGE",
    retirementDate: "",
    file: null,
    existingFile: null,
  });

  const fetchEmployeeData = async () => {
    try {
      const response = await getEmployeeById(tenantId, authState.username);
      setEmployeeData(response.data);
    } catch (error) {
      console.error("Failed to fetch employee data:", error);
    }
  };

  const fetchRetirementData = async () => {
    try {
      const response = await getRetirement(tenantId, retirementId);
      const retirementData = response.data;

      setInitialValues({
        retirementType: retirementData.retirementType,
        retirementDate: retirementData.retirementDate.split("T")[0],
        file: null,
        existingFile: null,
      });

      try {
        const fileResponse = await getRetirementFile(tenantId, retirementId);
        setInitialValues((prevValues) => ({
          ...prevValues,
          existingFile: {
            ...fileResponse.data,
            fileName: fileResponse.data.fileName,
          },
        }));
      } catch (fileError) {
        console.error("Failed to fetch retirement file:", fileError);
      }
    } catch (error) {
      console.error("Error fetching retirement data:", error);
      setNotification({
        open: true,
        message: "Failed to fetch retirement record.",
        severity: "error",
      });
    }
  };

  const fetchData = async () => {
    await fetchEmployeeData();
    if (retirementId) {
      await fetchRetirementData();
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
  
      formData.append("retirement", new Blob([JSON.stringify(retirementData)], { type: "application/json" }));
  
      if (values.file) {
        formData.append("file", values.file); 
      } else {
        formData.append("file", new Blob([]), ""); 
      }
  
      const response = await updateRetirement(tenantId, retirementId, formData);
  
      if (response.status === 200) {
        setNotification({
          open: true,
          message: "Retirement record updated successfully!",
          severity: "success",
        });
        resetForm();
        navigate(-1);
      } else {
        setNotification({
          open: true,
          message: "Error updating retirement record. Please try again.",
          severity: "error",
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: "An error occurred. Please try again.",
        severity: "error",
      });
      console.error("Error updating retirement:", error);
    }
  };

  const retirementSchema = yup.object().shape({
    retirementDate: yup
      .date()
      .required("Retirement date is required")
      .min(new Date(), "Retirement date cannot be in the past")
      .test(
        "is-valid-date",
        "Retirement date cannot be in the past",
        (value) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const selectedDate = new Date(value);
          selectedDate.setHours(0, 0, 0, 0);
          return selectedDate >= today;
        }
      ),
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

  if (!retirementId) {
    return <NotPageHandle message="No Retirement selected to Update" navigateTo="/separation/create-retirement" />;
  }

  return (
    <Box m="20px">
      <Header subtitle="Update Retirement" />
      <Formik
        initialValues={initialValues}
        validationSchema={retirementSchema}
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

              {initialValues.existingFile && (
                <Box sx={{ gridColumn: "span 2", display: "flex", alignItems: "center" }}>
                  <span>Existing File: {initialValues.existingFile.fileName}</span>
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
                Update Retirement
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

export default UpdateRetirement;