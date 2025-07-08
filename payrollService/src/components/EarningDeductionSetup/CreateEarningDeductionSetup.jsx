import { useState } from "react";
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
import { createDeductionSetUp, getAllDeductionSetUp } from "../../../Api/payrollApi";
import GetAllEarningDeductionSetup from "./GetAllEarningDeductionSetup";
import { useEffect } from "react";

const CreateEarningDeductionSetup = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [refreshKey, setRefreshKey] = useState(0);
    const [allDeductionSetUp, setAllDeductionSetUp] = useState([]);




 
 

const handleFormSubmit = async (values, { resetForm }) => {
  try {
    
     const allDeductionSetUpItemCodeExists = allDeductionSetUp.some(
    (allDeductionSet) => allDeductionSet.itemCode === values.itemCode
);

    if (allDeductionSetUpItemCodeExists) {
      setNotification({
          open: true,
          message: " item Code  already exists. Please use a different one.",
          severity: "warning",
      });
      return;
  }
    // Attempt to create employee earning deduction
    await createDeductionSetUp(values);
    
    // Set success notification
    setNotification({
      open: true,
      message: "Earning deduction created  successfully!",
      severity: "success",
    });
    
    // Reset the form after successful submission
    resetForm();
    
    // Refresh data, if needed
    setRefreshKey((prev) => prev + 1);
  } catch (error) {
    // Log the error for debugging
    console.error("Failed to submit Earning deduction created form data:", error);
    
    // Set error notification
    setNotification({
      open: true,
      message: "Failed to create Earning deduction created. Please try again.",
      severity: "error",
    });
  }
};
  useEffect(() => {
    fetchAllEarningDeductionSetUp();
  
  }, []);


  const fetchAllEarningDeductionSetUp = async () => {
    try {
      const response = await getAllDeductionSetUp();
      const data = response.data;
      setAllDeductionSetUp(data);
    } catch (error) {
      console.error("Error fetching all deduction set up:", error.message);
    }
  };

 

  const initialValues = {
    generalLodgerId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    counterLodgerId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    mapEarningDeductionId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    itemCode: "",
    type: "",
    deductionOrder: "",
    debitOrCredit: "",
    counterDebitOrCredit: "",
    systemOrCostCenter: "",
    taxable: "",
    forcedDeduction: "",
    firstDeductionFromSalary: "",
  };

  const checkoutSchema = yup.object().shape({
    generalLodgerId: yup.string().required("generalLodger is required"),
    counterLodgerId: yup.string().required("counterLodger is required"),
    mapEarningDeductionId: yup
      .string()
      .required("mapEarningDeduction is required"),
    itemCode: yup.string().required("itemCode is required"),
    type: yup.string().required("type is required"),
    deductionOrder: yup.string().required("deductionOrder is required"),
    debitOrCredit: yup.string().required("debitOrCredit is required"),
    counterDebitOrCredit: yup
      .string()
      .required("counterDebitOrCredit is required"),
    systemOrCostCenter: yup.string().required("systemOrCostCenter is required"),
    taxable: yup.string().required("taxable is required"),
    forcedDeduction: yup.string().required("forcedDeduction is required"),
    firstDeductionFromSalary: yup
      .string()
      .required("firstDeductionFromSalary is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create Pay Location and Group" />
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
               <TextField
                fullWidth
                type="text"
                label="mapEarningDeductionId"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.mapEarningDeductionId}
                name="mapEarningDeductionId"
                error={!!touched.mapEarningDeductionId && !!errors.mapEarningDeductionId}
                helperText={touched.mapEarningDeductionId && errors.mapEarningDeductionId}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />

               <TextField
                fullWidth
                type="text"
                label="counterLodger"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.counterLodgerId}
                name="counterLodgerId"
                error={!!touched.counterLodgerId && !!errors.counterLodgerId}
                helperText={touched.counterLodgerId && errors.counterLodgerId}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />
                 <TextField
                fullWidth
                type="text"
                label="generalLodger"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.generalLodgerId}
                name="generalLodgerId"
                error={!!touched.generalLodgerId && !!errors.generalLodgerId}
                helperText={touched.generalLodgerId && errors.generalLodgerId}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="text"
                label="itemCode"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.itemCode}
                name="itemCode"
                error={!!touched.itemCode && !!errors.itemCode}
                helperText={touched.itemCode && errors.itemCode}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />
              

              <TextField
                fullWidth
                type="text"
                label="deduction Order"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.deductionOrder}
                name="deductionOrder"
                error={!!touched.deductionOrder && !!errors.deductionOrder}
                helperText={touched.deductionOrder && errors.deductionOrder}
                sx={{ gridColumn: "span 2" }}
              />

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
                <InputLabel id="debitOrCredit-label">debitOrCredit</InputLabel>
                <Select
                  labelId="debitOrCredit-label"
                  value={values.debitOrCredit}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": " debitOrCredit" }}
                  name="debitOrCredit" // Corrected name
                  error={!!touched.debitOrCredit && !!errors.debitOrCredit} // Corrected error handling
                  sx={{
                    flexGrow: 1,
                    flexShrink: 1,
                    minWidth: 0,
                    gridColumn: "span 2",
                  }}
                >
                  <MenuItem value=""></MenuItem>
                  <MenuItem value="DEBIT">Debit</MenuItem>
                  <MenuItem value="CREDIT">Credit</MenuItem>
                </Select>
                {touched.debitOrCredit && errors.debitOrCredit && (
                  <FormHelperText error>{errors.debitOrCredit}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ gridColumn: "span 2", mb: 2 }}>
                <InputLabel id="counterDebitOrCredit-label">
                  counterDebitOrCredit
                </InputLabel>
                <Select
                  labelId="counterDebitOrCredit-label"
                  value={values.counterDebitOrCredit}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": " counterDebitOrCredit" }}
                  name="counterDebitOrCredit" // Corrected name
                  error={
                    !!touched.counterDebitOrCredit &&
                    !!errors.counterDebitOrCredit
                  } // Corrected error handling
                  sx={{
                    flexGrow: 1,
                    flexShrink: 1,
                    minWidth: 0,
                    gridColumn: "span 2",
                  }}
                >
                  <MenuItem value=""></MenuItem>
                  <MenuItem value="CREDIT">Credit</MenuItem>
                  <MenuItem value="DEBIT">Debit</MenuItem>
                </Select>
                {touched.counterDebitOrCredit &&
                  errors.counterDebitOrCredit && (
                    <FormHelperText error>
                      {errors.counterDebitOrCredit}
                    </FormHelperText>
                  )}
              </FormControl>

              <FormControl fullWidth sx={{ gridColumn: "span 2", mb: 2 }}>
                <InputLabel id="Payrollperiod-taxable-label">
                  taxable
                </InputLabel>
                <Select
                  labelId="Payrollperiod -taxable-label"
                  value={values.taxable}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "delivery taxable" }}
                  name="taxable" // Corrected name
                  error={!!touched.taxable && !!errors.taxable} // Corrected error handling
                  sx={{
                    flexGrow: 1,
                    flexShrink: 1,
                    minWidth: 0,
                    gridColumn: "span 2",
                  }}
                >
                  <MenuItem value=""></MenuItem>
                  <MenuItem value="NO">No</MenuItem>
                  <MenuItem value="YES">Yes</MenuItem>
                </Select>
                {touched.taxable && errors.taxable && (
                  <FormHelperText error>{errors.taxable}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ gridColumn: "span 2", mb: 2 }}>
                <InputLabel id="systemOrCostCenter-label">systemOrCostCenter</InputLabel>
                <Select
                  labelId="systemOrCostCenter-label"
                  value={values.systemOrCostCenter}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": " systemOrCostCenter" }}
                  name="systemOrCostCenter" // Corrected name
                  error={!!touched.systemOrCostCenter && !!errors.systemOrCostCenter} // Corrected error handling
                  sx={{
                    flexGrow: 1,
                    flexShrink: 1,
                    minWidth: 0,
                    gridColumn: "span 2",
                  }}
                >
                   <MenuItem value=""></MenuItem>
                  <MenuItem value="SYSTEM">Sytem</MenuItem>
                  <MenuItem value="COST_CENTER">cost_center</MenuItem>
                </Select>
                {touched.systemOrCostCenter && errors.systemOrCostCenter && (
                  <FormHelperText error>{errors.systemOrCostCenter}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ gridColumn: "span 2", mb: 2 }}>
                <InputLabel id="forcedDeduction-label">
                  forcedDeduction
                </InputLabel>
                <Select
                  labelId="forcedDeduction-label"
                  value={values.forcedDeduction}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "forcedDeduction" }}
                  name="forcedDeduction" // Corrected name
                  error={!!touched.forcedDeduction && !!errors.forcedDeduction} // Corrected error handling
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
                {touched.forcedDeduction && errors.forcedDeduction && (
                  <FormHelperText error>
                    {errors.forcedDeduction}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ gridColumn: "span 2", mb: 2 }}>
                <InputLabel id="firstDeductionFromSalary-label">
                  firstDeductionFromSalary
                </InputLabel>
                <Select
                  labelId="firstDeductionFromSalary-label"
                  value={values.firstDeductionFromSalary}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "firstDeductionFromSalary" }}
                  name="firstDeductionFromSalary" // Corrected name
                  error={
                    !!touched.firstDeductionFromSalary &&
                    !!errors.firstDeductionFromSalary
                  } // Corrected error handling
                  sx={{
                    flexGrow: 1,
                    flexShrink: 1,
                    minWidth: 0,
                    gridColumn: "span 2",
                  }}
                >
                  <MenuItem value=""></MenuItem>
                  <MenuItem value="NO">No</MenuItem>
                  <MenuItem value="YES">Yes</MenuItem>
                </Select>
                {touched.firstDeductionFromSalary &&
                  errors.firstDeductionFromSalary && (
                    <FormHelperText error>
                      {errors.firstDeductionFromSalary}
                    </FormHelperText>
                  )}
              </FormControl>

            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create EarningDeduction Setup
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
      <GetAllEarningDeductionSetup refreshKey={refreshKey} />
    </Box>
  );
};

export default CreateEarningDeductionSetup;
