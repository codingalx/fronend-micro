import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import Header from "../common/Header";
import {
  createPayrollGroup,
  getAllPayrollGroup,
} from "../../../Api/payrollApi";
import GetAllPayRollGroup from "./GetAllPayRollGroup";

const CreatePayrollGroup = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const generateSignInUrl = () => {
  const params = new URLSearchParams({
    client_id: 'crXYIYg2cJiNTaw5t-peoPzCRo-3JATNfBd5A86U8t0',
    redirect_uri: 'http://localhost:3000/callback',
    response_type: "code",
    scope: "openid profile email",
    acr_values: "mosip:idp:acr:generated-code mosip:idp:acr:linked-wallet mosip:idp:acr:biometrics",
    claims: JSON.stringify({
      userinfo: {
        name: { essential: true },
        phone: { essential: true },
        email: { essential: true },
        picture: { essential: true },
        gender: { essential: true },
        birthdate: { essential: true },
        address: { essential: true }
      },
      id_token: {}
    }),
    code_challenge: "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
    code_challenge_method: "S256",
    display: "page",
    nonce: "g4DEuje5Fx57Vb64dO4oqLHXGT8L8G7g",
    state: "ptOO76SD",
    ui_locales: "en",
  });

  return `ewogICJrdHkiOiAiUlNBIiwKICAidXNlIjogInNpZyIsCiAgImtleV9vcHMiOiBbCiAgICAic2lnbiIKICBdLAogICJhbGciOiAiUlMyNTYiLAogICJraWQiOiAiMGIxOTRkZjQtNzE0OS00MTQ2LTk3YzUtNzhmZGYwZDRmYjFkIiwKICAiZCI6ICJhcFhneVlZSno3RUdZdGQ4bVF6dXgxMl90d2RfdHdUY1pwSzJnRzhUd29MYlVkX0dmc3J2VXlUYzYyUk1EdU43d0RIbHFyWWVQTHBtS25LWDJKYjE5U1hFa1Nvanp0c3dSOF9EdVYwTE9QZkpQb3JPVTd3MFdLMHJjX3pXM3VURTJ3Ti01Nm5DQnhLcE41ZnZSWDRyYkhsazlFSTZFNTRtS1VWUzl6T3pQdGRiTjc3OEY2U3haMl9kc2FTQUhKMzZqWlpRUFRUdmZRb0Z5UzlzSTJOVDlkbGpvVm1PMk1xVEZ2ZG5VY0RQWng4ajFIQzFmWWNFU2NsV2VURFNpRWFuX293RE9UVjdPLXFCb2h3N0pGd2tScTNVeC1oSjFKMHdlaEJsbGZVVnB3cjI1aElxNXBKUlF4cnZucVU3SHdqU2xuSmpfQjFLSFdCdk9WOUdyUUZfWFEiLAogICJuIjogIjRPd0s1SEk2QVFtS3ZkeGt5S29xX1d1UFcyVl9vcWtaNkVjSDZSQjd5bVJ3cDhteXFRVFR4LVlfejcwZ3Z6d1o1YUNyQ0JqVi10WThXckk1cDBENjg3aEFEbDEtQ2ttTHFHQjVCR016bXd3c0wzYS1lZlhOMVBXSFBhR3FYR0IxUDBueGl3TVJaMTZKcHhOSWtqWGdOajcyd0tob2VKVEFpVUpGbWE5RFdyQ2FxMlJ1ZWVDWWVKNnBqVmdYcEpWNUtOMzFFQUhoRHZMUDZEbk4zd3h6NnlOcTBBNjBQeFRLcmpHdzhUYzlqN18tT3pwSUV1Y3A2T3p0ZEg0c2o0QURSRWtBUWtYNktZV0c1SE9nWldyUWpaemF1MDlPOEVsa2hPZDFNdE9zVEZiRmdyTXBkamR1OFdoSGprVlp6Yk5hd0IwNFBra3Q2VkYtNU5EMktGWWx6dyIsCiAgImUiOiAiQVFBQiIsCiAgInAiOiAiLVB3R01xTzU1TjNwcmFGTjhrNmdmSEhEajBpRllQS3BvNVpBN1JqNEpZQmpybmlEcXJnN1ItaE53NlhFM2tXQ1hJNjZXLXI2aVFrb196SE9uU3IyZW0wTjU2Rm9zY3ZXMFhhSG5CbkRkQXVHUm9LUDQzcW16OG5zeDJTWjlKZmZNN0o1QjFvODk1RmhUTHA4ZXFLTkVlS3BpV3Y2bGR4M0txSFZnOGZqN0cwIiwKICAicSI6ICI1MEp6ZldBNlhueFJHQVN6Z21jaGI3V1JINTlmenhWSmt3ajNTZF9EMFlJOEVNLUFwanlIOG1tTU5fZVZ5cEhTcmJFSFo5cHJTTVVjUmZxRC1TUlNpT1NFd1BoVmJ3Zmc3X0VQeE5YeDVkOGxxZ0dOUUNyNVBEWGRCd2lYMEt3TXlpcXBNMEM2YWtYX2lfMmRmWlRFb2VkMmx0RlhIcFp1MDZKOGNBZC1mYXMiLAogICJkcCI6ICJ4SGNSYU9uNmFGYVc2bFFLem5VdWU2UEZIUTJyZVZsaGRGeS1kSmdzVG1NbHhPa0JkRGVWUjJOTjRXQ3ZuSGdhcW5CUkt2Q2Fxb0VZNFcxcXpHZTNQOWxIakl1M3NmdlhVVWNITUt5X3BwVGxha1BoeUN6aTdiazI1Z3RDMUZiMlg3T25mcDY4MXRqWGZ4VHoza3pmcGNwRjN0TGVVMXc0aC1KVk9Yd0VKRzAiLAogICJkcSI6ICJpX3lPbWt0QXFlZEkwMmd0SFhlLUpyZmF4RENlTjJWa1p3dmJYUzJGaEhINFdCaXpnRzFOd2JDZ2YxUndxUEdDZlQtWEF3ZVZQN1NKZTlhOFFuajVPUUpUVmRnOUp2dTI3cWVXYXdreTUzb2ZlM3g2LTJmSF9PbUNCUHJ2b3hJeW44SVpMX3d6bTVjSnJMejFzNG4xU1NncWdmcndhSVNaUzZTa19NLWNnd2MiLAogICJxaSI6ICJVbjZwWVZDMTZJZk5FLVlhaUtjNmZFRTZkZnZZWm4xOWdOb2JERmI2VFcxV1A0T0xac3IzdlVYREptajNfYm0yR19QOVNGbGdzNWZ6UUpLUDd5RTdDTjNlWmxmaHMzUE8tc3NWbDZrSGg1dTVtLWp2Q0R1OGo1dFl5c3FvRXFIV3RqMUI1VGNzSGxvOWkwTFl5dThkT3ViV1cxa0pmSWtteXFyb3pSa0NhZEkiCn0=?${params.toString()}`;
};


  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const [payrollGroups, setPayrollGroups] = useState([]);

  useEffect(() => {
    fetchAllPayrollGroup();
  }, []);

  const fetchAllPayrollGroup = async () => {
    try {
      const response = await getAllPayrollGroup();
      const data = response.data;
      setPayrollGroups(data);
    } catch (error) {
      console.error("Error fetching payroll groups:", error.message);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const payrollGroupExists = payrollGroups.some(
        (payroll) => payroll.groupName === values.groupName
      );

      if (payrollGroupExists) {
        setNotification({
          open: true,
          message:
            "Payroll group name already exists. Please use a different one.",
          severity: "warning",
        });
        return;
      }

      await createPayrollGroup(values);
      setNotification({
        open: true,
        message: "Payroll group created successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to create payroll group. Please try again.",
        severity: "error",
      });
    }
  };


 
  const initialValues = {
    groupName: "",
    status: "",
    payrollFrom: "",
    payrollTo: "",
    payrollToValid: "", // Default to empty
  };
