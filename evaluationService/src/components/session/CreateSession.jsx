import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import Header from "../common/Header";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import {
  createSession,
  getAllbudgetYears,
  getAllSession,
} from "../../../configuration/EvaluationApi";
import ListSession from "./ListSession";

const CreateSession = () => {
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
  const [session, setSession] = useState([]);
  const [budgetYear, setBudgetYear] = useState([]);

  useEffect(() => {
    fetchAllSession();
    fetchAllBudgetYear();
  }, []);

  const fetchAllSession = async () => {
    try {
      const response = await getAllSession(tenantId);
      const data = response.data;
      setSession(data);
    } catch (error) {
      console.error("Error fetching session:", error.message);
    }
  };

  const fetchAllBudgetYear = async () => {
    try {
      const response = await getAllbudgetYears(tenantId);
      setBudgetYear(response.data);
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to fetch the budget year. Please try again.",
        severity: "error",
      });
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      // Format dates to ISO 8601 format if necessary
      const formattedValues = {
        ...values,
        startDate: new Date(values.startDate).toISOString(), // Adjust as needed
        endDate: new Date(values.endDate).toISOString(),     // Adjust as needed
      };

      const sessionNameExists = session.some(
        (session) =>
          session.budgetYearId === formattedValues.budgetYearId &&
          session.term === formattedValues.term
      );

      if (sessionNameExists) {
        setNotification({
          open: true,
          message:
            "Session term with budget year is already created. Please use a different one.",
          severity: "warning",
        });
        return;
      }

      await createSession(tenantId, formattedValues);
      setNotification({
        open: true,
        message: "Session created successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to create session. Please try again.",
        severity: "error",
      });
    }
  };

  const initialValues = {
    budgetYearId: "",
    term: "",
    startDate: "",
    endDate: "",
    remark: "",
  };

  const checkoutSchema = yup.object().shape({
    budgetYearId: yup.string().required("Budget year is required"),
    term: yup.string().required("Term is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create Session" />
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
                error={!!touched.budgetYearId && !!errors.budgetYearId}
              >
                <InputLabel id="budgetYear-label">Select Budget Year</InputLabel>
                <Select
                  labelId="budgetYear-label"
                  value={values.budgetYearId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="budgetYearId"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select Budget Year</em>
                  </MenuItem>
                  {budgetYear.map((budget) => (
                    <MenuItem key={budget.id} value={budget.id}>
                      {budget.budgetYear}
                    </MenuItem>
                  ))}
                </Select>
                {touched.budgetYearId && errors.budgetYearId && (
                  <FormHelperText>{errors.budgetYearId}</FormHelperText>
                )}
              </FormControl>

              <FormControl sx={{ gridColumn: "span 2" }}>
                <Select
                  label="Term"
                  value={values.term}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "term" }}
                  name="term"
                  error={!!touched.term && !!errors.term}
                  sx={{ gridColumn: "span 1" }}
                >
                  <MenuItem value="">
                    <em>Please Select Term</em>
                  </MenuItem>
                  <MenuItem value="FIRST_TERM">First Term</MenuItem>
                  <MenuItem value="SECOND_TERM">Second Term</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="date"
                label="Start Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.startDate}
                name="startDate"
                error={!!touched.startDate && !!errors.startDate}
                helperText={touched.startDate && errors.startDate}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{
                  shrink: true, // Ensures the label doesn't overlap
                }}
              />

              <TextField
                fullWidth
                type="date"
                label="End Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.endDate}
                name="endDate"
                error={!!touched.endDate && !!errors.endDate}
                helperText={touched.endDate && errors.endDate}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{
                  shrink: true, // Ensures the label doesn't overlap
                }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Remark"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.remark}
                name="remark"
                error={!!touched.remark && !!errors.remark}
                helperText={touched.remark && errors.remark}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Session
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
      <ListSession refreshKey={refreshKey} />
    </Box>
  );
};

export default CreateSession;