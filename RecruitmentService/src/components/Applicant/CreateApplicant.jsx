import React from "react";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik } from "formik";
import Header from '../common/Header'
import { Box, Button, TextField, MenuItem, Select, Typography,FormControl,InputLabel ,Snackbar,Alert ,FormHelperText  } from "@mui/material";
import { addApplicant,listAllCountry,listLocation } from "../../../configuration/RecruitmentApp";
import { useState,useEffect } from "react";
import ListApplicant from "./ListApplicant";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

const CreateApplicant = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const recruitmentId = location?.state?.id|| {};
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId

  const [allCountries, setAllCountries] = useState([]);
  const [locations, setLocations] = useState([]);

    const [notification, setNotification] = useState({
          open: false,
          message: "",
          severity: "success",
        });
        const handleCloseSnackbar = () => {
          setNotification({ 
            
            ...notification, open: false });
        };
      
        const [refreshKey, setRefreshKey] = useState(0);

  
  const initialValues = {
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    countryId: "",
    locationId: "",
    phoneNumber: "",
    email: "",
    poBox: "",
    recruitmentId: recruitmentId,
    officeTelephone: "",
    homeTelephone: "",
    houseNumber: "",
    skills: "",
    otherInformation: "",
    hobbies: "",
  };
  
    useEffect(() => {
      fetchCountries();
      fetchLocations();
    }, []);

    
      const fetchLocations = async () => {
        try {
          const response = await listLocation(tenantId);
          setLocations(response.data);
        } catch (error) {
          setError(error.message);
          setNotification({ open: true, message: "Failed to fetch location. Please try again.", severity: "error" });
        }
      };
      
  

  
  const fetchCountries = async () => {
    try {
      const response = await listAllCountry(tenantId);
      setAllCountries(response.data);
    } catch (error) {
      setNotification({ open: true, message: "Failed fetch the Title Name c. Please try again.", severity: "error" });
    }
  };

 

  const handleFormSubmit = async (values,{resetForm}) => {
    try {

      const response = await addApplicant(tenantId,values)
      console.log("Form data submitted successfully!");
        const recruitmentId = values.recruitmentId;
        setNotification({
          open: true,
          message: "Applicant created successfully!",
          severity: "success",
        });
        resetForm();
        setRefreshKey(prev => prev + 1); 
        
      } 
      catch (error) {
        console.error("Failed to submit form data:", error);
        setNotification({
          open: true,
          message: "Failed to create applicant. Please try again.",
          severity: "error",
        });
      }
   
  };

  const checkoutSchema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    middleName: yup.string().required("Middle Name is required"),
    lastName: yup.string().required("Last Name is required"),
    dateOfBirth: yup.date().required("Date of Birth is required").max(new Date(), "Date of Birth cannot be in the future"),
    gender: yup.string().required("Gender is required"),
    maritalStatus: yup.string().required("Marital Status is required"),
    countryId: yup.string().required("Nationality is required"),
    locationId: yup.string().required("Location  is required"),

    phoneNumber: yup.string().required("Phone Number is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    poBox: yup.string().required("PO Box is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create Applicant" />
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
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Middle Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.middleName}
                name="middleName"
                error={!!touched.middleName && !!errors.middleName}
                helperText={touched.middleName && errors.middleName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />



                <FormControl
                sx={{ gridColumn: "span 2" }}
                error={!!touched.countryId && !!errors.countryId}
              >
                <InputLabel id="country-label">Select Country</InputLabel>
                <Select
                  labelId="country-label"
                  value={values.countryId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="countryId"
                >
                  <MenuItem value="">
                    <em>Select Country</em>
                  </MenuItem>
                  {allCountries.map((country) => (
                    <MenuItem key={country.id} value={country.id}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
                {touched.countryId && errors.countryId && (
                  <FormHelperText>{errors.countryId}</FormHelperText>
                )}
              </FormControl>

              <TextField
                fullWidth
                type="date"
                label="Date of Birth"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dateOfBirth}
                name="dateOfBirth"
                error={!!touched.dateOfBirth && !!errors.dateOfBirth}
                helperText={touched.dateOfBirth && errors.dateOfBirth}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />
              <Select
                fullWidth
                label="Gender"
                value={values.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                name="gender"
                error={!!touched.gender && !!errors.gender}
                sx={{ gridColumn: "span 2" }}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  <em>Please Select Gender</em>
                </MenuItem>
                <MenuItem value="MALE">MALE</MenuItem>
                <MenuItem value="FEMALE">FEMALE</MenuItem>
              </Select>
              {touched.gender && errors.gender && (
                <Typography color="error" variant="body2">{errors.gender}</Typography>
              )}
              <Select
                fullWidth
                label="Marital Status"
                value={values.maritalStatus}
                onChange={handleChange}
                onBlur={handleBlur}
                name="maritalStatus"
                error={!!touched.maritalStatus && !!errors.maritalStatus}
                sx={{ gridColumn: "span 2" }}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  <em>Please Select Marital Status</em>
                </MenuItem>
                <MenuItem value="SINGLE">SINGLE</MenuItem>
                <MenuItem value="MARRIED">MARRIED</MenuItem>
                <MenuItem value="DIVORCED">DIVORCED</MenuItem>
              </Select>
              {touched.maritalStatus && errors.maritalStatus && (
                <Typography color="error" variant="body2">{errors.maritalStatus}</Typography>
              )}
           
              <TextField
                fullWidth
                type="number"
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
                type="number"
                label="PO Box"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.poBox}
                name="poBox"
                error={!!touched.poBox && !!errors.poBox}
                helperText={touched.poBox && errors.poBox}
                sx={{ gridColumn: "span 2" }}
              />
             
  

              <TextField
                fullWidth
                type="string"
                label="Hobbies"
                multiline
                rows={2}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.hobbies}
                name="hobbies"
                error={!!touched.hobbies && !!errors.hobbies}
                helperText={touched.hobbies && errors.hobbies}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="string"
                label="officeTelephone"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.officeTelephone}
                name="officeTelephone"
                error={!!touched.officeTelephone && !!errors.officeTelephone}
                helperText={touched.officeTelephone && errors.officeTelephone}
                sx={{ gridColumn: "span 2" }}
              />
      
              
                  <TextField
                fullWidth
                type="string"
                label="home Telephone"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.homeTelephone}
                name="homeTelephone"
                error={!!touched.homeTelephone && !!errors.homeTelephone}
                helperText={touched.homeTelephone && errors.homeTelephone}
                sx={{ gridColumn: "span 2" }}
              />

<TextField
                fullWidth
                type="text"
                label="House number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.houseNumber}
                name="houseNumber"
                error={!!touched.houseNumber && !!errors.houseNumber}
                helperText={touched.houseNumber && errors.houseNumber}
                sx={{ gridColumn: "span 2" }}
              />

                  <TextField
                fullWidth
                multiline
                rows={2}
                type="string"
                label="skills"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.skills}
                name="skills"
                error={!!touched.skills && !!errors.skills}
                helperText={touched.skills && errors.skills}
                sx={{ gridColumn: "span 2" }}
              />
                       <TextField
                fullWidth
                type="string"
                multiline
                rows={2}
                label="otherInformation"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.otherInformation}
                name="otherInformation"
                error={!!touched.otherInformation && !!errors.otherInformation}
                helperText={touched.otherInformation && errors.otherInformation}
                sx={{ gridColumn: "span 2" }}
              />
                    <FormControl  sx={{ gridColumn: "span 2" }}>
              <InputLabel id="locationId">Location</InputLabel>
                <Select
                  labelId="locationId"
                  value={values.locationId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  name="locationId"
                  error={!!touched.locationId && !!errors.locationId}
                >
                  <MenuItem value="">
                    <em>Select Location</em>
                  </MenuItem>
                  {locations.map((location) => (
                    <MenuItem key={location.id} value={location.id}>
                      {location.locationName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              
            </Box>

            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Applicant
              </Button>
            </Box>
          </form>
        )}
      </Formik>
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
      <ListApplicant   recruitmentId={recruitmentId} refreshKey={refreshKey} />


    </Box>
  );
};

export default CreateApplicant;
