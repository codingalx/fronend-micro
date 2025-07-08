import { useEffect, useState } from "react";
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
  Autocomplete,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import Header from "../common/Header";
import {
  createEmployeeEarningDeduction,
  getAllDeductionSetUp,
  getAllEmployeeEarningDeductionsById,
  getAllPayrollPeriod,
  getEmployeeById,
  getEmployeeEarningDeductionsById,
  listEmployee,
  updateAllEmployeeEarningDeduction,
  updateEmployeeEarningDeduction,
} from "../../../Api/payrollApi";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import { useLocation,useNavigate } from "react-router-dom";

const UpdateAllEmployeeEarningDeduction = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom); // Access the shared authentication state
  const tenantId = authState.tenantId;
      const location = useLocation();
    const navigate = useNavigate();
      const { id } = location.state || {};

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [payrollPeriod, setpayrollPeriod] = useState([]);
  const [earningDeduction, setEarningDeduction] = useState([]);
    const [employeeEarningDeduction, setEmployeeEarningDeduction] = useState({
       earningDeductionId: "",
    payrollPeriodId: "",
    appliedFrom: "",
    type: "",
    paymentIn: "",
    numberOfMonth: "",
    monthlyAmount: "",
    status: "",
    remark: "",
    

    });




  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };


const handleFormSubmit = async (values, { resetForm }) => {
  try {
    // Ensure id and employeeId are defined and accessible
    await updateAllEmployeeEarningDeduction(id,values);

    // Set success notification
    setNotification({
      open: true,
      message: "Employee earning deduction updated successfully!",
      severity: "success",
    });

    // Reset the form after successful submission
    resetForm();

    // Redirect to the create employee earning deduction page
    navigate('/payroll/create_Allemployee_earning_deduction'); 
  } catch (error) {
    // Log the error for debugging
    console.error("Failed to submit employee earning deduction form data:", error);

    // Set error notification
    setNotification({
      open: true,
      message: "Failed to create employee earning deduction. Please try again.",
      severity: "error",
    });
  }
};

 

  useEffect(() => {
    fetchAllpayLocationAndGroup();
    fetchAllEarningDeduction();
    fetchEarningEmployeeDeduction();
  }, []);


  const fetchAllpayLocationAndGroup = async () => {
    try {
      const response = await getAllPayrollPeriod();
      const data = response.data;
      setpayrollPeriod(data);
    } catch (error) {
      console.error("Error fetching fetch payroll period:", error.message);
    }
  };

  const fetchAllEarningDeduction = async () => {
    try {
      const response = await getAllDeductionSetUp();
      const data = response.data;
      setEarningDeduction(data);
    } catch (error) {
      console.error("Error fetching all deduction set up:", error.message);
    }
  };
  
   const fetchEarningEmployeeDeduction = async () => {
    try {
      const response = await getAllEmployeeEarningDeductionsById(id);
      const data = response.data;

      setEmployeeEarningDeduction(data);

  
    } catch (error) {
      console.error("Error fetching earning employee deduction:", error.message);
    }
  };



  const checkoutSchema = yup.object().shape({
    earningDeductionId: yup
      .string()
      .required("Earning Deduction ID is required"),
    payrollPeriodId: yup.string().required("payrollPeriodId is required"),
    appliedFrom: yup.string().required("appliedFrom is required"),

    type: yup.string().required("Type is required"),
    paymentIn: yup.string().required("Applied From is required"),
    numberOfMonth: yup
      .number()
      .required("Number of Months is required")
      .min(1, "Number of Months must be at least 1"),
    monthlyAmount: yup
      .number()
      .required("Monthly Amount is required")
      .min(0, "Monthly Amount must be a positive number"),

    status: yup.string().required("Status is required"),
    remark: yup.string().optional(),
  });

  return (
    <Box m="20px">
      <Header subtitle="Update  all Employee Earning Deduction" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={employeeEarningDeduction}
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
                error={
                  !!touched.payrollPeriodId &&
                  !!errors.payrollPeriodId
                }
              >
                <InputLabel id="inter-label">Select payroll period</InputLabel>
                <Select
                  labelId="payrollPeriodId-label"
                  value={values.payrollPeriodId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="payrollPeriodId"
                  fullWidth
                   sx={{ gridColumn: "span 2" }}
                >
                  <MenuItem value="">
                    <em>Select payroll period</em>
                  </MenuItem>
                  {payrollPeriod.map((Period) => (
                    <MenuItem key={Period.id} value={Period.id}>
                      {Period.month}
                    </MenuItem>
                  ))}
                </Select>

                {touched.payrollPeriodId &&
                  errors.payrollPeriodId && (
                    <FormHelperText>
                      {errors.payrollPeriodId}
                    </FormHelperText>
                  )}
              </FormControl>

              <FormControl
                sx={{
                  flexGrow: 1,
                  flexShrink: 1,
                  minWidth: 0,
                  gridColumn: "span 2",
                }}
                error={
                  !!touched.earningDeductionId && !!errors.earningDeductionId
                }
              >
                <InputLabel id="inter-label">
                  Select earing Deduction
                </InputLabel>
                <Select
                  labelId="earningDeductionId-label"
                  value={values.earningDeductionId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="earningDeductionId"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select earning deduction</em>
                  </MenuItem>
                  {earningDeduction.map((earningDeductions) => (
                    <MenuItem
                      key={earningDeductions.id}
                      value={earningDeductions.id}
                    >
                      {earningDeductions.itemCode}
                    </MenuItem>
                  ))}
                </Select>

                {touched.earningDeductionId && errors.earningDeductionId && (
                  <FormHelperText>{errors.earningDeductionId}</FormHelperText>
                )}
              </FormControl>

              

              <TextField
                fullWidth
                type="number"
                label="numberOfMonth"
                onBlur={handleBlur}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange({
                    target: {
                      name: "numberOfMonth",
                      value: value ? parseInt(value, 10) : "", // Convert to integer or set to empty
                    },
                  });
                }}
                value={values.numberOfMonth}
                name="numberOfMonth"
                error={!!touched.numberOfMonth && !!errors.numberOfMonth}
                helperText={touched.numberOfMonth && errors.numberOfMonth}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />
                <FormControl fullWidth sx={{ gridColumn: "span 2", mb: 2 }}>
                <InputLabel id="paymentIn-label">Payment In</InputLabel>
                <Select
                  labelId="paymentIn-label"
                  value={values.paymentIn}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "paymentIn" }}
                  name="paymentIn" // Corrected name
                  error={!!touched.paymentIn && !!errors.paymentIn} // Corrected error handling
                  sx={{
                    flexGrow: 1,
                    flexShrink: 1,
                    minWidth: 0,
                    gridColumn: "span 2",
                  }}
                >
                  <MenuItem value=""></MenuItem>
                  <MenuItem value="BIRR">Bir</MenuItem>
                 
                </Select>
                {touched.paymentIn && errors.paymentIn && (
                  <FormHelperText error>{errors.paymentIn}</FormHelperText>
                )}
              </FormControl>

                <FormControl fullWidth sx={{ gridColumn: "span 2", mb: 2 }}>
                <InputLabel id="type-label">type</InputLabel>
                <Select
                  labelId="type-label"
                  value={values.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": " type" }}
                  name="type" // Corrected name
                  error={!!touched.type && !!errors.type} // Corrected error handling
                  sx={{
                    flexGrow: 1,
                    flexShrink: 1,
                    minWidth: 0,
                    gridColumn: "span 2",
                  }}
                >
                  <MenuItem value=""></MenuItem>  
                  <MenuItem value="EARNING">Earning</MenuItem>
                  <MenuItem value="DEDUCTION">Deduction</MenuItem>
                </Select>
                {touched.type && errors.type && (
                  <FormHelperText error>{errors.type}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ gridColumn: "span 2", mb: 2 }}>
                <InputLabel id="status-label">status</InputLabel>
                <Select
                  labelId="status-label"
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": " status" }}
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
                  <MenuItem value="INACTIVE">InActive</MenuItem>
                  <MenuItem value="ACTIVE">active</MenuItem>
                </Select>
                {touched.status && errors.status && (
                  <FormHelperText error>{errors.status}</FormHelperText>
                )}
              </FormControl>

              <TextField
                fullWidth
                type="number"
                label="monthlyAmount"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.monthlyAmount}
                name="monthlyAmount"
                error={!!touched.monthlyAmount && !!errors.monthlyAmount}
                helperText={touched.monthlyAmount && errors.monthlyAmount}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />

               <TextField
                fullWidth
                type="date"
                label="appliedFrom"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.appliedFrom}
                name="appliedFrom"
                error={!!touched.appliedFrom && !!errors.appliedFrom}
                helperText={touched.appliedFrom && errors.appliedFrom}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />
              
              

              

             
             

            

             

               <TextField
                fullWidth
                type="text"
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
                Update EmployeeEarningDeduction
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

export default UpdateAllEmployeeEarningDeduction;