const checkoutSchema = yup.object().shape({
  groupName: yup.string().required("Group name is required"),
  status: yup.string().required("Status is required"),
  payrollFrom: yup.string().required("Payroll From is required"),
  payrollTo: yup.string()
    .required("Payroll To is required")
    .test("is-after", "Payroll To must be after Payroll From", function (value) {
      const { payrollFrom } = this.parent; // Access the parent context
      return new Date(value) > new Date(payrollFrom); // Compare dates
    }),
  payrollToValid: yup.string().required("Please select a valid end date option"),
});

  return (
    <Box m="20px">
      <Header subtitle="Create Payroll Group" />
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
              <FormControl fullWidth sx={{ gridColumn: "span 2", mb: 2 }}>
                <InputLabel id="status-label">status</InputLabel>
                <Select
                  labelId="status-label"
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "status" }}
                  name="status"
                  error={!!touched.status && !!errors.status}
                  sx={{
                    flexGrow: 1,
                    flexShrink: 1,
                    minWidth: 0,
                    gridColumn: "span 2",
                  }}
                >
                  <MenuItem value=""></MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                </Select>
                {touched.status && errors.status && (
                  <FormHelperText error>{errors.status}</FormHelperText>
                )}
              </FormControl>

             <TextField
  fullWidth
  type="date"
  label=" Payroll Start Date"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.payrollFrom}
  name="payrollFrom"
  error={!!touched.payrollFrom && !!errors.payrollFrom}
  helperText={touched.payrollFrom && errors.payrollFrom}
  sx={{ gridColumn: "span 2" }}
  InputLabelProps={{
    shrink: true, // Ensures the label is always floating
  }}
/>

              <TextField
                fullWidth
                type="date"
                label=" Payroll End Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.payrollTo}
                name="payrollTo"
                error={!!touched.payrollTo && !!errors.payrollTo}
                helperText={touched.payrollTo && errors.payrollTo}
                sx={{ gridColumn: "span 2" }}
                 InputLabelProps={{
    shrink: true, // Ensures the label is always floating
  }}
              />


              <a href={generateSignInUrl()} >
          Sign in with Fayda E-Signet
        </a>

              <TextField
                fullWidth
                label="Group Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.groupName}
                name="groupName"
                error={!!touched.groupName && !!errors.groupName}
                helperText={touched.groupName && errors.groupName}
                sx={{ gridColumn: "span 2" }}
              />

              <FormControl
                component="fieldset"
                error={!!touched.payrollToValid && !!errors.payrollToValid}
                sx={{ gridColumn: "span 2" }}
              >
                <label>Is End Date Valid?</label>
                <RadioGroup
                  name="payrollToValid"
                  value={values.payrollToValid}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="True"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="False"
                  />
                </RadioGroup>
                {touched.payrollToValid && errors.payrollToValid && (
                  <div style={{ color: "red" }}>{errors.payrollToValid}</div>
                )}
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Payroll Group
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
      <GetAllPayRollGroup refreshKey={refreshKey} />
    </Box>
  );
};

export default CreatePayrollGroup;
