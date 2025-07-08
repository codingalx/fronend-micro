import React, { useState } from "react";
import ListShifts from "./ListShifts";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Grid,
  Divider,
  useTheme,
} from "@mui/material";
import * as yup from "yup";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../Header";
import { createShifts } from "../../Api/Attendance-Api";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);

const CreateShift = () => {
  const theme = useTheme();
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleClose = () => {
    setNotification({ ...notification, open: false });
  };

  const [refreshKey, setRefreshKey] = useState(0);

  const validationSchema = yup.object().shape({
    name: yup.string().required("Shift name is required"),
    startTime: yup.string().required("Start time is required"),
    endTime: yup
      .string()
      .required("End time is required")
      .test("is-after-start", "End time must be after or equal to start time", function (value) {
        const { startTime } = this.parent;
        if (!startTime || !value) return true;
        const start = dayjs(startTime, "HH:mm");
        const end = dayjs(value, "HH:mm");
        return end.isSameOrAfter(start);
      }),
  });

  const initialValues = {
    name: "",
    startTime: "",
    endTime: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formattedStartTime = dayjs(values.startTime, "HH:mm").format("hh:mm A");
      const formattedEndTime = dayjs(values.endTime, "HH:mm").format("hh:mm A");

      const payload = {
        name: values.name,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      };

      await createShifts(payload);

      setNotification({
        open: true,
        message: "Shift created successfully!",
        severity: "success",
      });

      setRefreshKey((prevKey) => prevKey + 1);
      resetForm();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setNotification({
            open: true,
            message: "A shift already exists with this name. Please adjust the name!",
            severity: "warning",
          });
        } else {
          setNotification({
            open: true,
            message: error?.response?.data?.message || "Error creating shift.",
            severity: "error",
          });
        }
      } else if (error.request) {
        setNotification({
          open: true,
          message: "Network error, please check your connection and try again.",
          severity: "error",
        });
      } else {
        setNotification({
          open: true,
          message: "An unexpected error occurred.",
          severity: "error",
        });
      }

      setSubmitting(false);
    }
  };

  return (
    <Box m="20px">
      <Header subtitle="Create work shifts" />

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
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
                "& > div": { gridColumn: useMediaQuery(theme.breakpoints.down("sm")) ? "span 4" : "span 2" },
              }}
            >
              <TextField
                fullWidth
                sx={{ gridColumn: "span 2" }}
                label="Shift Name"
                name="name"
                variant="outlined"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                label="Start Time"
                name="startTime"
                sx={{ gridColumn: "span 2" }}
                type="time"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                value={values.startTime}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.startTime && Boolean(errors.startTime)}
                helperText={touched.startTime && errors.startTime}
              />

              <TextField
                fullWidth
                label="End Time"
                name="endTime"
                sx={{ gridColumn: "span 2" }}
                type="time"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                value={values.endTime}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.endTime && Boolean(errors.endTime)}
                helperText={touched.endTime && errors.endTime}
              />
              </Box>

             
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Shift 
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      {/* Shift List */}
      <ListShifts refreshKey={refreshKey} />

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
            boxShadow: theme.shadows[3],
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateShift;
