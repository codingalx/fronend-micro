import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
  Grid,
  useTheme,
  CardContent,
} from "@mui/material";
import * as yup from "yup";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import { updateTimeTolerance, getTimeToleranceById } from "../../Api/Attendance-Api";
import { useNavigate, useLocation } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import NoPageHandle from "../common/NoPageHandel";
import Header from "../Header";

const UpdateTimeTolerance = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const { toleranceId, name, shiftId } = location.state || {};

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({
    name: name || "",
    startTimeTolerance: "",
    endTimeTolerance: "",
    shiftId: "",
  });

  useEffect(() => {
    fetchToleranceData();
  }, []);

  const fetchToleranceData = async () => {
    try {
      const response = await getTimeToleranceById(toleranceId);
      setInitialValues({
        name: name || "",
        startTimeTolerance: response.data.startTimeTolerance,
        endTimeTolerance: response.data.endTimeTolerance,
        shiftId: response.data.shiftId,
      });
    } catch (error) {
      console.error("Error fetching Tolerance:", error.message);
      setNotification({
        open: true,
        message: "Failed to load Tolerance data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      await updateTimeTolerance(toleranceId, values);
      setNotification({
        open: true,
        message: "Tolerance updated successfully!",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/attendance/set_up", { state: { activeTab: 3 } }); 
      
        
      }, 1000);
    } catch (error) {
      console.error("Failed to update tolerance:", error);
      setNotification({
        open: true,
        message: "Failed to update tolerance. Please try again.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = yup.object().shape({
    startTimeTolerance: yup
      .number()
      .required("Start time tolerance is required")
      .min(0, "Must be a positive number")
      .typeError("Must be a number"),
    endTimeTolerance: yup
      .number()
      .required("End time tolerance is required")
      .min(0, "Must be a positive number")
      .typeError("Must be a number"),
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress size={60} />
      </Box>
    );
  }
  if (!toleranceId)
    {
  return (
    <NoPageHandle
      message="No Tolerance selected to update."
       navigateTo="/attendance/set_up" state={{ activeTab: 3 }}
    />
  );
}

  

  return (
    <Box m="20px">
      <Header  subtitle="update  time tolerance" />
     

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleFormSubmit}
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
                                      sx={{ gridColumn: "span 2" }}

                        fullWidth
                        label="Shift Name"
                        name="name"
                        variant="outlined"
                        InputProps={{ readOnly: true }}
                        value={values.name}
                      />

                      <TextField
                                      sx={{ gridColumn: "span 2" }}

                        fullWidth
                        label="Start Time Tolerance (minutes)"
                        name="startTimeTolerance"
                        type="number"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={values.startTimeTolerance}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.startTimeTolerance && Boolean(errors.startTimeTolerance)}
                        helperText={touched.startTimeTolerance && errors.startTimeTolerance}
                      />

                      <TextField
                        fullWidth
                                        sx={{ gridColumn: "span 2" }}

                        label="End Time Tolerance (minutes)"
                        name="endTimeTolerance"
                        type="number"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={values.endTimeTolerance}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.endTimeTolerance && Boolean(errors.endTimeTolerance)}
                        helperText={touched.endTimeTolerance && errors.endTimeTolerance}
                      />
                      </Box>
                 

                 
              <Box display="flex" justifyContent="start" mt="20px">
                <Button type="submit" color="secondary" variant="contained" startIcon={<EditIcon />} disabled={isSubmitting}>
                  {isSubmitting ? <CircularProgress size={24} /> : "Update Tolerance"}
                </Button>
              </Box>


                </form>

              )}
            </Formik>

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

export default UpdateTimeTolerance;