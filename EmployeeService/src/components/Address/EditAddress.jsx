import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,Alert
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import Header from "../common/Header";
import { getAddressById, listLocation, updateAddress } from "../../Api/employeeApi";
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom"; // Adjust the import based on your structure
import NotFoundHandle from "../common/NotFoundHandle";


const EditAddress = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const [locations, setLocations] = useState([]);
    const [authState] = useAtom(authAtom); 
    const tenantId = authState.tenantId
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  
  const { employerId  } = location.state;
  const addressId =location?.state?.id

  if (!(id && employerId)) {
    return <NotFoundHandle message="No address selected for updation." navigateTo="/employee/list" />;
  }

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  

  const [address, setAddress] = useState({ 
    addressType: "",
    locationId:"",
    houseNumber: "",
    homeTelephone: "",
    officeTelephone: "",
    email: "",
    mobileNumber:"",
    poBox:"",
  });

  useEffect(() => {
    fetchAddress();
    fetchLocations();
  }, []);

  const fetchAddress = async () => {
    try {
      const response = await getAddressById(tenantId,employerId,addressId);
      const data = response.data; 
      if (data.addressType) {
        data.addressType = data.addressType.toUpperCase();
       
      }
      setAddress(data);

    } catch (error) {
      setNotification({ open: true, message: "Failed to fetch address. Please try again.", severity: "error" });
    }
  };
  
  const fetchLocations = async () => {
    try {
      const response = await listLocation(tenantId);
      const data = response.data;
      setLocations(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching locations:', error.message);
    }
  };

  
  const handleFormSubmit = async (values) => {
    try {
      const response = await updateAddress(tenantId,employerId, addressId, values);
      const id =employerId ;
  
      if (response.status === 200) {
        // Success notification
        setNotification({ open: true, message: "Employee address updated successfully!", severity: "success" });
        setTimeout(() =>{
          navigate('/employee/editDetails', { state: { id, isEditable: true,activeTab: 7 } }); 
        },200)
        
      } else {
        // Handle unexpected response status
        setNotification({ open: true, message: `Error updating address. Status code: ${response.status}`, severity: "error" });
        console.error('Error updating address. Status code:', response.status);
      }
    } catch (error) {
      // Handle errors from the server and network errors
      if (error.response) {
        // Server error with response data
        const serverMessage = error.response.data.message || "Server responded with an error.";
        setNotification({ open: true, message: `Failed to update address: ${serverMessage}`, severity: "error" });
        console.error('Server responded with an error:', error.response.data);
      } else {
        // Network or other unexpected error
        setNotification({ open: true, message: "Failed to update address. Please check your connection and try again.", severity: "error" });
        console.error('Error updating address:', error.message);
      }
    }
  };
  



  const checkoutSchema = yup.object().shape({
    addressType: yup.string().required("addressType  is required"),
    locationId: yup.string().required("locationId  is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    mobileNumber: yup.string().matches(/^\d{10}$/, "Invalid phone number").required("Phone number cannot be blank"),
   
  });


  return (
    <Box m="20px">
      <Header
      
        subtitle="Update Address of employer"
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={address}
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
                "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
              }}
            >
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

              
              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel>Please Select Address for</InputLabel>
                <Select
                label="Address For"
                value={values.addressType}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                required
                displayEmpty
                inputProps={{ "aria-label": "addressType" }}
                name="addressType"
                error={!!touched.addressType && !!errors.addressType}
                helperText={touched.addressType && errors.addressType}
                sx={{ gridColumn: "span 2" }}
              >
               <MenuItem value="PERMANENT">permanent</MenuItem>
                <MenuItem value="TEMPORARY">temporary</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="text"
                label="House Number"
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
                type="text"
                label="Home Phone"
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
                label="Office Telephone"
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
                type="text"
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
                label="Mobile Phone"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.mobileNumber}
                name="mobileNumber"
                error={!!touched.mobileNumber && !!errors.mobileNumber}
                helperText={touched.mobileNumber && errors.mobileNumber}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="P.O.Box"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.poBox}
                name="poBox"
                error={!!touched.poBox && !!errors.poBox}
                helperText={touched.poBox && errors.poBox}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px" gap='20px' >
              <Button type="submit" color="secondary" variant="contained">
                Update 
              </Button>

               <Button
                   type="submit" color="secondary" variant="contained"  
                 onClick={() => navigate(`/employee/AddressAction`,{ state: { employerId } })}
                 
                >
                  Cancel
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
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Positioned at top-right
      >
        <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditAddress;
