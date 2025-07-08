import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Snackbar,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import LocationTrees from "../common/LocationTrees";
import {  getLocationById, getTrainingInstutionById, updateTrainingInstution } from '../../../configuration/TrainingApi';
import ToolbarComponent from "../common/ToolbarComponent";
import Header from '../common/Header';
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import LayoutForCourse  from '../TrainingCourse/LayoutForCourse'


const UpdateTrainingInstitution = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
      const location = useLocation();
    const instutionId = location?.state?.id;
    

  const [trainingInstitution, setTrainingInstitution] = useState({
    institutionName: "",
    locationId: "",
    costPerPerson: "",
    phoneNumber: "",
    email: "",
    fax: "",
    website: "",
    tinNumber: "",
    remark: "",
  });

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [openDialog, setOpenDialog] = useState(false); // Manage dialog visibility
  const [selectedLocation, setSelectedLocation] = useState({
    id: "",
    name: "",
  });

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  const handleLocationSelect = (id, name) => {
    setSelectedLocation({ id, name });
  };

  const handleSaveLocation = () => {
    if (!selectedLocation.id || !selectedLocation.name) {
      setNotification({
        open: true,
        message: "Please select a location before saving.",
        severity: "warning",
      });
      return;
    }
    setOpenDialog(false);
  };

  useEffect(() => {
    fetchTrainingInstitution();
  }, []);

  const fetchTrainingInstitution = async () => {
    try {
      const response = await getTrainingInstutionById(tenantId, instutionId);
      const data = response.data;
      setTrainingInstitution(data);

      if (data.locationId) {
        const locationResponse = await getLocationById(tenantId, data.locationId);
        const locationName = locationResponse.data.locationName;
        setSelectedLocation({ id: data.locationId, name: locationName });
      }
    } catch (error) {
      console.error("Failed to fetch institution:", error.message);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      if (!selectedLocation.id) {
        setNotification({
          open: true,
          message: "Please select a location before submitting.",
          severity: "warning",
        });
        return;
      }

      const data = {
        ...values,
        locationId: selectedLocation.id,
      };
      console.log("Data to be sent:", data);
      await updateTrainingInstution(tenantId, instutionId, data);
      resetForm();
       navigate('/training/trainingInstution');

    } catch (error) {
      console.error("Failed to update institution:", error);
      setNotification({
        open: true,
        message: "Failed to update institution.",
        severity: "error",
      });
    }
  };

  const checkoutSchema = yup.object().shape({
    institutionName: yup.string().required("Institution name is required"),
    costPerPerson: yup.number().required("Cost per person is required").positive(),
    tinNumber: yup.string().required("TIN number is required"),
    remark: yup.string().required("Remark is required"),
    email: yup.string().email("Invalid email address").required("Email is required"),
    fax: yup.string().matches(/^\+?[0-9. ()-]{7,25}$/, "Invalid fax number").notRequired(),
    phoneNumber: yup.string()
      .matches(/^\+?[0-9. ()-]{7,25}$/, "Invalid phone number")
      .required("Phone number is required"),
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <LayoutForCourse>
      <ToolbarComponent
        mainIconType="search"
        onMainIconClick={() => navigate('/training/ListTrainingInstitution')}
        refreshPage={() => window.location.reload()}
      />
      <Header subtitle="Update Training Institution" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={trainingInstitution}
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
          resetForm
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
                label="Institution Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.institutionName}
                name="institutionName"
                error={!!touched.institutionName && !!errors.institutionName}
                helperText={touched.institutionName && errors.institutionName}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="number"
                label="Cost Per Person"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.costPerPerson}
                name="costPerPerson"
                error={!!touched.costPerPerson && !!errors.costPerPerson}
                helperText={touched.costPerPerson && errors.costPerPerson}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="text"
                label="Phone Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phoneNumber}
                name="phoneNumber"
                error={!!touched.phoneNumber && !!errors.phoneNumber}
                helperText={touched.phoneNumber && errors.phoneNumber}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="email"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="text"
                label="Fax"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fax}
                name="fax"
                error={!!touched.fax && !!errors.fax}
                helperText={touched.fax && errors.fax}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="text"
                label="Website"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.website}
                name="website"
                error={!!touched.website && !!errors.website}
                helperText={touched.website && errors.website}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="text"
                label="TIN Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.tinNumber}
                name="tinNumber"
                error={!!touched.tinNumber && !!errors.tinNumber}
                helperText={touched.tinNumber && errors.tinNumber}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="text"
                label="Remark"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.remark}
                name="remark"
                error={!!touched.remark && !!errors.remark}
                helperText={touched.remark && errors.remark}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="text"
                label="Location Name"
                value={selectedLocation.name}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ gridColumn: "span 1" }}
              />
              <Button
                variant="outlined"
                color="primary"
                onClick={handleDialogOpen}
                sx={{ gridColumn: "span 1" }}
              >
                +
              </Button>
            </Box>

            <Grid container spacing={3} justifyContent="center" style={{ marginBottom: 16 ,marginTop:16}}>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Save
                </Button>
              </Grid>
              
           
            </Grid>
          </form>
        )}
      </Formik>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Positioned at top-right
      >
        <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>

      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
        <DialogTitle>Select a Location</DialogTitle>
        <DialogContent>
          <LocationTrees
            onNodeSelect={(id, name) => handleLocationSelect(id, name)} // Pass selected node back
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveLocation} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </LayoutForCourse>
  );
};

