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
  listEmployee,
} from "../../../configuration/EvaluationApi";
import ListResult from "./ListResult";

const CreateResult = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const [criterial, setCriterial] = useState([]);
  const [allCategory, setAllcategory] = useState([]);
  const [allSession, setAllSession] = useState([]);
  const [result, setResult] = useState([]);
  const [employee, setEmployee] = useState([]);

  useEffect(() => {
    fetchAllCriterial();
    fetchAllCategory();
    fetchallSession();
    fetchAllResult();
    fetchAllEmployee();
  }, []);

  const fetchAllCriterial = async () => {
    try {
      const response = await getAllCriterial(tenantId);
      setCriterial(response.data);
    } catch (error) {
      console.error("Error fetching criterial:", error.message);
    }
  };

  const fetchallSession = async () => {
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
      setAllcategory(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const fetchAllResult = async () => {
    try {
      const response = await getAllResult(tenantId);
      setResult(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const fetchAllEmployee = async () => {
    try {
      const response = await listEmployee(tenantId);
      setEmployee(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const sessionNameExists = result.some(
        (result) => result.sessionId === values.sessionId
      );
  
      // Check if the result is less than the weight of any criteria
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
  
      await createResult(tenantId, values);
      setNotification({
        open: true,
        message: "Session name created successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to create session name. Please try again.",
        severity: "error",
      });
    }
  };

  const initialValues = {
    sessionId: "",
    employeeId: "",
    categoryId: "",
    criteriaId: "",
    result: "",
    reason: "",
  };

  const checkoutSchema = yup.object().shape({
    sessionId: yup.string().required("session is required"),
    employeeId: yup.string().required("employeeId is required"),
    categoryId: yup.string().required("category name is required"),
    criteriaId: yup.string().required("criteria name is required"),
    reason: yup.string().required("reason  is required"),
    result: yup
      .number()
      .min(0, "result  score cannot be negative")
      .max(100, "result score cannot exceed 100")
      .required("result score is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create criterial name " />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
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
                        value: newValue ? newValue.id : "", // Set the selected employee id
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
                <InputLabel id="category-label">
                  Select Evaluation Category
                </InputLabel>
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
                  {allCategory.map((name) => (
                    <MenuItem key={name.id} value={name.id}>
                      {name.name}
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
                <InputLabel id="criterial-label">Select Criterial</InputLabel>
                <Select
                  labelId="criterial-label"
                  value={values.criteriaId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="criteriaId"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select Criterial Name</em>
                  </MenuItem>
                  {criterial.map((name) => (
                    <MenuItem key={name.id} value={name.id}>
                      {name.name}
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
                error={!!touched.criteriaId && !!errors.criteriaId}
              >
                <InputLabel id="session-label">Select session name</InputLabel>
                <Select
                  labelId="session-label"
                  value={values.sessionId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="sessionId"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select session name</em>
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
                label="result"
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
                label="reason"
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
                Create Result
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
      <ListResult refreshKey={refreshKey} />
    </Box>
  );
};

export default CreateResult;
