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
  getAllPayrollGroup,
  getPayrollGroupById,
  updatePayrollGroup,
} from "../../../Api/payrollApi";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const UpdatePayrollGroup = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const location = useLocation();
  const { id } = location.state || {};
    const navigate = useNavigate();
  

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const [payrollGroups, setPayrollGroups] = useState([]);

  const [payrollGroup, setPayrollGroup] = useState({
     groupName: "",
    status: "",
    payrollFrom: "",
    payrollTo: "",
    endDateValid: "", // Default to empty
  });

  useEffect(() => {
    fetchAllPayrollGroup();
    fetchPayrollGroupById();
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

  const fetchPayrollGroupById = async () => {
    try {
      const response = await getPayrollGroupById(id);
      setPayrollGroup(response.data);
    } catch (error) {
      // setError(error.message);
      console.error(error.message);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const payrollGroupExists = payrollGroups.some(
        (payroll) => payroll.groupName === values.groupName && payroll.id !== id
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

      await updatePayrollGroup(id, values);
      setNotification({
        open: true,
        message: "Payroll group update successfully!",
        severity: "success",
      });
      resetForm(); 
      setRefreshKey((prev) => prev + 1);
      navigate('/payroll/create_payroll_group'); 
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to update payroll group. Please try again.",
        severity: "error",
      });
    }
  };

  const checkoutSchema = yup.object().shape({
    groupName: yup.string().required("Group name is required"),
    status: yup.string().required("Status is required"),
    payrollFrom: yup.string().required("payrollFrom is required"),
    payrollTo: yup.string().required("payrollFrom is required"),
    endDateValid: yup
      .string()
      .required("Please select a valid end date option"), // Make required
  });

  return (
    <Box m="20px">
      <Header subtitle="Update Payroll Group" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={payrollGroup}
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
                error={!!touched.endDateValid && !!errors.endDateValid}
                sx={{ gridColumn: "span 2" }}
              >
                <label>Is End Date Valid?</label>
                <RadioGroup
                  name="endDateValid"
                  value={values.endDateValid}
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
                {touched.endDateValid && errors.endDateValid && (
                  <div style={{ color: "red" }}>{errors.endDateValid}</div>
                )}
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update Payroll Group
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

export default UpdatePayrollGroup;
