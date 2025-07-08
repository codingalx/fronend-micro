import React, { useEffect, useState } from "react";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import {
  getEmployeeImageById,
  updateEmployee,
  listJobRegestration,
  listAllCountry,
  listDutyStation,
  listTitleName,
  listDepartement,
  listPayGrade,
  getEmployeeById,
  listAllShifts,
  getDepartementById,
} from "../../Api/employeeApi";

import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogContent,
  DialogTitle,
  FormHelperText,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";

import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom"; // Adjust the import based on your structure

import DepartementTree from "../common/DepartementTree";
import NotFoundHandle from "../common/NotFoundHandle";

const EditEmployee = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const [shiftTime, setShiftTime] = useState([]);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [authState] = useAtom(authAtom); // Access the shared authentication state
  const tenantId = authState.tenantId;
  const [openDialog, setOpenDialog] = useState(false); // Manage dialog visibility
  const [selectedDepartment, setSelectedDepartment] = useState({
    id: "",
    name: "",
  }); // State for selected department

  const { id, isEditable } = location.state || {};

  if (!id) {
    return (
      <NotFoundHandle
        message="No Employee selected for updation."
        navigateTo="/employee/list"
      />
    );
  }

  const [employee, setEmployee] = useState({
    employeeId: "",
    // departmentId: "",
    titleNameId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    employmentType: "",
    payGradeId: "",
    jobId: "",
    hiredDate: "",
    endDate: "",
    faydaNumber: "",
    passportNumber: "",
    tinNumber: "",
    pensionNumber: "",
    email: "",
    shiftId: "",
    profileImage: null,
    dutyStationId: "",
    countryId: "",
  });
  const [departments, setDepartments] = useState([]);
  const [jobRegistration, setJobRegistration] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [allTitleName, setAlltitleName] = useState([]);
  const [allPayGradeName, setAllPayGradeName] = useState([]);
  const [allDutyStaion, setDutyStation] = useState([]);
  const [allCountries, setAllCountries] = useState([]);

  useEffect(() => {
    fetchEmployee();
    fetchDepartments();
    fetchJobRegistrations();
    fetchImageOfEmployee();
    fetchAlltitleName();
    fetchAllPayGrade();
    fetchCountries();
    fetchAlldutyStation();
    fetchShiftTime();
  }, [id]);

  const fetchShiftTime = async () => {
    try {
      const response = await listAllShifts(tenantId);
      setShiftTime(response.data);
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed fetch the shift time c. Please try again.",
        severity: "error",
      });
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await listAllCountry(tenantId);
      setAllCountries(response.data);
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed fetch the Title Name c. Please try again.",
        severity: "error",
      });
    }
  };

  const fetchAlldutyStation = async () => {
    try {
      const response = await listDutyStation(tenantId);
      setDutyStation(response.data);
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed fetch the duty station c. Please try again.",
        severity: "error",
      });
    }
  };

  const fetchEmployee = async () => {
    try {
      if (!id) {
        return (
          <NotFoundHandle
            message="No Employee selected for updation."
            navigateTo="/employee/list"
          />
        );
      }

      const response = await getEmployeeById(tenantId, id);
      const data = response.data;
      setEmployee({
        ...data,
        profileImage: null, // Clear existing profile image state if needed
      });

      if (data.departmentId) {
        const departmentResponse = await getDepartementById(
          tenantId,
          data.departmentId
        );
        const departmentName = departmentResponse.data.departmentName;
        setSelectedDepartment({ id: data.departmentId, name: departmentName });
      }
    } catch (error) {
      console.error("Failed to fetch employee:", error.message);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await listDepartement(tenantId);
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchJobRegistrations = async () => {
    try {
      const response = await listJobRegestration(tenantId);
      setJobRegistration(response.data);
    } catch (error) {
      console.error("Error fetching job-registrations:", error);
    }
  };

  const fetchAllPayGrade = async () => {
    try {
      const response = await listPayGrade(tenantId);
      setAllPayGradeName(response.data);
    } catch (error) {
      console.error("Error fetching titleName:", error);
    }
  };

  const fetchImageOfEmployee = async () => {
    try {
      if (!id) {
        return (
          <NotFoundHandle
            message="No Employee selected for updation."
            navigateTo="/employee/list"
          />
        );
      }
      const imageUrl = await getEmployeeImageById(tenantId, id); // Await the promise here
      setImagePreview(imageUrl); // This sets the image preview in the state
    } catch (error) {
      console.error("Failed to fetch Employee Image:", error.message);
    }
  };

  const fetchAlltitleName = async () => {
    try {
      const response = await listTitleName(tenantId);
      setAlltitleName(response.data);
    } catch (error) {
      console.error("Error fetching titleName:", error);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    // Ensure selectedDepartment is defined before adding its ID
    if (!selectedDepartment.id) {
      setNotification({
        open: true,
        message: "Please select a department before submitting.",
        severity: "warning",
      });
      return; // Prevent further submission if no department is selected
    }
  
    const formValues = {
      ...values,
      departmentId: selectedDepartment.id, // Include selected department ID
    };
  
    try {
      // Create FormData object to handle multipart data
      const formData = new FormData();
      formData.append(
        "employee",
        new Blob([JSON.stringify(formValues)], { type: "application/json" })
      );
      formData.append("profileImage", employee.profileImage);
  
      // Log formData entries for debugging
      console.log('FormData entries:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
  
      // Submit form data to the server
      const response = await updateEmployee(tenantId, id, formData);
  
      if (response.status === 200) {
        resetForm(); // Reset the form after successful update
        setNotification({
          open: true,
          message: "Employee updated successfully!",
          severity: "success",
        });
        navigate(`/employee/list`); // Navigate to the employee list
      } else {
        // Handle case where response status is not 200
        setNotification({
          open: true,
          message: "Failed to update employee. Please try again.",
          severity: "error",
        });
      }
    } catch (error) {
      let errorMessage = "Failed to update employee. Please try again.";
  
      // Check for response errors from the server
      if (error.response) {
        console.error("Error response:", error.response.data); // Log the error response
        errorMessage = error.response.data.message || errorMessage; // Adjust based on your error response structure
      } else {
        console.error("Error:", error.message); // Log any other errors
      }
  
      // Display error message in notification
      setNotification({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };
  const handleDialogOpen = () => setOpenDialog(true);

  const handleDialogClose = () => setOpenDialog(false);

  const handleDepartmentSelect = (id, name) => {
    setSelectedDepartment({ id, name }); // Update selected department
  };

  const handleSaveDepartment = () => {
    if (!selectedDepartment.id || !selectedDepartment.name) {
      setNotification({
        open: true,
        message: "Please select a department before saving.",
        severity: "warning",
      });
      return;
    }
    setOpenDialog(false); // Close the dialog
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      profileImage: file,
    }));
    setImagePreview(URL.createObjectURL(file)); // Update image preview when a new file is selected
  };

   const checkoutSchema = yup.object().shape({
     employeeId: yup
       .string()
       .required("Employee ID cannot be blank"),
     
     email: yup
       .string()
       .email("Must be a valid email")
       .required("Email cannot be blank"),
       
 
     payGradeId: yup.string().required("Pay Grade Name cannot be blank"),
     shiftId: yup.string().required("shift Time cannot be blank"),
     firstName: yup.string().required("First name cannot be blank"),
     middleName: yup.string().required("Middle name cannot be blank"),
     lastName: yup.string().required("Last name cannot be blank"),
     gender: yup.string().required("Gender cannot be null"),
     dateOfBirth: yup
       .date()
       .required("Date of birth is required")
       .max(new Date(), "Date of birth must be in the past")
       .typeError("Date of birth must be a valid date"),
     maritalStatus: yup.string().required("Marital status cannot be null"),
     employmentType: yup.string().required("Employment type cannot be null"),
     hiredDate: yup
       .date()
       .required("Hired date cannot be null")
       .max(new Date(), "Hired date must be in the past or present")
       .typeError("Hired date must be a valid date"),
    //  endDate: yup
    //    .date()
    //    .min(new Date(), "End date must be in the future or present")
    //    .typeError("End date must be a valid date"),
 
       faydaNumber: yup
       .string()
       .min(12, "Fyda number must be at least 12 characters")
       .max(16, "Fyda number must be at most 16 characters")
       .required("Fyda number is required"),
     jobId: yup
       .string()
       .required("Job title cannot be null")
       .typeError("Job ID must be a number"),
   });

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <Box m="20px">
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={employee}
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
          <Form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": {
                  gridColumn: isNonMobile ? undefined : "span 4",
                },
              }}
            >
              <TextField
                fullWidth
                type="text"
                label="Employee ID"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.employeeId}
                name="employeeId"
                error={!!touched.employeeId && !!errors.employeeId}
                helperText={touched.employeeId && errors.employeeId}
                sx={{ gridColumn: "span 2" }}
                InputProps={{ readOnly: !isEditable }}
              />

              <FormControl
                sx={{ gridColumn: "span 2" }}
                error={!!touched.titleNameId && !!errors.titleNameId}
              >
                <InputLabel id="language-label">Select Title Name</InputLabel>
                <Select
                  labelId="language-label"
                  value={values.titleNameId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="titleNameId"
                  disabled={!isEditable}
                >
                  <MenuItem value="">
                    <em>Select Title Name</em>
                  </MenuItem>
                  {allTitleName.map((title) => (
                    <MenuItem key={title.id} value={title.id}>
                      {title.titleName}
                    </MenuItem>
                  ))}
                </Select>
                {touched.titleNameId && errors.titleNameId && (
                  <FormHelperText>{errors.titleNameId}</FormHelperText>
                )}
              </FormControl>

              <Box
                display="flex"
                alignItems="center"
                sx={{ gridColumn: "span 2" }}
              >
                <FormControl
                  sx={{ flexGrow: 1, flexShrink: 1, minWidth: 0 }}
                  error={!!touched.shiftId && !!errors.shiftId}
                >
                  <InputLabel id="shift-label">Select shift time</InputLabel>
                  <Select
                    labelId="shift-label"
                    value={values.shiftId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="shiftId"
                  >
                    <MenuItem value="">
                      <em>Select Shift time</em>
                    </MenuItem>
                    {shiftTime.map((shiftTime) => (
                      <MenuItem key={shiftTime.id} value={shiftTime.id}>
                        {shiftTime.name}
                      </MenuItem>
                    ))}
                  </Select>

                  {touched.shiftId && errors.shiftId && (
                    <FormHelperText>{errors.shiftId}</FormHelperText>
                  )}
                </FormControl>
              </Box>

              <FormControl sx={{ gridColumn: "span 2" }}>
                <InputLabel id="job-registration-label">
                  Job Registration
                </InputLabel>
                <Select
                  labelId="job-registration-label"
                  value={values.jobId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="jobId"
                  error={!!touched.jobId && !!errors.jobId}
                  disabled={!isEditable}
                >
                  <MenuItem value="">
                    <em>Select Job Registration</em>
                  </MenuItem>
                  {jobRegistration.map((job) => (
                    <MenuItem key={job.id} value={job.id}>
                      {job.jobTitle}
                    </MenuItem>
                  ))}
                </Select>
                <ErrorMessage name="jobId" component="div" />
              </FormControl>

              <FormControl
                sx={{
                  flexGrow: 1,
                  flexShrink: 1,
                  minWidth: 0,
                  gridColumn: "span 2",
                }}
                error={!!touched.payGradeId && !!errors.payGradeId}
              >
                <InputLabel id="language-label">
                  Select PayGrade Name
                </InputLabel>
                <Select
                  labelId="language-label"
                  value={values.payGradeId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="payGradeId"
                  fullWidth
                  disabled={!isEditable}
                >
                  <MenuItem value="">
                    <em>Select PayGrade Name</em>
                  </MenuItem>
                  {allPayGradeName.map((PayGrade) => (
                    <MenuItem key={PayGrade.id} value={PayGrade.id}>
                      {PayGrade.salary}
                    </MenuItem>
                  ))}
                </Select>
                {touched.payGradeId && errors.payGradeId && (
                  <FormHelperText>{errors.payGradeId}</FormHelperText>
                )}
              </FormControl>

              <FormControl sx={{ gridColumn: "span 2" }}>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  value={values.gender}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="gender"
                  error={!!touched.gender && !!errors.gender}
                  disabled={!isEditable}
                >
                  <MenuItem value="">
                    <em>Select Gender</em>
                  </MenuItem>
                  <MenuItem value="MALE">MALE</MenuItem>
                  <MenuItem value="FEMALE">FEMALE</MenuItem>
                </Select>
                <ErrorMessage name="gender" component="div" />
              </FormControl>

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
                InputProps={{ readOnly: !isEditable }}
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
                InputProps={{ readOnly: !isEditable }}
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
                InputProps={{ readOnly: !isEditable }}
              />

              <TextField
                fullWidth
                type="email"
                label="Enter Your Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
                InputProps={{ readOnly: !isEditable }}
              />

              <TextField
                fullWidth
                type="date"
                label="Date of Birth"
                InputLabelProps={{ shrink: true }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dateOfBirth}
                name="dateOfBirth"
                error={!!touched.dateOfBirth && !!errors.dateOfBirth}
                helperText={touched.dateOfBirth && errors.dateOfBirth}
                sx={{ gridColumn: "span 2" }}
                InputProps={{ readOnly: !isEditable }}
              />

              <TextField
                fullWidth
                type="date"
                label="Hired Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.hiredDate}
                name="hiredDate"
                error={!!touched.hiredDate && !!errors.hiredDate}
                helperText={touched.hiredDate && errors.hiredDate}
                sx={{ gridColumn: "span 2" }}
                InputProps={{ readOnly: !isEditable }}
              />

              <TextField
                fullWidth
                type="text"
                label="Passport Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.passportNumber}
                name="passportNumber"
                error={!!touched.passportNumber && !!errors.passportNumber}
                helperText={touched.passportNumber && errors.passportNumber}
                sx={{ gridColumn: "span 2" }}
                InputProps={{ readOnly: !isEditable }}
              />

              <TextField
                fullWidth
                type="text"
                label="Pension Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.pensionNumber}
                name="pensionNumber"
                error={!!touched.pensionNumber && !!errors.pensionNumber}
                helperText={touched.pensionNumber && errors.pensionNumber}
                sx={{ gridColumn: "span 2" }}
                InputProps={{ readOnly: !isEditable }}
              />

              <FormControl
                sx={{ gridColumn: "span 2" }}
                error={!!touched.dutyStationId && !!errors.dutyStationId}
              >
                <InputLabel id="duty-label">Select Duty station</InputLabel>
                <Select
                  labelId="duty station"
                  value={values.dutyStationId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="dutyStationId"
                  disabled={!isEditable}
                >
                  <MenuItem value="">
                    <em>Select Duty station</em>
                  </MenuItem>
                  {allDutyStaion.map((dutyStation) => (
                    <MenuItem key={dutyStation.id} value={dutyStation.id}>
                      {dutyStation.name}
                    </MenuItem>
                  ))}
                </Select>
                {touched.dutyStationId && errors.dutyStationId && (
                  <FormHelperText>{errors.dutyStationId}</FormHelperText>
                )}
              </FormControl>

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
                  disabled={!isEditable}
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
                type="text"
                label="Tin Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.tinNumber}
                name="tinNumber"
                error={!!touched.tinNumber && !!errors.tinNumber}
                helperText={touched.tinNumber && errors.tinNumber}
                sx={{ gridColumn: "span 2" }}
                InputProps={{ readOnly: !isEditable }}
              />

              <TextField
                fullWidth
                type="text"
                label="FYDA Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.faydaNumber}
                name="faydaNumber"
                error={!!touched.faydaNumber && !!errors.faydaNumber}
                helperText={touched.faydaNumber && errors.faydaNumber}
                sx={{ gridColumn: "span 2" }}
                InputProps={{ readOnly: !isEditable }}
              />
                <TextField
                fullWidth
                type="text"
                label="Department Name"
                value={selectedDepartment.name}
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


              <FormControl sx={{ gridColumn: "span 2" }}>
                <InputLabel id="employment-type-label">
                  Employment Type
                </InputLabel>
                <Select
                  labelId="employment-type-label"
                  value={values.employmentType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="employmentType"
                  error={!!touched.employmentType && !!errors.employmentType}
                  disabled={!isEditable}
                >
                  <MenuItem value="">
                    <em>Select Employment Type</em>
                  </MenuItem>
                  <MenuItem value="PERMANENT">PERMANENT</MenuItem>
                  <MenuItem value="CONTRACT">CONTRACT</MenuItem>
                </Select>
                <ErrorMessage name="employmentType" component="div" />
              </FormControl>

              {values.employmentType === "CONTRACT" && (
                <TextField
                  fullWidth
                  type="date"
                  label="End Date"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.endDate}
                  name="endDate"
                  error={!!touched.endDate && !!errors.endDate}
                  helperText={touched.endDate && errors.endDate}
                  sx={{ gridColumn: "span 2" }}
                  InputProps={{ readOnly: !isEditable }}
                />
              )}

              <FormControl sx={{ gridColumn: "span 2" }}>
                <InputLabel id="marital-status-label">
                  Marital Status
                </InputLabel>
                <Select
                  labelId="marital-status-label"
                  value={values.maritalStatus}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="maritalStatus"
                  error={!!touched.maritalStatus && !!errors.maritalStatus}
                  disabled={!isEditable}
                >
                  <MenuItem value="">
                    <em>Select Marital Status</em>
                  </MenuItem>
                  <MenuItem value="SINGLE">SINGLE</MenuItem>
                  <MenuItem value="MARRIED">MARRIED</MenuItem>
                  <MenuItem value="DIVORCED">DIVORCED</MenuItem>
                  <MenuItem value="WIDOWED">WIDOWED</MenuItem>
                  <MenuItem value="SEPARETED">SEPARETED</MenuItem>
                  <MenuItem value="OTHER">OTHER</MenuItem>
                </Select>
                <ErrorMessage name="maritalStatus" component="div" />
              </FormControl>

            
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                //sx={{ gridColumn: "span 4" }}
                sx={{ width: "100%" }}
              >
                <Box
                  width="100%"
                  height="200px"
                  sx={{
                    backgroundImage: `url(${imagePreview})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    marginBottom: "10px",
                  }}
                />
                <input
                  accept="image/*"
                  id="contained-button-file"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
                <label htmlFor="contained-button-file">
                  <Button
                    component="span"
                    sx={{ width: "100%" }}
                    disabled={!isEditable}
                  >
                    Change Profile Image
                  </Button>
                </label>
              </Box>

              <Box
                gridColumn="span 4"
                display="flex"
                justifyContent="center" // Center the buttons horizontally
              >
                {isEditable && (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mr: 2 }}
                  >
                    Update
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={() => navigate(`/employee/list`)}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Form>
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
        <DialogTitle>Select a Department</DialogTitle>
        <DialogContent>
          <DepartementTree
            onNodeSelect={(id, name) => handleDepartmentSelect(id, name)} // Pass selected node back
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveDepartment} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditEmployee;
