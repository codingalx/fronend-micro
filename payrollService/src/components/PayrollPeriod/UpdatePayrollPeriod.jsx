import React,{ useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  MenuItem,
  FormHelperText,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import Header from "../common/Header";
import {
  getAllPayrollPeriod,
  getPayrollPeriodById,
  updatePayrollPeriod,
} from "../../../Api/payrollApi";
import { useLocation, useNavigate } from "react-router-dom";


const UpdatePayrollPeriod = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
   const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {};

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
 

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [payroll, setPayroll] = useState(0);

  const [payrollPeriod, setPayrollPeriod] = useState({
    isOrdered: "",
    month: "",
    status: "",
  });

  useEffect(() => {
    fetchAllPayRollPeriod();
    fetchPayRollPeriod();
  }, []);

  const fetchAllPayRollPeriod = async () => {
    try {
      const response = await getAllPayrollPeriod();
      const data = response.data;
      setPayroll(data);
    } catch (error) {
      console.error("Error fetching fetch all payroll period:", error.message);
    }
  };

  const fetchPayRollPeriod = async () => {
    try {
      const response = await getPayrollPeriodById(id);
      const data = response.data;
      setPayrollPeriod(data);
    } catch (error) {
      console.error("Error fetching fetch  payroll period:", error.message);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const pensionmonthExists = payroll.some(
        (payrollPeriod) =>
          payrollPeriod.month === values.month && payrollPeriod.id !== id
      );

      if (pensionmonthExists) {
        setNotification({
          open: true,
          message:
            " payroll period already exists. Please use a different one.",
          severity: "warning",
        });
        return;
      }

      await updatePayrollPeriod(id, values);
      setNotification({
        open: true,
        message: "payroll period update successfully!",
        severity: "success",
      });
      resetForm();

      navigate("/payroll/create_payroll_period");
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to update payroll period . Please try again.",
        severity: "error",
      });
    }
  };

  const checkoutSchema = yup.object().shape({
    isOrdered: yup.string().required("isOrdered is required"),
    month: yup.string().required("month is required"),
    status: yup.string().required("month is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Update Payroll Period" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={payrollPeriod}
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
                label="month"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.month}
                name="month"
                error={!!touched.month && !!errors.month}
                helperText={touched.month && errors.month}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />

              <FormControl fullWidth sx={{ gridColumn: "span 2", mb: 2 }}>
                <InputLabel id="Payrollperiod-isOrdered-label">
                  isOrdered
                </InputLabel>
                <Select
                  labelId="Payrollperiod -isOrdered-label"
                  value={values.isOrdered}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "delivery isOrdered" }}
                  name="isOrdered" // Corrected name
                  error={!!touched.isOrdered && !!errors.isOrdered} // Corrected error handling
                  sx={{
                    flexGrow: 1,
                    flexShrink: 1,
                    minWidth: 0,
                    gridColumn: "span 2",
                  }}
                >
                  <MenuItem value=""></MenuItem>
                  <MenuItem value="YES">Yes</MenuItem>
                  <MenuItem value="NO">No</MenuItem>
                </Select>
                {touched.isOrdered && errors.isOrdered && (
                  <FormHelperText error>{errors.isOrdered}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ gridColumn: "span 2", mb: 2 }}>
                <InputLabel id="Payrollperiod-status-label">Status</InputLabel>
                <Select
                  labelId="Payrollperiod -status-label"
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "delivery status" }}
                  name="status" // Corrected name
                  error={!!touched.status && !!errors.status} // Corrected error handling
                  sx={{
                    flexGrow: 1,
                    flexShrink: 1,
                    minWidth: 0,
                    gridColumn: "span 2",
                  }}
                >
                  <MenuItem value=""></MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="INACTIVE">InActive</MenuItem>
                  <MenuItem value="CLOSED ">Closed</MenuItem>
                </Select>
                {touched.status && errors.status && (
                  <FormHelperText error>{errors.status}</FormHelperText>
                )}
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create PayrollPeriod
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

export default UpdatePayrollPeriod;
