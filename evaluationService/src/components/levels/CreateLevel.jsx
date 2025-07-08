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
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import Header from "../common/Header";
import ListLevel from "./ListLevel";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import { createLevel, getAllLevel } from "../../../configuration/EvaluationApi";

const CreateLevel = () => {
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
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    fetchAllLevel();
  }, []);

  const fetchAllLevel = async () => {
    try {
      const response = await getAllLevel(tenantId);
      setLevels(response.data);
    } catch (error) {
      console.error("Error fetching levels:", error.message);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    console.log("Form submitted with values:", values); // Debugging line
    try {
      // Ensure all required fields are filled
      const levelExists = levels.some((level) => level.level === values.level);

      if (levelExists) {
        setNotification({
          open: true,
          message: "Level name already exists. Please use a different one.",
          severity: "warning",
        });
        return;
      }

      // Log the payload before sending
      console.log("Payload to be sent:", values);

      // Make API call
      await createLevel(tenantId, values);
      setNotification({
        open: true,
        message: "Level name created successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to submit form data:", error.response?.data || error.message);
      setNotification({
        open: true,
        message: "Failed to create level name. Please try again.",
        severity: "error",
      });
    }
  };

  const initialValues = {
    level: "",
    minPoint: "",
    maxValue: "",
    status: "",
    description: "",
  };

  const checkoutSchema = yup.object().shape({
    level: yup.string().required("Name is required"),
    status: yup.string().required("Please choose a status"),
    minPoint: yup
      .number()
      .min(0, "Min point score cannot be negative")
      .max(100, "Min point score cannot exceed 100")
      .required("Min point score is required"),
      maxValue: yup
      .number()
      .min(0, "Max point score cannot be negative")
      .max(100, "Max point score cannot exceed 100")
      .required("Max point score is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create Level" />
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
              <FormControl sx={{ gridColumn: "span 2" }}>
                <Select
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "status" }}
                  name="status"
                  error={!!touched.status && !!errors.status}
                >
                  <MenuItem value="">
                    <em>Please Select Status</em>
                  </MenuItem>
                  <MenuItem value="ACTION_TAKER">Action Taker</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="text"
                label="Level"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.level}
                name="level"
                error={!!touched.level && !!errors.level}
                helperText={touched.level && errors.level}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="number"
                label="Min Point"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.minPoint}
                name="minPoint"
                error={!!touched.minPoint && !!errors.minPoint}
                helperText={touched.minPoint && errors.minPoint}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="number"
                label="Max Value"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.maxValue}
                name="maxValue"
                error={!!touched.maxValue && !!errors.maxValue}
                helperText={touched.maxValue && errors.maxValue}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Level
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
      <ListLevel refreshKey={refreshKey} />
    </Box>
  );
};

export default CreateLevel;