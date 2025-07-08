import { useState, useEffect } from "react";
import { Box, Button, TextField, Snackbar, Alert, Autocomplete } from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import Header from "../common/Header";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; // Adjust the import based on your structure
import { createLeaveAdvacementPayment, listEmployee } from "../../../Api/payrollApi";
import GetAllLeaveAdvancePayment from "./GetAllLeaveAdvancePayment";

const CreateLeaveAdvancePayment = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };
     const [authState] = useAtom(authAtom); // Access the shared authentication state
    const tenantId = authState.tenantId;

  const [refreshKey, setRefreshKey] = useState(0);
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeId, setEmployeeId] = useState("");

  useEffect(() => {
    fetchAllEmployee();
  }, []);

  const fetchAllEmployee = async () => {
    try {
      const response = await listEmployee(tenantId);
      const data = response.data;
      setEmployeeData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching employees:", error.message);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      await createLeaveAdvacementPayment({ ...values, employeeId });
      setNotification({
        open: true,
        message: "Leave advance payment created successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey((prev) => prev + 1);
      setEmployeeId("");
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to create Leave advance payment. Please try again.",
        severity: "error",
      });
    }
  };

  const initialValues = {
    startFrom: "",
    endTo: "",
  };

  const checkoutSchema = yup.object().shape({
    startFrom: yup.string().required("Starting date is required"),
    endTo: yup.string().required("Ending date is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create Leave Advance Payment" />
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
              gridTemplateColumns="repeat(2, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
              }}
            >
              <Autocomplete
                options={employeeData}
                getOptionLabel={(option) => option.employeeId} // Adjust based on your data
                onChange={(event, newValue) => {
                  setEmployeeId(newValue ? newValue.id : ""); // Assuming `id` is the employee ID
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Employee"
                    variant="outlined"
                    error={!!touched.employeeId && !!errors.employeeId}
                    helperText={touched.employeeId && errors.employeeId}
                     sx={{ gridColumn: "span 2" }}
                  />
                )}
              />
              
              <TextField
                fullWidth
                type="date"
                label="Start From"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.startFrom}
                name="startFrom"
                error={!!touched.startFrom && !!errors.startFrom}
                helperText={touched.startFrom && errors.startFrom}
                sx={{ gridColumn: "span 1" }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="date"
                label="End Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.endTo}
                name="endTo"
                error={!!touched.endTo && !!errors.endTo}
                helperText={touched.endTo && errors.endTo}
                sx={{ gridColumn: "span 1" }}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Leave Advance Payment
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
      <GetAllLeaveAdvancePayment refreshKey={refreshKey} />
    </Box>
  );
};

export default CreateLeaveAdvancePayment;