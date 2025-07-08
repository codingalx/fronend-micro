import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import * as yup from "yup";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../Header";
import NoPageHandle from "../common/NoPageHandel";
import { getShiftById, updateShift } from "../../Api/Attendance-Api";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";

dayjs.extend(customParseFormat);

const UpdateShift = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const shiftId = location.state?.shiftId;

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [shiftbyId, setShiftById] = useState(null);

  const handleClose = () => {
    setNotification({ ...notification, open: false });
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required("Shift name is required"),
    startTime: yup.string().required("Start time is required"),
    endTime: yup.string().required("End time is required"),
  });

  useEffect(() => {
    fetchShiftById();
  }, [shiftId]);

  const fetchShiftById = async () => {
    try {
      const response = await getShiftById(shiftId);
      if (response?.data) {
        setShiftById(response.data);
      }
    } catch (error) {
      console.error("Error fetching shifts", error);
    }
  };


  if (!shiftId) {
  return <NoPageHandle message="No shift selected to update." navigateTo="/attendance/set_up" state={{ activeTab: 0 }} />;
}


  const initialValues = {
    name: shiftbyId?.name || "",
    startTime: shiftbyId?.startTime ? dayjs(shiftbyId.startTime, "hh:mm A").format("HH:mm") : "",
    endTime: shiftbyId?.endTime ? dayjs(shiftbyId.endTime, "hh:mm A").format("HH:mm") : "",
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

      await updateShift(shiftId, payload);
      setNotification({
        open: true,
        message: "Shift updated successfully",
        severity: "success",
      });

      resetForm();
      setTimeout(() => {
          navigate('/attendance/set_up', { state: { activeTab: 0 } }); 
      }, 1000);
      
    } catch (error) {
      if (error.response?.status === 409) {
        setNotification({
          open: true,
          message: "A shift already exists with this name. Please adjust the name!",
          severity: "warning",
        });
      } else {
        console.error("Error updating shift", error);
        setNotification({
          open: true,
          message: "Failed to update shift",
          severity: "error",
        });
      }
    }
  };

  return (
    <Box m="20px">
      <Header subtitle="Update Work Shift" />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
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
                "& > div": { gridColumn: useMediaQuery(theme.breakpoints.down("sm")) ? "span 4" : "span 2" },
              }}
            >
              <TextField
                fullWidth
                label="Shift Name"
                name="name"
                variant="outlined"
                sx={{ gridColumn: "span 2" }}
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
                type="time"
                sx={{ gridColumn: "span 2" }}
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
                type="time"
                sx={{ gridColumn: "span 2" }}
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
                <Button type="submit" color="secondary" variant="contained" startIcon={<EditIcon />} disabled={isSubmitting}>
                  {isSubmitting ? <CircularProgress size={24} /> : "Update Shift"}
                </Button>
              </Box>
          </form>
        )}
      </Formik>

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

export default UpdateShift;
