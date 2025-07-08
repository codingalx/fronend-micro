import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
 
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import Header from "../common/Header";
import {
  createBackPaymentGroup,
  getAllpayBackPaymentGroup,
} from "../../../Api/payrollApi";
import GetAllBackPaymentGroup from "./GetAllBackPaymentGroup";

const CreateBackPaymentGroup = () => {
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

  const [backPaymentGroup, setBackPaymentGroup] = useState(0);

  useEffect(() => {
    fetchAllBackpaymentGroup();
  }, []);

  const fetchAllBackpaymentGroup = async () => {
    try {
      const response = await getAllpayBackPaymentGroup();
      const data = response.data;
      setBackPaymentGroup(data);
    } catch (error) {
      console.error(
        "Error fetching fetch all back payment group:",
        error.message
      );
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const paymentGroupExists = backPaymentGroup.some(
        (paymentGroup) => paymentGroup.groupName === values.groupName
      );

      if (paymentGroupExists) {
        setNotification({
          open: true,
          message:
            " backpayment group name already exists. Please use a different one.",
          severity: "warning",
        });
        return;
      }

      await createBackPaymentGroup(values);
      setNotification({
        open: true,
        message: "back payment group created successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to create back payment group . Please try again.",
        severity: "error",
      });
    }
  };

  const initialValues = {
    groupName: "",
    payrollFrom: "",
    payrollTo: "",
    description: "",
  };

  const checkoutSchema = yup.object().shape({
    groupName: yup.string().required("groupName is required"),
    payrollFrom: yup.string().required("payrollFrom is required"),
    payrollTo: yup.string().required("payrollTo is required"),
    description: yup.string().required("description is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create Back Payment Group" />
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
                label="groupName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.groupName}
                name="groupName"
                error={!!touched.groupName && !!errors.groupName}
                helperText={touched.groupName && errors.groupName}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />

                 <TextField
                fullWidth
                type="date"
                label="payroll From"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.payrollFrom}
                name="payrollFrom"
                error={!!touched.payrollFrom && !!errors.payrollFrom}
                helperText={touched.payrollFrom && errors.payrollFrom}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="date"
                label="PayRoll End Date "
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.payrollTo}
                name="payrollTo"
                error={!!touched.payrollTo && !!errors.payrollTo}
                helperText={touched.payrollTo && errors.payrollTo}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />
                 <TextField
                fullWidth
                type="text"
                multiline
                label="description "
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />


              
              
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Back Payment Group
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
      <GetAllBackPaymentGroup refreshKey={refreshKey} />
    </Box>
  );
};

export default CreateBackPaymentGroup;
