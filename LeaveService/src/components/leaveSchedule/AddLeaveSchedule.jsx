import { Alert, Box, Button, MenuItem, Snackbar, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import Header from "../common/Header";
import { getEmployeeByEmployeId } from "../../../configuration/LeaveApi";
import { useEffect } from "react";
import { addleaveschedule, getAlleaveschedule } from "../../../configuration/LeaveApi";
import LeaveScheduleByEmploye from "./LeaveScheduleByEmploye";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

const validationSchema = yup.object().shape({
  description: yup.string().required("required"),
  leaveMonth: yup
    .string()
    .required("Please select an option from the dropdown menu."),
});

const monthOptions = {
  JANUARY: "JANUARY",
  FEBRUARY: "FEBRUARY",
  MARCH: "MARCH",
  APRIL: "APRIL",
  MAY: "MAY",
  JUNE: "JUNE",
  JULY: "JULY",
  AUGUST: "AUGUST",
  SEPTEMBER: "SEPTEMBER",
  OCTOBER: "OCTOBER",
  NOVEMBER: "NOVEMBER",
  DECEMBER: "DECEMBER",
};

const AddLeaveSchedule = () => {
  const [leaveSchedule, setLeaveSchedule] = useState([]); // Changed to array
  const [employeeDetails, setEmployeeDetails] = useState("");
  const [authState] = useAtom(authAtom); 
  const { username } = authState;
  const tenantId = authState.tenantId
  const [refreshKey, setRefreshKey] = useState(0);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });



  useEffect(() => {
    fetchEmployeeDetails();
    fetchAllLeaveSchedule();
  }, []);

  const fetchAllLeaveSchedule = async () => {
    try {
      const response = await getAlleaveschedule(tenantId	);
      setLeaveSchedule(response.data); // Store all leave schedule data
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch leave schedules:", error.message);
    }
  };

  const fetchEmployeeDetails = async () => {
    try {
      const response = await getEmployeeByEmployeId(tenantId, username);
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setEmployeeDetails(response.data); // Ensure this contains the employee ID
      console.log('The employee data is', response.data.id); // Check the structure of the response
    } catch (error) {
      console.error("Failed to fetch employee details:", error);
    }
  };
  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const updatedValues = {
        ...values,
        employeeId: employeeDetails.id, // Check this value
      };
  
      if (!updatedValues.employeeId) {
        setNotification({
          open: true,
          message: "Employee ID is not available. Please check employee details.",
          severity: "error",
        });
        return;
      }
  
      // Check if the employeeId already exists in the leaveSchedule data
      const existingSchedule = leaveSchedule.find(
        (schedule) => schedule.employeeId === updatedValues.employeeId
      );
  
      if (existingSchedule) {
        setNotification({
          open: true,
          message: "A leave schedule for this employee already exists!",
          severity: "error",
        });
        return; // Prevent API call
      }
  
      console.log("Submitting the following values for leave schedule:", updatedValues);
      await addleaveschedule(tenantId, updatedValues);
  
      setNotification({
        open: true,
        message: "Leave request submitted successfully!",
        severity: "success",
      });
  
      // Refresh the leave schedule list
      fetchAllLeaveSchedule();
      resetForm();
      setRefreshKey(prev => prev + 1); 

    } catch (error) {
      console.error("Failed to submit leave request. Error:", error);
      setNotification({
        open: true,
        message: "Failed to submit leave request. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const initialValues = {
    leaveMonth: "",
    description: "",
    employeeId: username && !username.includes("admin") ? username : "",
  };

  const isNonMobile = useMediaQuery("(min-width:600px)");

  return (
    <Box m="20px" className="insert-tenant">
      <Header subtitle="Create a new leave schedule profile" />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, handleBlur, handleChange }) => (
          <Form>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 0" },
              }}
              className="form-group"
            >
              {/* Display username as Employee ID */}
              <TextField
                fullWidth
                type="text"
                label="Employee ID"
                value={values.employeeId}
                name="employeeId"
                disabled
                InputLabelProps={{ shrink: !!values.employeeId }}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                select
                label="Leave Month"
                name="leaveMonth"
                value={values.leaveMonth}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.leaveMonth && !!errors.leaveMonth}
                helperText={touched.leaveMonth && errors.leaveMonth}
                sx={{ gridColumn: "span 2" }}
              >
                {Object.keys(monthOptions).map((key) => (
                  <MenuItem key={key} value={key}>
                    {monthOptions[key]}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Leave Schedule Description"
                multiline
                rows={5}
                onChange={handleChange}
                value={values.description}
                name="description"
                onBlur={handleBlur}
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Leave Schedule
              </Button>
            </Box>
            <Snackbar
              open={notification.open}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
                {notification.message}
              </Alert>
            </Snackbar>
            <LeaveScheduleByEmploye   refreshKey={refreshKey} />
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddLeaveSchedule;

