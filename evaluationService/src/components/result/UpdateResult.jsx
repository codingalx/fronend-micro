import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  FormHelperText,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import Header from "../common/Header";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import {
  createResult,
  getAllCategory,
  getAllCriterial,
  getAllResult,
  getAllSession,
  getResultById,
  listEmployee,
  updateResult,
} from "../../../configuration/EvaluationApi";
import { useLocation, useNavigate } from "react-router-dom";

const UpdateResult = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {};

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const [criterial, setCriterial] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const [allSession, setAllSession] = useState([]);
  const [result, setResult] = useState([]);
  const [employee, setEmployee] = useState([]);
  
  const [resultOne, setResultOne] = useState({
    sessionId: "",
    employeeId: "",
    categoryId: "",
    criteriaId: "",
    result: "",
    reason: "",
  });

  useEffect(() => {
    fetchAllCriterial();
    fetchAllCategory();
    fetchAllSession();
    fetchAllResult();
    fetchAllEmployee();
    fetchResultById();
  }, []);

  const fetchAllCriterial = async () => {
    try {
      const response = await getAllCriterial(tenantId);
      setCriterial(response.data);
    } catch (error) {
      console.error("Error fetching criterial:", error.message);
    }
  };

  const fetchAllSession = async () => {
    try {
      const response = await getAllSession(tenantId);
      setAllSession(response.data);
    } catch (error) {
      console.error("Error fetching session:", error.message);
    }
  };

  const fetchAllCategory = async () => {
    try {
      const response = await getAllCategory(tenantId);
      setAllCategory(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchAllResult = async () => {
    try {
      const response = await getAllResult(tenantId);
      setResult(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchAllEmployee = async () => {
    try {
      const response = await listEmployee(tenantId);
      setEmployee(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchResultById = async () => {
    try {
      const response = await getResultById(tenantId, id);
      setResultOne(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const sessionNameExists = result.some(
        (item) => item.sessionId === values.sessionId && item.id !== id // Exclude current ID
      );

      const isResultValid = criterial.every(
        (criteria) => values.result < criteria.weight
      );

      if (!isResultValid) {
        setNotification({
          open: true,
          message: "Result should be less than the weight set in the criteria. Please use a different one.",
          severity: "warning",
        });
        return;
      }

      if (sessionNameExists) {
        setNotification({
          open: true,
          message: "Session Name already exists. Please use a different one.",
          severity: "warning",
        });
        return;
      }

      await updateResult(tenantId,  id ,values);
      setNotification({
        open: true,
        message: "Result updated successfully!",
        severity: "success",
      });
      navigate('/evaluation/result'); // Redirect on cancel
      resetForm();
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to update result. Please try again.",
        severity: "error",
      });
    }
  };

  const checkoutSchema = yup.object().shape({
    sessionId: yup.string().required("Session is required"),
    employeeId: yup.string().required("Employee ID is required"),
    categoryId: yup.string().required("Category name is required"),
    criteriaId: yup.string().required("Criteria name is required"),
    reason: yup.string().required("Reason is required"),
    result: yup
      .number()
      .min(0, "Result score cannot be negative")
      .max(100, "Result score cannot exceed 100")
      .required("Result score is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Update Result" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={resultOne}
        validationSchema={checkoutSchema}
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
              <FormControl
                sx={{
                  flexGrow: 1,
                  flexShrink: 1,
                  minWidth: 0,
                  gridColumn: "span 2",
                }}
                error={!!touched.employeeId && !!errors.employeeId}
              >
                <Autocomplete
                  options={employee}
                  getOptionLabel={(option) => option.employeeId}
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: "employeeId",
                        value: newValue ? newValue.id : "",
                      },
                    });
                  }}
                  onBlur={handleBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Employee"
                      variant="outlined"
                      error={!!touched.employeeId && !!errors.employeeId}
                      helperText={touched.employeeId && errors.employeeId}
                    />
                  )}
                />
              </FormControl>

              <FormControl
                sx={{
                  flexGrow: 1,
                  flexShrink: 1,
                  minWidth: 0,
                  gridColumn: "span 2",
                }}
                error={!!touched.categoryId && !!errors.categoryId}
              >
                <InputLabel id="category-label">Select Evaluation Category</InputLabel>
                <Select
                  labelId="category-label"
                  value={values.categoryId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="categoryId"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select Evaluation Category Name</em>
                  </MenuItem>
                  {allCategory.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {touched.categoryId && errors.categoryId && (
                  <FormHelperText>{errors.categoryId}</FormHelperText>
                )}
              </FormControl>

              <FormControl
                sx={{
                  flexGrow: 1,
                  flexShrink: 1,
                  minWidth: 0,
                  gridColumn: "span 2",
                }}
                error={!!touched.criteriaId && !!errors.criteriaId}
              >
                <InputLabel id="criterial-label">Select Criteria</InputLabel>
                <Select
                  labelId="criterial-label"
                  value={values.criteriaId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="criteriaId"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select Criteria Name</em>
                  </MenuItem>
                  {criterial.map((criteria) => (
                    <MenuItem key={criteria.id} value={criteria.id}>
                      {criteria.name}
                    </MenuItem>
                  ))}
                </Select>
                {touched.criteriaId && errors.criteriaId && (
                  <FormHelperText>{errors.criteriaId}</FormHelperText>
                )}
              </FormControl>

              <FormControl
                sx={{
                  flexGrow: 1,
                  flexShrink: 1,
                  minWidth: 0,
                  gridColumn: "span 2",
                }}
                error={!!touched.sessionId && !!errors.sessionId}
              >
                <InputLabel id="session-label">Select Session Name</InputLabel>
                <Select
                  labelId="session-label"
                  value={values.sessionId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="sessionId"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select Session Name</em>
                  </MenuItem>
                  {allSession.map((session) => (
                    <MenuItem key={session.id} value={session.id}>
                      {session.term}
                    </MenuItem>
                  ))}
                </Select>
                {touched.sessionId && errors.sessionId && (
                  <FormHelperText>{errors.sessionId}</FormHelperText>
                )}
              </FormControl>

              <TextField
                fullWidth
                type="number"
                label="Result"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.result}
                name="result"
                error={!!touched.result && !!errors.result}
                helperText={touched.result && errors.result}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Reason"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.reason}
                name="reason"
                error={!!touched.reason && !!errors.reason}
                helperText={touched.reason && errors.reason}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update Result
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      {/* Snackbar for Notifications */}
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

export default UpdateResult;