import { Alert, Box, Button, MenuItem, Snackbar, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState, useEffect } from "react";
import Header from "../common/Header";
import { getEmployeeByEmployeId } from "../../../configuration/LeaveApi";
import { getLeaveScheduleById, updateLeaveSchedule } from "../../../configuration/LeaveApi";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

const validationSchema = yup.object().shape({
  description: yup.string().required("required"),
  leaveMonth: yup.string().required("Please select an option from the dropdown menu."),
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

const UpdateLeaveschedule = () => {
  const [employeeDetails, setEmployeeDetails] = useState({ id: "", employeeId: "" });
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;
  const username = authState.username;


  const [leaveSchedule, setLeaveSchedule] = useState({
    leaveMonth: "",
    description: "",
    employeeId: "",
  });

  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state.id;


  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });


  useEffect(() => {
    fetchEmployeeDetails();
    fetchLeaveSchedule();
  }, []);

  const fetchLeaveSchedule = async () => {
    try {
      const response = await getLeaveScheduleById(tenantId,id);
      const data = response.data;
      setLeaveSchedule(data);
    } catch (error) {
      console.error("Failed to fetch leave schedule:", error.message);
    }
  };

  const fetchEmployeeDetails = async () => {
    try {
      const response = await getEmployeeByEmployeId(tenantId,username);
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = response.data;
      setEmployeeDetails({ id: data.id, employeeId: data.employeeId });
    } catch (error) {
      console.error("Failed to fetch employee details:", error);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const updatedValues = {
        ...values,
        employeeId: employeeDetails.id, // Send `id` to the server
      };
      console.log("Submitting the following values for leave schedule:", updatedValues);

      await updateLeaveSchedule(tenantId,id ,updatedValues);


      setNotification({
        open: true,
        message: "Leave schedule updated successfully!",
        severity: "success",
      });
      resetForm();
      navigate('/addleaveschedule'); 

    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to update leave schedule. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const isNonMobile = useMediaQuery("(min-width:600px)");

  return (
    <Box m="20px" className="insert-tenant">
      <Header subtitle="Update leave schedule profile" />

      <Formik
        initialValues={leaveSchedule}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
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
              {/* Display `employeeId` to the user */}
              <TextField
                fullWidth
                type="text"
                label="Employee ID"
                value={employeeDetails.employeeId} // Show employeeId
                name="employeeId"
                disabled
                InputLabelProps={{ shrink: !!employeeDetails.employeeId }}
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
                Update Leave Schedule
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
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default UpdateLeaveschedule;