export default UpdateTrainingInstitution;

// import {
//     Box,
//     Button,
//     TextField,
//   } from "@mui/material";
//   import * as yup from "yup";
//   import useMediaQuery from "@mui/material/useMediaQuery";
//   import { useNavigate } from "react-router-dom";
//   import { Formik } from "formik";
//   import LocationTress from '../common/LocationTrees'
//   import {  getLocationById, getTrainingInstutionById, updateTrainingInstution } from "../../../configuration/TrainingApi";
//   import ToolbarComponent from "../common/ToolbarComponent";
//   import LayoutForCourse from "../TrainingCourse/LayoutForCourse";
//   import Header from "../common/Header";
// import { useLocation } from "react-router-dom";
// import { useState,useEffect } from "react";
// import { useAtom } from 'jotai';
// import { authAtom } from 'shell/authAtom';

  
//   const UpdateTrainingInstution = () => {
//     const isNonMobile = useMediaQuery("(min-width:600px)");
//     const navigate = useNavigate();
//     const location = useLocation();
//     const instutionId = location?.state?.id;
//         const [authState] = useAtom(authAtom);
//         const tenantId = authState.tenantId

//     const [trainingInstution, setTrainingInstution] = useState({ 
//         institutionName: "",
//         locationId: "",
//         costPerPerson: "",
//         phoneNumber: "",
//         email: "",
//         fax: "",
//         website: "",
//         tinNumber: "",
//         remark: ""
//       });

   
  

//     const handleIconClick = () => {
//         navigate('/training/ListTrainingInstution');
        
//       };
    
  
//     const refreshPage = () => {
//       window.location.reload();
//     };

//     useEffect(() => {
//         fetchTrainingInstution();
//       }, []);
    
//       const fetchTrainingInstution = async () => {
//         try {
//           const response = await getTrainingInstutionById(tenantId,instutionId);
//           const data = response.data; 
//           setTrainingInstution(data);

//                      if (data.locationId) {
//                     const locationResponse = await getLocationById(tenantId, data.locationId);
//                     const locationName = locationResponse.data.locationName; 
//                     setSelectedDepartment({ id: data.locationId, name: locationName });
//                   }
//         } catch (error) {
//           console.error("Failed to fetch language:", error.message);
//         }
//       };
  
//       const handleCourseFormSubmit = async (values, { resetForm }) => {
//         try {
        
//           const response = await updateTrainingInstution(tenantId,instutionId, values);
          
//           console.log("Update response:", response);
      
//           if (response.status === 200) {           
//             resetForm();
//             navigate('/training/ListTrainingInstution');
            
//             console.log("Instution training is  successfully upfated !");

//           } else {
//             console.error("Failed to update course: Unexpected response status", response.status);
//           }
//         } catch (error) {
//           console.error("Failed to update course:", error);
//         }
//       };
      
    


   
//     const checkoutSchema = yup.object().shape({
//       institutionName: yup.string().required("Institution name is required"),
//       locationId: yup.number().required("Location ID is required").positive().integer(),
//       costPerPerson: yup.number().required("Cost per person is required").positive(),
//       tinNumber: yup.string().required("TIN number is required"),
//       remark: yup.string().required("Remark is required"),
//       email: yup.string().email("Invalid email address").required("Email is required"),
//       fax: yup.string().matches(/^\+?[0-9. ()-]{7,25}$/, "Invalid fax number").notRequired(),
     
//       phoneNumber: yup.string()
//         .matches(/^\+?[0-9. ()-]{7,25}$/, "Invalid phone number")
//         .required("Phone number is required"),
//     });
  
