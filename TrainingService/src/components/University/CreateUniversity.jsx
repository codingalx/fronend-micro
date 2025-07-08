import {
    Box,
    Button,
    TextField,Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle
  } from "@mui/material";
  import * as yup from "yup";
  import useMediaQuery from "@mui/material/useMediaQuery";
  import { useNavigate } from "react-router-dom";
  import { Formik } from "formik";
  import Header from "../common/Header";
  import { createUniversity } from "../../../configuration/TrainingApi";
  import ToolbarComponent from "../TrainingCourse/ToolbarComponent";
  import LocationTrees from '../common/LocationTrees'
  import { useAtom } from 'jotai';
  import { authAtom } from 'shell/authAtom';
  import ListOfUniversity from './ListOfUniversity'
  import { useState } from "react";

  
  const CreateUniversity = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const navigate = useNavigate();
      const [authState] = useAtom(authAtom);
      const tenantId = authState.tenantId
        const [refreshKey, setRefreshKey] = useState(0);
        const [openDialog, setOpenDialog] = useState(false); 
        const [selectedLocation, setSelectedLocation] = useState({
          id: "",
          name: "",
        });

        



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

        await createUniversity(tenantId,data);
        resetForm();
        setRefreshKey(prev => prev + 1); 
      } catch (error) {
        console.error("Failed to submit form data:", error);
         setNotification({
                open: true,
                message: "Failed to create Country. Please try again.",
                severity: "error",
              });
      }
    };
  
    const handleIconClick = () => {
      navigate('/training/listUiversity');
    };
  
    const refreshPage = () => {
      window.location.reload();
    };
  
    const initialValues = {
      universityName: "",
      abbreviatedName: "",
      locationId: "",
      costPerPerson: "",
      mobilePhoneNumber: "",
      telephoneNumber: "",
      email: "",
      fax: "",
      website: "",
      remark: ""
    };

    
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

  
    const checkoutSchema = yup.object().shape({
        universityName: yup.string().required("University name cannot be blank"),
        abbreviatedName: yup.string().required("Abbreviated name cannot be blank"),
        costPerPerson: yup.number().nullable().required("Cost per person cannot be null"),
        mobilePhoneNumber: yup
          .string()
          .matches(/\+?[0-9. ()-]{7,25}/, "Invalid mobile phone number")
          .nullable(),
        telephoneNumber: yup
          .string()
          .matches(/\+?[0-9. ()-]{7,25}/, "Invalid telephone number")
          .required("Telephone number cannot be null"),
        email: yup.string().email("Invalid email address").nullable(),
        fax: yup
          .string()
          .matches(/\+?[0-9. ()-]{7,25}/, "Invalid fax number")
          .nullable(),
      });
  
    return (
      <Box m="20px">
        <ToolbarComponent
          mainIconType="search"
          onMainIconClick={handleIconClick}
          refreshPage={refreshPage}
        />
        <Header subtitle="Create University for Entern" />
  
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
            setFieldValue,
            resetForm,
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
                  label="University"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.universityName}
                  name="universityName"
                  error={!!touched.universityName && !!errors.universityName}
                  helperText={touched.universityName && errors.universityName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  type="text"
                  label="Abbreviated Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.abbreviatedName}
                  name="abbreviatedName"
                  error={!!touched.abbreviatedName && !!errors.abbreviatedName}
                  helperText={touched.abbreviatedName && errors.abbreviatedName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  type="text"
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
                  label="Mobile Phone Number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.mobilePhoneNumber}
                  name="mobilePhoneNumber"
                  error={!!touched.mobilePhoneNumber && !!errors.mobilePhoneNumber}
                  helperText={touched.mobilePhoneNumber && errors.mobilePhoneNumber}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  type="text"
                  label="Telephone Number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.telephoneNumber}
                  name="telephoneNumber"
                  error={!!touched.telephoneNumber && !!errors.telephoneNumber}
                  helperText={touched.telephoneNumber && errors.telephoneNumber}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
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
              <Box display="flex" justifyContent="center" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                   Submit
                </Button>
                <Button
                  type="button"
                  color="primary"
                  variant="contained"
                  onClick={() => resetForm()}
                  style={{ marginLeft: '10px' }}
                >
                  Reset
                </Button>
              </Box>
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
    
            </form>
          )}
               
        </Formik>
        <ListOfUniversity  refreshKey={refreshKey}/>

      </Box>
    );
  };
  
  export default CreateUniversity;
  