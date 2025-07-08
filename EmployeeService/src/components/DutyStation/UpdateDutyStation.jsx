import React, { useState,useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import Header from "../common/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { getDutyStationById ,listDutyStation,updateDutyStation} from "../../Api/employeeApi";
import NotFoundHandle from "../common/NotFoundHandle";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; // Adjust the import based on your structure



const UpdateDutyStation = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate()
  const [authState] = useAtom(authAtom); // Access the shared authentication state
  const tenantId = authState.tenantId
  const [allDutyStations, setAllDutyStations] = useState([]);



  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

   const location = useLocation();
   const { id } = location.state || {};

  

  const [dutyStation, setDutyStation] = useState({
    name: "",
    description: "",
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [refreshKey, setRefreshKey] = useState(0);

  const handleFormSubmit = async (values, { resetForm }) => {
    try {

      const dutyStationExists = allDutyStations.some(
        (station) => station.name === values.name && station.id !== id
      );

      if (dutyStationExists) {
        setNotification({
          open: true,
          message: "Duty station already exists. Please use a different one.",
          severity: "warning",
        });
        return;
      }

      await updateDutyStation(tenantId,id,values);
      setNotification({
        open: true,
        message: "duty station  updated successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey(prev => prev + 1); 
      navigate('/employee/duty_station'); //

    } 
    catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to update duty station . Please try again.",
        severity: "error",
      });
    }
  };

   useEffect(() => {
    fetchDutystation();
    fetchAllDutyStations();
      }, []);
  
      const fetchDutystation = async () => {
          try {
              const response = await getDutyStationById(tenantId,id);
              setDutyStation(response.data);
          } catch (error) {
              setError(error.message);
              console.error(error.message);
          }
      };


      const fetchAllDutyStations = async () => {
        try {
          const response = await listDutyStation(tenantId);
          setAllDutyStations(response.data);
        } catch (error) {
          console.error("Error fetching duty stations:", error.message);
        }
      };

 


  const checkoutSchema = yup.object().shape({
    name: yup.string().required("name is required"),
    description: yup.string().required("description is required"),
  });

  if (!id) {
    return <NotFoundHandle message="No duty station selected for updation." navigateTo="/employee/duty_station" />;
  }

  

 

  return (
    <Box m="20px">
      <Header subtitle= "Update Duty Station" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={dutyStation}
        validationSchema={checkoutSchema}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
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
                type="text"
                label="Country Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 2" }}
              />
            
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
          
    </Box>
  );
};

export default UpdateDutyStation;