//     return (
//       <LayoutForCourse>
//         <ToolbarComponent
//           mainIconType="search"
//           onMainIconClick={handleIconClick}
//           refreshPage={refreshPage}
//         />
//                <Header  subtitle="Update Training Instution" />

  
//         <Formik
//           onSubmit={handleCourseFormSubmit}
//           initialValues={trainingInstution}
//           validationSchema={checkoutSchema}
//           enableReinitialize
//         >
//           {({
//             values,
//             errors,
//             touched,
//             handleBlur,
//             handleChange,
//             handleSubmit,
//             resetForm
//           }) => (
//             <form onSubmit={handleSubmit}>
//               <Box
//                 display="grid"
//                 gap="30px"
//                 gridTemplateColumns="repeat(4, minmax(0, 1fr))"
//                 sx={{
//                   "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
//                 }}
//               >
//                 <TextField
//                   fullWidth
//                   type="text"
//                   label="Institution Name"
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   value={values.institutionName}
//                   name="institutionName"
//                   error={!!touched.institutionName && !!errors.institutionName}
//                   helperText={touched.institutionName && errors.institutionName}
//                   sx={{ gridColumn: "span 2" }}
//                 />
  
//                 <TextField
//                   fullWidth
//                   type="number"
//                   label="Cost Per Person"
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   value={values.costPerPerson}
//                   name="costPerPerson"
//                   error={!!touched.costPerPerson && !!errors.costPerPerson}
//                   helperText={touched.costPerPerson && errors.costPerPerson}
//                   sx={{ gridColumn: "span 2" }}
//                 />
  
//                 <TextField
//                   fullWidth
//                   type="text"
//                   label="Phone Number"
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   value={values.phoneNumber}
//                   name="phoneNumber"
//                   error={!!touched.phoneNumber && !!errors.phoneNumber}
//                   helperText={touched.phoneNumber && errors.phoneNumber}
//                   sx={{ gridColumn: "span 2" }}
//                 />
  
//                 <TextField
//                   fullWidth
//                   type="email"
//                   label="Email"
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   value={values.email}
//                   name="email"
//                   error={!!touched.email && !!errors.email}
//                   helperText={touched.email && errors.email}
//                   sx={{ gridColumn: "span 2" }}
//                 />
  
//                 <TextField
//                   fullWidth
//                   type="text"
//                   label="Fax"
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   value={values.fax}
//                   name="fax"
//                   error={!!touched.fax && !!errors.fax}
//                   helperText={touched.fax && errors.fax}
//                   sx={{ gridColumn: "span 2" }}
//                 />
  
//                 <TextField
//                   fullWidth
//                   type="text"
//                   label="Website"
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   value={values.website}
//                   name="website"
//                   error={!!touched.website && !!errors.website}
//                   helperText={touched.website && errors.website}
//                   sx={{ gridColumn: "span 2" }}
//                 />
  
//                 <TextField
//                   fullWidth
//                   type="text"
//                   label="TIN Number"
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   value={values.tinNumber}
//                   name="tinNumber"
//                   error={!!touched.tinNumber && !!errors.tinNumber}
//                   helperText={touched.tinNumber && errors.tinNumber}
//                   sx={{ gridColumn: "span 2" }}
//                 />
  
//                 <TextField
//                   fullWidth
//                   type="text"
//                   label="Remark"
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   value={values.remark}
//                   name="remark"
//                   error={!!touched.remark && !!errors.remark}
//                   helperText={touched.remark && errors.remark}
//                   sx={{ gridColumn: "span 2" }}
//                 />
  
//                 <LocationTress
//                   name="locationId"
//                   handleSelect={(selectedLocationId) =>
//                     handleChange({
//                       target: { name: 'locationId', value: selectedLocationId },
//                     })
//                   }
//                 />
//               </Box>
//               <Grid container spacing={3} justifyContent="center" style={{ marginBottom: 16 }}>
//                 <Grid item xs={12} md={3}>
//                   <Button
//                     fullWidth
//                     variant="contained"
//                     color="primary"
//                     type="submit"
//                   >
//                     Save
//                   </Button>
//                 </Grid>
//                 <Grid item xs={12} md={3}>
//                   <Button
//                     fullWidth
//                     variant="contained"
//                     color="primary"
//                     type="button"
//                     onClick={() => resetForm()}
//                   >
//                     Reset
//                   </Button>
//                 </Grid>
//               </Grid>
//             </form>
//           )}
//         </Formik>
//       </LayoutForCourse>
//     );
//   };
  
//   export default UpdateTrainingInstution;
  