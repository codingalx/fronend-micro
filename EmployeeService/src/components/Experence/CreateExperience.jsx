import React, { useState } from "react";
import { Alert, Box, Button, TextField, Snackbar,FormControl,
  MenuItem,
  Select,
  InputLabel,

 } from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { createExperience } from "../../Api/employeeApi";
import ListExperence from "./ListExperence";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import NotFoundHandle from "../common/NotFoundHandle";

const CreateExperience = ({ id }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const employerId = id
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      formData.append(
        "experience",
        new Blob([JSON.stringify(values)], { type: "application/json" })
      );
      formData.append("document", values.document);

      const response = await createExperience(tenantId, id, formData);

      if (response.status === 201) {
        setNotification({
          open: true,
          message: "Experience created successfully!",
          severity: "success",
        });
        resetForm();
        setRefreshKey((prev) => prev + 1);
      } else {
        console.error("Error adding experience. Status code:", response.status);
      }
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to create experience. Please try again.",
        severity: "error",
      });
      console.error(
        "An error occurred while adding the experience:",
        error.message
      );
    }
  };

  const checkoutSchema = yup.object().shape({
    institution: yup
      .string()
      .required("Institution name cannot be blank")
      .trim(),
    employmentType: yup
      .string()
      .required("Employment type cannot be null")
      .trim(),
    jobTitle: yup.string().required("Job title cannot be blank").trim(),
    salary: yup
      .number()
      .required("Salary cannot be blank")
      .positive("Salary must be a positive number"),
    startDate: yup
      .date()
      .required("Start Date is required")
      .max(new Date(), "Start date must be in the past or present"),
    endDate: yup
      .date()
      .required("End Date is required")
      .max(new Date(), "End date must be in the past or present"),
    responsibility: yup
      .string()
      .required("Responsibility description cannot be blank")
      .trim(),
    reasonForTermination: yup.string().nullable(),
    document: yup.mixed().required("Document is required"),
  });

  const initialValues = {
    institution: "",
    employmentType: "",
    jobTitle: "",
    salary: "",
    startDate: null,
    endDate: null,
    responsibility: "",
    reasonForTermination: "",
    document: null,
  };

  if (!id) {
    return (
      <NotFoundHandle
        message="No employee selected for experience creation."
        navigateTo="/employee/list"
      />
    );
  }

  return (
    <Box m="20px">
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
                label="Institution"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.institution}
                name="institution"
                error={!!touched.institution && !!errors.institution}
                helperText={touched.institution && errors.institution}
                sx={{ gridColumn: "span 2" }}
              />

              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel>Employment Type</InputLabel>
                <Select
                  value={values.employmentType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="employmentType"
                  error={!!touched.employmentType && !!errors.employmentType}
                >
                  <MenuItem value="">
                    <em>Please Select Employment Type</em>
                  </MenuItem>
                  <MenuItem value="PERMANENT">Permanent</MenuItem>
                  <MenuItem value="CONTRACT">Contract</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="text"
                label="Job Title"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.jobTitle}
                name="jobTitle"
                error={!!touched.jobTitle && !!errors.jobTitle}
                helperText={touched.jobTitle && errors.jobTitle}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="number"
                label="Salary"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.salary}
                name="salary"
                error={!!touched.salary && !!errors.salary}
                helperText={touched.salary && errors.salary}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.startDate}
                name="startDate"
                error={!!touched.startDate && !!errors.startDate}
                helperText={touched.startDate && errors.startDate}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="date"
                label="End Date"
                InputLabelProps={{ shrink: true }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.endDate}
                name="endDate"
                error={!!touched.endDate && !!errors.endDate}
                helperText={touched.endDate && errors.endDate}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Responsibility"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.responsibility}
                name="responsibility"
                error={!!touched.responsibility && !!errors.responsibility}
                helperText={touched.responsibility && errors.responsibility}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Reason for Termination"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.reasonForTermination}
                name="reasonForTermination"
                error={
                  !!touched.reasonForTermination &&
                  !!errors.reasonForTermination
                }
                helperText={
                  touched.reasonForTermination && errors.reasonForTermination
                }
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                type="file"
                fullWidth
                name="document"
                onChange={(e) => {
                  setFieldValue("document", e.target.files[0]);
                }}
                onBlur={handleBlur}
                error={!!touched.document && !!errors.document}
                helperText={touched.document && errors.document}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Experience
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

      <ListExperence employerId={employerId} refreshKey={refreshKey} />
    </Box>
  );
};

export default CreateExperience;
