import { useState,useEffect } from "react";
import { Box, Button, TextField, Snackbar, Alert ,MenuItem ,FormHelperText, InputLabel,FormControl,Select} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import Header from "../common/Header";
import {  getAllPensionRates, getPensionRatesById, updatePensionRates } from "../../../Api/payrollApi";
import { useLocation,useNavigate } from "react-router-dom";

const UpdatePensionRate = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");


  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };
     const location = useLocation();
     const navigate = useNavigate();
      const { id } = location.state || {};

    const [pensionRate, SetPensionRate] = useState(0);

  
    useEffect(() => {
      fetchAllPensionRate();
      fetchPensionRate();
      
    }, []);

   const fetchAllPensionRate = async () => {
      try {
        const response = await getAllPensionRates();
        const data = response.data;
        SetPensionRate(data);
      } catch (error) {
        console.error("Error fetching fetch all pension rate:", error.message);
      }
    };

     const fetchPensionRate = async () => {
      try {
        const response = await getPensionRatesById(id);
        const data = response.data;
        SetSinglepensionRate(data);
      } catch (error) {
        console.error("Error fetching fetch single pension rate:", error.message);
      }
    };
 
 

  const handleFormSubmit = async (values, { resetForm }) => {
  try {

    
      const pensionDateExists = pensionRate.some(
        (pension) => pension.date === values.date && pension.id !== id
    );

    if (pensionDateExists) {
      setNotification({
          open: true,
          message: " Pension rate already exists. Please use a different one.",
          severity: "warning",
      });
      return;
  }
   
    await updatePensionRates(id,values);
    setNotification({
      open: true,
      message: "pension rate update successfully!",
      severity: "success",
    });
    resetForm();
      navigate('/payroll/create_pension_rate');
  } catch (error) {
    console.error("Failed to submit form data:", error);
    setNotification({
      open: true,
      message: "Failed to update pension rate. Please try again.",
      severity: "error",
    });
  }
};

 const [SinglepensionRate, SetSinglepensionRate] = useState({
      organizationContribution: "",
    employeesContribution: "",
    date: "",
    status: "",

 });




 

   

  const checkoutSchema = yup.object().shape({
    organizationContribution: yup.string().required("organizationContribution is required"),
    employeesContribution: yup.string().required("employeesContribution is required"),
    date: yup.string().required("date is required"),
    status: yup.string().required("date is required"),
 
  });

  return (
    <Box m="20px">
      <Header subtitle="Update Tax Rate" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={SinglepensionRate}
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
                type="number"
                label="organizationContribution"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.organizationContribution}
                name="organizationContribution"
                error={!!touched.organizationContribution && !!errors.organizationContribution}
                helperText={touched.organizationContribution && errors.organizationContribution}
                sx={{ gridColumn: "span 2" }}
              />

               <TextField
                fullWidth
                type="number"
                label="employees Contribution"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.employeesContribution}
                name="employeesContribution"
                error={!!touched.employeesContribution && !!errors.employeesContribution}
                helperText={touched.employeesContribution && errors.employeesContribution}
                sx={{ gridColumn: "span 2" }}
              />

             
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

            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create PensionRate
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

export default UpdatePensionRate;
