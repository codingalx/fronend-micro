import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { createAddress, listAddress } from "../../Api/employeeApi";
import { useEffect, useState } from "react";
import LocationTrees from "../common/LocationTrees";

import ListAddress from "./ListAddress";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom"; // Adjust the import based on your structure
import NotFoundHandle from "../common/NotFoundHandle";

const CreateAddress = ({ id }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); // Access the shared authentication state
  const tenantId = authState.tenantId;
  if (!id) {
    return <NotFoundHandle message="No employee selected for address creation." navigateTo="/employee/list" />;
  }
  const employerId = id;

 

 


  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [address, setAddress] = useState([]);

  const [refreshKey, setRefreshKey] = useState(0);

  const [openDialog, setOpenDialog] = useState(false); // Manage dialog visibility
  const [selectedLocation, setSelectedLocation] = useState({
    id: "",
    name: "",
  });

  const handleDialogOpen = () => setOpenDialog(true);

  const handleDialogClose = () => setOpenDialog(false);

  const handleLocationSelect = (id, name) => {
    setSelectedLocation({ id, name }); // Update selected department
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
    setOpenDialog(false); // Close the dialog
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      if (!selectedLocation.id) {
        setNotification({
          open: true,
          message: "Please select a location before submitting.",
          severity: "warning",
        });
        return; // Prevent further submission if no department is selected
      }

      const data = {
        ...values,
        locationId: selectedLocation.id,
      };
      console.log("Data to be sent:", data);

      const AddressExists = address.some(
        (address) => address.addressType === values.addressType
      );

      if (AddressExists) {
        setNotification({
          open: true,
          message: " Address Type already exists. Please use a different one.",
          severity: "warning",
        });
        return;
      }

      const response = await createAddress(tenantId, employerId, data);

      if (response.status === 201) {
        setNotification({
          open: true,
          message: "Employee address created successfully!",
          severity: "success",
        });

        setTimeout(() => {
          setRefreshKey((prev) => prev + 1);
          resetForm();
        }, 200);
      } else {
        // Handle unexpected response status
        setNotification({
          open: true,
          message: `Error creating address. Status code: ${response.status}`,
          severity: "error",
        });
        console.error("Error creating address. Status code:", response.status);
      }
    } catch (error) {
      // Handle errors from the server and network errors
      if (error.response) {
        // Server error with response data
        const serverMessage =
          error.response.data.message || "Server responded with an error.";
        setNotification({
          open: true,
          message: `Failed to create address: ${serverMessage}`,
          severity: "error",
        });
        console.error("Server responded with an error:", error.response.data);
      } else {
        // Network or other unexpected error
        setNotification({
          open: true,
          message:
            "Failed to create address. Please check your connection and try again.",
          severity: "error",
        });
        console.error("Error create address:", error.message);
      }
    }
  };

  useEffect(() => {
    // fetchLocations();
    fetchAllAddress();
  }, []);

  const fetchAllAddress = async () => {
    try {
      const response = await listAddress(tenantId,employerId);
      setAddress(response.data);
    } catch (error) {
      setError(error.message);
      setNotification({
        open: true,
        message: "Failed to fetch address. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const initialValues = {
    addressType: "",
    // locationId:"",
    houseNumber: "",
    homeTelephone: null,
    officeTelephone: null,
    email: "",
    mobileNumber: "",
    poBox:  null,
  };

  const checkoutSchema = yup.object().shape({
    addressType: yup.string().required("addressType  is required"),
    // locationId: yup.string().required("location  is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    mobileNumber: yup
      .string()
      .matches(/^\d{10}$/, "Invalid phone number")
      .required("Phone number cannot be blank"),
  });

  return (
    <Box m="20px">
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
              {/* <FormControl  sx={{ gridColumn: "span 2" }}>
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
              </FormControl> */}

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
                value={values.pobox}
                name="pobox"
                error={!!touched.pobox && !!errors.pobox}
                helperText={touched.pobox && errors.pobox}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Adress
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

      <ListAddress employerId={employerId} refreshKey={refreshKey} />
    </Box>
  );
};

export default CreateAddress;
