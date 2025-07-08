import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import * as yup from "yup";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getOverTimeById, updateOverTime } from "../../Api/Attendance-Api";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import Header from "../Header";
import NoPageHandle from "../common/NoPageHandel";

const UpdateOverTime = () => {
  const location = useLocation();
  const [overTime, setOverTime] = useState(null); 
  const navigate = useNavigate();
  const { overTimeId, name } = location.state || {};
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleClose = () => {
    setNotification({ ...notification, open: false });
  };

  const validationSchema = yup.object().shape({
    startTime: yup.string().required("Start time is required"),
    endTime: yup.string().required("End time is required"),
  });

  useEffect(() => {
    fetchOverTimeById();
  }, []);

  const fetchOverTimeById = async () => {
    try {
      const response = await getOverTimeById(overTimeId);
      if (response?.data) {
        setOverTime(response.data);
      }
    } catch (error) {
      console.error("Error fetching overtime", error);
      setNotification({
        open: true,
        message: "Failed to load overtime data",
        severity: "error",
      });
    }
  };

  const getInitialValues = () => {
    if (!overTime) return { name: name || "", startTime: "", endTime: "" };
    
    return {
      name: name || "",
      startTime: overTime.startTime 
        ? dayjs(overTime.startTime, "hh:mm A").format("HH:mm") 
        : "",
      endTime: overTime.endTime 
        ? dayjs(overTime.endTime, "hh:mm A").format("HH:mm") 
        : "",
    };
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formattedStartTime = dayjs(values.startTime, "HH:mm").format("hh:mm A");
      const formattedEndTime = dayjs(values.endTime, "HH:mm").format("hh:mm A");

      const payload = {
        shiftId: overTime.shiftId, 
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      };
      
      await updateOverTime(overTimeId, payload);
      setNotification({
        open: true,
        message: "Overtime updated successfully",
        severity: "success",
      });
      
      setTimeout(() => {
        navigate('/attendance/set_up', { state: { activeTab: 2 } }); 

      }, 1000);
      
    } catch (error) {
      console.error("Error updating overtime", error);
      setNotification({
        open: true,
        message: "Please check for your Time input ",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!overTimeId) {
    return <NoPageHandle message="No shift selected to update."navigateTo="/attendance/set_up" state={{ activeTab: 2 }} />;
  }

  return (
    <Box m="20px">
        <Header subtitle="Update Over Time" />
      <Formik
        initialValues={getInitialValues()}
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
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                label="Shift Name"
                name="name"
                value={values.name}

                sx={{ gridColumn: "span 2" }}
                onChange={handleChange}
                InputProps={{ readOnly: true }}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />

              <TextField
                fullWidth
                label="Start Time"
                name="startTime"
                type="time"
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }} // 5 minute intervals
                value={values.startTime}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.startTime && Boolean(errors.startTime)}
                helperText={touched.startTime && errors.startTime}
              />
            
              <TextField
                fullWidth
                label="End Time"
                sx={{ gridColumn: "span 2" }}
                name="endTime"
                type="time"
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }} // 5 minute intervals
                value={values.endTime}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.endTime && Boolean(errors.endTime)}
                helperText={touched.endTime && errors.endTime}
              />
            </Box>
            
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Overtime"}
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
        <Alert onClose={handleClose} severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateOverTime;