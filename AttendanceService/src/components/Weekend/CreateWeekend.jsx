import React, { useState, useEffect } from "react";
import {
  Box, Button, Checkbox, FormControl, InputLabel, Typography,
  Snackbar, Alert, OutlinedInput, ListItemText, TextField, MenuItem,
  Select, Avatar, Divider, CircularProgress, Chip, useTheme
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import { createWeeknds, getAllshift, getShiftById } from "../../Api/Attendance-Api";
import ListDays from "./ListDays";
import Header from "../Header";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Event as EventIcon, Schedule as ScheduleIcon, Check as CheckIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useLocation } from "react-router-dom";

const DayCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.palette.primary.main,
  '&.Mui-checked': {
    color: theme.palette.primary.main,
  },
}));

const DayMenuItem = styled(MenuItem)(({ theme, selected }) => ({
  backgroundColor: selected ? theme.palette.action.selected : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5),
  transition: 'all 0.2s ease-in-out',
}));

const CreateWeekend = () => {
  const theme = useTheme();
  const [allShifts, setAllShifts] = useState([]);
  const location = useLocation();
  const shiftId = location.state?.shiftId || null; // Get the shiftId passed from previous page
  const [selectedShift, setSelectedShift] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const daysOfWeek = [
    "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY",
    "FRIDAY", "SATURDAY", "SUNDAY"
  ];

  // Fetch all shifts or a specific shift if shiftId is provided
  const fetchShifts = async () => {
    try {
      setLoading(true);
      if (shiftId) {
        // Fetch a specific shift using shiftId
        const response = await getShiftById(shiftId);
        setSelectedShift(response.data);
      } else {
        // Fetch all shifts if no shiftId is provided
        const response = await getAllshift();
        setAllShifts(response.data || []);
      }
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to load shifts.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts(); // Call the function to fetch shifts when component mounts or shiftId changes
  }, [shiftId]);

  const initialValues = {
    days: [],
    shiftId: shiftId || "", // Use shiftId passed from the state or an empty string
  };

  const validationSchema = Yup.object().shape({
    days: Yup.array().min(1, "Select at least one day"),
    shiftId: Yup.string().required("Shift is required"),
  });

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);
      await createWeeknds({
        dayNames: values.days,
        shiftId: values.shiftId,
      });

      const matchedShift = allShifts.find(s => s.id === values.shiftId);
      setSelectedShift(matchedShift || null);

      setNotification({
        open: true,
        message: "Weekend days assigned to shift successfully",
        severity: "success",
      });
      setRefreshKey((prevKey) => prevKey + 1);
      resetForm();
    } catch (error) {
      if (error.response?.status === 409) {
        setNotification({
          open: true,
          message: 'A weekend already set for this shift!',
          severity: 'warning'
        });
      } else {
        setNotification({
          open: true,
          message: error.response?.data?.message || "Failed to assign weekend for this shift",
          severity: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box m="20px">
      <Header subtitle="Assign weekend days to a shift" />

      <Box>
       

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
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
                {/* Shift Dropdown */}
                <FormControl
                  fullWidth
                  error={!!touched.shiftId && !!errors.shiftId}
                  sx={{ gridColumn: "span 2" }}
                >
                  <InputLabel id="shift-label">Select Shift</InputLabel>
                  <Select
                    labelId="shift-label"
                    name="shiftId"
                    value={values.shiftId}
                    onChange={(event) => {
                      setFieldValue("shiftId", event.target.value);
                      const matched = allShifts.find(s => s.id === event.target.value);
                      setSelectedShift(matched);
                    }}
                    input={<OutlinedInput label="Select Shift" />}
                  >
                    {allShifts.map((shift) => (
                      <MenuItem key={shift.id} value={shift.id}>
                        {`${shift.name} (${shift.startTime} - ${shift.endTime})`}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.shiftId && errors.shiftId && (
                    <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                      {errors.shiftId}
                    </Typography>
                  )}
                </FormControl>

                {/* Read-only shift display */}
                <TextField
                  label="Selected Shift Info"
                  value={
                    selectedShift
                      ? `${selectedShift.name} (${selectedShift.startTime} - ${selectedShift.endTime})`
                      : "No shift selected"
                  }
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  fullWidth
                  sx={{ gridColumn: "span 2" }}
                />

                {/* Days Selector */}
                <FormControl
                  fullWidth
                  error={!!touched.days && !!errors.days}
                  sx={{ gridColumn: "span 2" }}
                >
                  <InputLabel>Select Weekend Days</InputLabel>
                  <Select
                    multiple
                    name="days"
                    value={values.days}
                    onChange={(event) => setFieldValue("days", event.target.value)}
                    input={<OutlinedInput label="Select Weekend Days" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((day) => (
                          <Chip
                            key={day}
                            label={day}
                            color="primary"
                            variant="outlined"
                            sx={{
                              borderColor: theme.palette.primary.main,
                              color: theme.palette.primary.main,
                              fontWeight: 'bold',
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {daysOfWeek.map((day) => (
                      <DayMenuItem key={day} value={day} selected={values.days.includes(day)}>
                        <DayCheckbox checked={values.days.includes(day)} />
                        <ListItemText primary={day} />
                      </DayMenuItem>
                    ))}
                  </Select>
                  {touched.days && errors.days && (
                    <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                      {errors.days}
                    </Typography>
                  )}
                </FormControl>
              </Box>

              {/* Submit button */}
              <Box display="flex" justifyContent="flex-start" mt="30px">
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
                >
                  {loading ? "Assigning..." : "Assign Days"}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={notification.severity}
          sx={{
            width: "100%",
            boxShadow: theme.shadows[3],
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Display ListDays component if a shift is selected */}
      {selectedShift && (
        
          <ListDays refreshKey={refreshKey} shiftId={selectedShift.id} />
      )}
    </Box>
  );
};

export default CreateWeekend