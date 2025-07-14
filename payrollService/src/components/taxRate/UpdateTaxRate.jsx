import React, { useState, useEffect } from "react";
import {  Box, Button, TextField, Snackbar, Alert ,FormControl,InputLabel ,Select ,MenuItem  } from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import Header from "../common/Header";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";

import {
  getAllBudgetYear,
  getAllTaxRate,
  getTaxRateById,
  updateTaxRate,
} from "../../../Api/payrollApi";
import { useLocation ,useNavigate} from "react-router-dom";

const UpdateTaxRate = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
    const location = useLocation();
      const navigate = useNavigate();
  const { id } = location.state || {};
   const [authState] = useAtom(authAtom); // Access the shared authentication state
      const tenantId = authState.tenantId

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const [taxRate, setTaxRate] = useState([]);
  const [budgetYears, setBudgetYears] = useState([]);

  useEffect(() => {
    fetchAllTaxRate();
    fetchAllBudgetYear();
    fetchTaxRateById();
  }, []);

  const fetchAllTaxRate = async () => {
    try {
      const response = await getAllTaxRate();
      const data = response.data;
      setTaxRate(data);
    } catch (error) {
      console.error("Error fetching fetch tax rate:", error.message);
    }
  };

  const fetchAllBudgetYear = async () => {
    try {
      const response = await getAllBudgetYear(tenantId);
      const data = response.data;
      setBudgetYears(data);
    } catch (error) {
      console.error("Error fetching fetch all budget year:", error.message);
    }
  };

 const handleFormSubmit = async (values) => {
  try {
    // Check for overlapping ranges, excluding the current ID
    const isOverlapping = taxRate.some((tax) => {
      return (
        tax.id !== id && // Exclude the current tax rate
        ((values.fromAmount >= tax.fromAmount && values.fromAmount <= tax.toAmount) ||
         (values.toAmount >= tax.fromAmount && values.toAmount <= tax.toAmount) ||
         (values.fromAmount <= tax.fromAmount && values.toAmount >= tax.toAmount))
      );
    });

    if (isOverlapping) {
      setNotification({
        open: true,
        message: "The entered range overlaps with an existing tax rate. Please adjust your values.",
        severity: "warning",
      });
      return;
    }

    await updateTaxRate(id, values);
    setNotification({
      open: true,
      message: "TaxRate updated successfully!",
      severity: "success",
    });
   
       navigate('/payroll/create_tax_rate'); // Redirect after deletion
  } catch (error) {
    console.error("Failed to submit form data:", error);
    setNotification({
      open: true,
      message: "Failed to update tax rate. Please try again.",
      severity: "error",
    });
  }
};

  const [tax, setTax] = useState({
    fromAmount: "",
    toAmount: "",
    rateInPercent: "",
    constantAmount: "",
     date: "",
  status: ""
  });

  const fetchTaxRateById = async () => {
    try {
      const response = await getTaxRateById(id);
      setTax(response.data);
      console.log(response.data);
    } catch (error) {
      // setError(error.message);
      console.error(error.message);
    }
  };

  const checkoutSchema = yup.object().shape({
      fromAmount: yup.string().required("fromAmount is required"),
      toAmount: yup.string().required("toAmount is required"),
      rateInPercent: yup.string().required("rateInPercent is required"),
      constantAmount: yup.string().required("constantAmount is required"),
      date: yup.string().required("date  is required"),
          status: yup.string().required("status  is required"),
  
    });;

  return (
    <Box m="20px">
      <Header subtitle="update Tax Rate" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={tax}
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
                              label="date"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.date}
                              name="date"
                              error={!!touched.date && !!errors.date}
                              helperText={touched.date && errors.date}
                              sx={{ gridColumn: "span 2" }}
                               InputLabelProps={{ shrink: true }}
                            />
              
                              <FormControl fullWidth sx={{ gridColumn: "span 2", mb: 2 }}>
                                            <InputLabel id="Pension-status-label">
                                               Status
                                            </InputLabel>
                                            <Select
                                              labelId="Pension -status-label"
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
                                           
                                            </Select>
                                            {touched.status && errors.status && (
                                              <FormHelperText error>{errors.status}</FormHelperText>
                                            )}
                                          </FormControl>
              
          
              <TextField
                fullWidth
                type="number"
                label="from Amount"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fromAmount}
                name="fromAmount"
                error={!!touched.fromAmount && !!errors.fromAmount}
                helperText={touched.fromAmount && errors.fromAmount}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="number"
                label="to Amount"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.toAmount}
                name="toAmount"
                error={!!touched.toAmount && !!errors.toAmount}
                helperText={touched.toAmount && errors.toAmount}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="number"
                label="rate In Percent"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.rateInPercent}
                name="rateInPercent"
                error={!!touched.rateInPercent && !!errors.rateInPercent}
                helperText={touched.rateInPercent && errors.rateInPercent}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="constantAmount"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.constantAmount}
                name="constantAmount"
                error={!!touched.constantAmount && !!errors.constantAmount}
                helperText={touched.constantAmount && errors.constantAmount}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update TaxRate
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

export default UpdateTaxRate;
