import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, Grid, CircularProgress, Divider, useTheme } from "@mui/material";
import * as yup from "yup";
import { Formik } from "formik";
import { createOverTime, getAllshift } from "../../Api/Attendance-Api";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import ListOverTime from "./ListOverTime";
import Header from "../Header";
import useMediaQuery from "@mui/material/useMediaQuery";

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

dayjs.extend(customParseFormat);

const CreateOverTime = () => {
  const theme = useTheme();
  const [shifts, setShifts] = useState([]);
    const isNonMobile = useMediaQuery("(min-width:600px)");
  
  const [selectedShiftEndTime, setSelectedShiftEndTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const handleClose = () => {
    setNotification({ ...notification, open: false });
  };

  const validationSchema = yup.object().shape({
    shiftId: yup.string().required("Shift selection is required"),
    startTime: yup.string().required("Start time is required"),
    endTime: yup.string()
      .required("End time is required")
      .test(
        "is-after-start",
        "End time must be after or equal to start time",
        function (value) {
          const { startTime } = this.parent;
          if (!startTime || !value) return true;
          const start = dayjs(startTime, "HH:mm");
          const end = dayjs(value, "HH:mm");
          return end.isSameOrAfter(start);
        }
      ), 
  });

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      const response = await getAllshift();
      setShifts(response.data);
    } catch (error) {
      console.error("Error fetching shifts:", error);
      setNotification({
        open: true,
        message: "Failed to load shift data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    shiftId: "",
    startTime: "",
    endTime: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (!selectedShiftEndTime) {
        setNotification({
          open: true,
          message: "Please select a shift.",
          severity: "error",
        });
        setSubmitting(false);
        return;
      }

      const otStart = dayjs(values.startTime, "HH:mm");
      const shiftEnd = dayjs(selectedShiftEndTime, "HH:mm");

      if (otStart.isBefore(shiftEnd)) {
        setNotification({
          open: true,
          message: `Overtime must start at or after shift ends (${selectedShiftEndTime}).`,
          severity: "error",
        });
        setSubmitting(false);
        return;
      }

      const formattedStartTime = dayjs(values.startTime, "HH:mm").format("hh:mm A");
      const formattedEndTime = dayjs(values.endTime, "HH:mm").format("hh:mm A");

      const payload = {
        shiftId: values.shiftId,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      };

      await createOverTime(payload);

      setNotification({
        open: true,
        message: "Overtime created successfully!",
        severity: "success",
      });

      setRefreshKey((prevKey) => prevKey + 1);
      resetForm();
    } catch (error) {
      if (error.response?.status === 409) {
        setNotification({
          open: true,
          message: 'An overtime entry already exists for this shift!',
          severity: 'warning'
        });
      } else { 
        setNotification({
          open: true,
          message: error.response?.data?.message || "Error creating overtime",
          severity: "error",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header subtitle="Create New Overtime Entries" />

    
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
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
                      <FormControl fullWidth variant="outlined"   sx={{ gridColumn: "span 2" }}>
                        <InputLabel id="shift-select-label">Shift Name</InputLabel>
                        <Select
                          labelId="shift-select-label"
                          id="shiftId"
                          name="shiftId"
                     

                          label="Select Shift"
                          value={values.shiftId}
                          onChange={(e) => {
                            const selectedId = e.target.value;
                            handleChange(e);
                            const selectedShift = shifts.find((shift) => shift.id === selectedId);
                            if (selectedShift) {
                              setSelectedShiftEndTime(selectedShift.endTime);
                            }
                          }}
                          onBlur={handleBlur}
                          error={touched.shiftId && Boolean(errors.shiftId)}
                        >
                          {shifts.map((shift) => (
                            <MenuItem key={shift.id} value={shift.id}>
                              {`${shift.name} (${shift.startTime} - ${shift.endTime})`}
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.shiftId && errors.shiftId && (
                          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {errors.shiftId}
                          </Typography>
                        )}
                      </FormControl>

                      <TextField
                       sx={{ gridColumn: "span 2" }}

                        fullWidth
                        label="Start Time"
                        name="startTime"
                        type="time"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ step: 300 }} // 5 minute intervals
                        value={values.startTime}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.startTime && Boolean(errors.startTime)}
                        helperText={touched.startTime && errors.startTime}
                        variant="outlined"
                      />

                      <TextField
                        fullWidth
                        label="End Time"
                        name="endTime"
                        type="time"
                                          sx={{ gridColumn: "span 2" }}

                        InputLabelProps={{ shrink: true }}
                        inputProps={{ step: 300 }} // 5 minute intervals
                        value={values.endTime}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.endTime && Boolean(errors.endTime)}
                        helperText={touched.endTime && errors.endTime}
                        variant="outlined"
                      />
                      </Box>

                 <Box display="flex" justifyContent="start" mt="20px">
                <Button type="submit" color="secondary" variant="contained"  disabled={isSubmitting}>
                  {isSubmitting ? <CircularProgress size={24} /> : "Create Overtime"}
                </Button>
              </Box>
                </form>
              )}
            </Formik>

       
            <ListOverTime refreshKey={refreshKey} />
       
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert 
          onClose={handleClose} 
          severity={notification.severity} 
          sx={{ 
            width: "100%",
            borderRadius: '8px',
            boxShadow: theme.shadows[3]
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateOverTime;
