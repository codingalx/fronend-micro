import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Typography,
} from "@mui/material";
import * as yup from "yup";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getAllshift, createTimeTolerance } from "../../Api/Attendance-Api";
import ListTimeTolerance from "./ListTimeTolerance";
import Header from "../Header";
import { useLocation } from "react-router-dom";

const CreateTimeTolerance = () => {
  const [allShifts, setAllShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialShiftId, setInitialShiftId] = useState("");
  const location = useLocation();
  const { shiftId } = location.state || {};
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClose = () => {
    setNotification({ ...notification, open: false });
  };

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const response = await getAllshift();
      const shifts = response.data || [];
      setAllShifts(shifts);

      // If shiftId is passed via location.state, find and set it
      if (shiftId) {
        const matchedShift = shifts.find((s) => s.id === shiftId);
        if (matchedShift) {
          setInitialShiftId(shiftId);
          setSelectedShift(matchedShift);
        }
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
    fetchShifts();
  }, []);

  const validationSchema = yup.object().shape({
    shiftId: yup.string().required("Shift selection is required"),
    startTimeTolerance: yup
      .number()
      .required("Start time tolerance is required")
      .min(0, "Must be a positive number"),
    endTimeTolerance: yup
      .number()
      .required("End time tolerance is required")
      .min(0, "Must be a positive number"),
  });

  const initialValues = {
    shiftId: initialShiftId || "",
    startTimeTolerance: "",
    endTimeTolerance: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = {
        shiftId: values.shiftId,
        startTimeTolerance: values.startTimeTolerance,
        endTimeTolerance: values.endTimeTolerance,
      };

      await createTimeTolerance(payload);

      setNotification({
        open: true,
        message: "Time tolerance created successfully!",
        severity: "success",
      });

      setRefreshKey((prevKey) => prevKey + 1);
      resetForm();
    
    } catch (error) {
      if (error.response?.status === 409) {
        setNotification({
          open: true,
          message: "A tolerance already set for this shift!",
          severity: "warning",
        });
      } else {
        setNotification({
          open: true,
          message:
            error.response?.data?.message || "Error creating time tolerance",
          severity: "error",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box m="20px">
      <Header subtitle="Configure Shift Time Tolerances" />

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
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
                "& > div": {
                  gridColumn: isMobile ? "span 4" : "span 2",
                },
              }}
            >
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
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setFieldValue("shiftId", selectedId);
                    const selected = allShifts.find((s) => s.id === selectedId);
                    setSelectedShift(selected || null);
                  }}
                  input={<OutlinedInput label="Select Shift" />}
                  // disabled={Boolean(shiftId)} // Disable dropdown if shiftId came from location.state
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

              <TextField
                fullWidth
                sx={{ gridColumn: "span 2" }}
                label="Shift Name"
                value={selectedShift?.name || ""}
                InputProps={{ readOnly: true }}
                variant="outlined"
              />

              <TextField
                fullWidth
                sx={{ gridColumn: "span 2" }}
                label="Start Time Tolerance (minutes)"
                name="startTimeTolerance"
                type="number"
                InputLabelProps={{ shrink: true }}
                value={values.startTimeTolerance}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.startTimeTolerance && Boolean(errors.startTimeTolerance)
                }
                helperText={
                  touched.startTimeTolerance && errors.startTimeTolerance
                }
                variant="outlined"
              />

              <TextField
                fullWidth
                sx={{ gridColumn: "span 2" }}
                label="End Time Tolerance (minutes)"
                name="endTimeTolerance"
                type="number"
                InputLabelProps={{ shrink: true }}
                value={values.endTimeTolerance}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.endTimeTolerance && Boolean(errors.endTimeTolerance)
                }
                helperText={
                  touched.endTimeTolerance && errors.endTimeTolerance
                }
                variant="outlined"
              />
            </Box>

            <Box display="flex" justifyContent="start" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Time Tolerance"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      <Box display="flex" alignItems="center" mb={3} sx={{ color: theme.palette.secondary.main }} />

      {selectedShift?.id && (
        <ListTimeTolerance refreshKey={refreshKey} shiftId={selectedShift.id} />
      )}

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
            borderRadius: "8px",
            boxShadow: theme.shadows[3],
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateTimeTolerance;
