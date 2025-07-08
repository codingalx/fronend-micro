import React, { useState } from "react";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Header from "../Header";
import { createAttendanceResult } from "../../Api/Attendance-Api";

const CreateAttendanceResult = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleClose = () => {
    setNotification({ ...notification, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for required fields
    if (!startDate || !endDate) {
      setNotification({
        open: true,
        message: "Start and End dates are required.",
        severity: "warning",
      });
      return;
    }

    // Validate End Date (must be before current date)
    if (dayjs(endDate).isAfter(dayjs(), "day")) {
      setNotification({
        open: true,
        message: "End date must be before or equal to the current date.",
        severity: "warning",
      });
      return;
    }

    // Validate End Date (must be after Start Date)
    if (dayjs(endDate).isBefore(dayjs(startDate), "day")) {
      setNotification({
        open: true,
        message: "End date must be after the Start date.",
        severity: "warning",
      });
      return;
    }

    try {
      await createAttendanceResult(
        dayjs(startDate).format("YYYY-MM-DD"),  // Year-Month-Date format
        dayjs(endDate).format("YYYY-MM-DD")    // Year-Month-Date format
      );
      
      setNotification({
        open: true,
        message: "Attendance result created successfully!",
        severity: "success",
      });

      setStartDate(null);
      setEndDate(null);
    } catch (error) {
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to create attendance result",
        severity: "error",
      });
    }
  };

  return (
    <Box m="20px">
      <Header subtitle="Create Attendance Result" />

      <form onSubmit={handleSubmit}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={3}
            sx={{ maxWidth: 400, margin: "auto" }}
          >
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
              format="YYYY-MM-DD"  // Display format
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
              format="YYYY-MM-DD"  // Display format
              minDate={startDate}  // Ensures end date can't be before start date
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="secondary" 
              fullWidth 
              size="large"
            >
              Create Attendance Result
            </Button>
          </Box>
        </LocalizationProvider>
      </form>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateAttendanceResult;
