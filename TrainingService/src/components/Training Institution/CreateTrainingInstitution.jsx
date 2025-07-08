import {
 Box,
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Grid,
  Snackbar,
  Alert,


} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import LocationTrees from "../common/LocationTrees";
import { addTrainingInstution } from '../../../configuration/TrainingApi'
import ToolbarComponent from "../common/ToolbarComponent";
import LayoutForCourse from "../TrainingCourse/LayoutForCourse";
import Header from '../common/Header'
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import { useState } from "react";
import { ListAltRounded } from "@mui/icons-material";
import ListTrainingInstution from "./ListTrainingInstution";






const CreateTrainingInstitution = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom);
  
  const tenantId = authState.tenantId
    const [refreshKey, setRefreshKey] = useState(0);
  
  const initialValues = {
    institutionName: "",
    locationId: "",
    costPerPerson: "",
    phoneNumber: "",
    email: "",
    fax: "",
    website: "",
    tinNumber: "",
    remark: ""
  };

    const [openDialog, setOpenDialog] = useState(false); 
    const [selectedLocation, setSelectedLocation] = useState({
      id: "",
      name: "",
    });

     const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

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



  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const handleIconClick = () => {
    navigate('/training/ListTrainingInstution');
  };

  const refreshPage = () => {
    window.location.reload();
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

      await addTrainingInstution(tenantId,data);
      resetForm();  
      setRefreshKey(prev => prev + 1); 
    } catch (error) {
      console.error("Failed to create course:", error);
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

  return (
    <LayoutForCourse >
      <ToolbarComponent
        mainIconType="search"
        onMainIconClick={handleIconClick}
        refreshPage={refreshPage}
      />
      <Header  subtitle="Create Training Instution" />


      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
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
            <Grid container spacing={3} justifyContent="center" style={{ marginBottom: 16,marginTop:16 }}>
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
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="button"
                  onClick={() => resetForm()}
                >
                  Reset
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
    <ListTrainingInstution  refreshKey={refreshKey}/>

    </LayoutForCourse>

  );
};

export default CreateTrainingInstitution;




// import {
//     Box,
//     Button,
//     TextField,
//     Grid,
//   } from "@mui/material";
//   import * as yup from "yup";
//   import useMediaQuery from "@mui/material/useMediaQuery";
//   import { useNavigate } from "react-router-dom";
//   import { Formik } from "formik";
//   import LocationTress from "../../Employee/LocationTress";
//   import { addTrainingInstution } from '../../../configuration/TrainingApi'
//   import ToolbarComponent from "../common/ToolbarComponent";
//   import Header from '../common/Header'
//   import { useAtom } from 'jotai';
// import { authAtom } from 'shell/authAtom';





//   const CreateTrainingInstitution = () => {
//     const isNonMobile = useMediaQuery("(min-width:600px)");
//     const navigate = useNavigate();
//     const initialValues = {
//       institutionName: "",
//       locationId: "",
//       costPerPerson: "",
//       phoneNumber: "",
//       email: "",
//       fax: "",
//       website: "",
//       tinNumber: "",
//       remark: ""
//     };

//     const [authState] = useAtom(authAtom);
//     const tenantId = authState.tenantId
  
//     const handleIconClick = () => {
//       navigate('/training/ListTrainingInstution');
//     };
  
//     const refreshPage = () => {
//       window.location.reload();
//     };
  
//     const handleFormSubmit = async (values, { resetForm }) => {
//       try {
//         await addTrainingInstution(tenantId,values);
//         console.log("Course created successfully!");
//         resetForm();  
//       } catch (error) {
//         console.error("Failed to create course:", error);
//       }
//     };

   
//     const checkoutSchema = yup.object().shape({
//       institutionName: yup.string().required("Institution name is required"),
//       locationId: yup.string().required("Location name is required"),
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
//         <Header  subtitle="Create Training Instution" />

  
//         <Formik
//           onSubmit={handleFormSubmit}
//           initialValues={initialValues}
//           validationSchema={checkoutSchema}
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
  
//   export default CreateTrainingInstitution;
  