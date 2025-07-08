import React, { useContext, useEffect, useState } from "react";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import Header from '../common/Header';
import { listAllCountry ,listDutyStation,listTitleName,listEmployee,createEmployee,getAllPaygradeByJobId,getJoblistByDepartementId,listDepartement, listAllShifts} from "../../Api/employeeApi";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,

  Grid,
  FormHelperText,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import DepartementTree from "../common/DepartementTree";
import { canAccessResource } from "../../Api/SecurityService";
import EmployeeServiceResourceName from "../../Api/EmployeeServiceResourceName";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; // Adjust the import based on your structure


const CreateEmployee = ({ onEmployeeCreated }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [open, setOpen] = React.useState(false);

   const [authState] = useAtom(authAtom); // Access the shared authentication state
  const userRoles = authState.roles
  const tenantId = authState.tenantId;
  

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchAlltitleName();
    fetchAllPayGrade();
    fetchAlldutyStation();
    fetchCountries();
    checkPermissions();
    fetchShiftTime();
  }, []);
  const [employeeData, setEmployeeData] = useState([]);

  const fetchEmployees = async () => {
    try {
      const response = await listEmployee(tenantId);
      
      // Assuming response is an array of employees
      if (Array.isArray(response)) {
        setEmployeeData(response);
      } else if (response.data && Array.isArray(response.data)) {
        // If response is an object with data property holding the employee array
        setEmployeeData(response.data);
      } else {
        // Handle cases where the response structure is unexpected
        setError("Unexpected response structure. Please try again.");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const [employee, setEmployee] = useState({
    employeeId: "",
    // departmentId: "",
    titleNameId: "",
    payGradeId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    employmentType: "",
    jobId: "",
    hiredDate: "",
    endDate: "",
    dutyStationId: "",
    countryId: "",
    faydaNumber: "",
    passportNumber: "",
    tinNumber: "",
    pensionNumber: "",
    email: "",
    shiftId:"",
    profileImage: null,
  });

  const [departments, setDepartments] = useState([]);
  const [jobRegistration, setJobRegistration] = useState([]);
  const [allTitleName, setAlltitleName] = useState([]);
  const [allPayGradeName, setAllPayGradeName] = useState([]);
  const [shiftTime, setShiftTime] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [allCountries, setAllCountries] = useState([]);
  const [allDutyStaion, setDutyStation] = useState([]);
  const [canAddCountry, setCanAddCountry] = useState(false);
  const [canAddDutyStation, SetcanAdddutyStation] = useState(false);
  const [canAddTitleName, canAddtitleName] = useState(false);

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [openDialog, setOpenDialog] = useState(false); // Manage dialog visibility
  const [selectedDepartment, setSelectedDepartment] = useState({
    id: "",
    name: "",
  }); // State for selected department

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

  const handleCountry = () => {
    navigate("/employee/country");
  };

  const handleDutyStation = () => {
    navigate("/employee/duty_station");
  };

  const handleTitleName = () => {
    navigate("/employee/title_name");
  };

   

  const checkPermissions = async () => {
    setCanAddCountry(await canAccessResource(EmployeeServiceResourceName.ADD_COUNTRY, userRoles));
    SetcanAdddutyStation(await canAccessResource(EmployeeServiceResourceName.ADD_DUTY_STATION, userRoles));
    canAddtitleName(await canAccessResource(EmployeeServiceResourceName.ADD_TITLE_NAME, userRoles));
  };
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

  const fetchDepartments = async () => {
    try {
      const response = listDepartement(tenantId);
      setDepartments(response.data);
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed fetch the Departement c. Please try again.",
        severity: "error",
      });
    }
  };

  const fetchAlltitleName = async () => {
    try {
      const response = await listTitleName(tenantId);
      setAlltitleName(response.data);
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

  useEffect(() => {
    if (selectedDepartment.id) {
      fetchJobRegistrations();
    }
  }, [selectedDepartment.id]);

  const fetchJobRegistrations = async () => {
    try {
      const response = await getJoblistByDepartementId(tenantId,selectedDepartment.id);
      setJobRegistration(response.data);
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to fetch the job registration. Please try again.",
        severity: "error",
      });
    }
  };

  const fetchAllPayGrade = async (payGradeId) => {
    if (!payGradeId) {
      return;
    }
    try {
      const response = await getAllPaygradeByJobId(tenantId,payGradeId);
      setAllPayGradeName(response.data);
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed fetch the  Salary c. Please try again.",
        severity: "error",
      });
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
;

  const employeeIdExists = employeeData.some(
    (employee) => employee.employeeId === values.employeeId
);

if (employeeIdExists) {
  setNotification({
      open: true,
      message: " Employee Id already exists. Please use a different one.",
      severity: "warning",
  });
  return;
}

  // Check if email already exists
  const emailExists = employeeData.some(
    (employee) => employee.email === values.email
  );

  if (emailExists) {
    setNotification({
      open: true,
      message: "Email already exists. Please use a different one.",
      severity: "warning",
    });
    return;
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

      // Submit form data to the server
      const response = await createEmployee(tenantId,formData);

      if (response.status === 201) {
        resetForm();
        setNotification({
          open: true,
          message: "Employee created successfully!",
          severity: "success",
        });
        if (onEmployeeCreated) onEmployeeCreated(response.data.id);
      } else {
        // Handle case where response status is not 201
        setNotification({
          open: true,
          message: "Failed to create employee. Please try again.",
          severity: "error",
        });
      }
    } catch (error) {
      let errorMessage = "Failed to create employee. Please try again.";

      // Check for response errors from the server
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage; // Adjust based on your error response structure
      } else {
        errorMessage = "An unexpected error occurred. Please try again.";
      }

      // Display error message in notification
      setNotification({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };
  

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      profileImage: file,
    }));
    setImagePreview(URL.createObjectURL(file));
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
    endDate: yup
      .date()
      .min(new Date(), "End date must be in the future or present")
      .typeError("End date must be a valid date"),

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

  const handleIconClick = () => {
    navigate(`/employee/list`);
  };

  const refreshPage = () => {
    window.location.reload();
  };

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={employee}
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
          <Form onSubmit={handleSubmit}>
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
                label="Employee ID"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.employeeId}
                name="employeeId"
                error={!!touched.employeeId && !!errors.employeeId}
                helperText={touched.employeeId && errors.employeeId}
                sx={{ gridColumn: "span 2" }}
              />

              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel>Please Select Gender</InputLabel>
                <Select
                  label="Gender"
                  value={values.gender}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "gender" }}
                  error={!!touched.gender && !!errors.gender}
                  name="gender"
                  sx={{ gridColumn: "span 2" }}
                >
                  <MenuItem value="MALE">Male</MenuItem>
                  <MenuItem value="FEMALE">Female</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                type="text"
                label="Firs Name"
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
              />

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
                >
                  <MenuItem value="">
                    <em>Select Marital Status</em>
                  </MenuItem>
                  <MenuItem value="SINGLE">Single</MenuItem>
                  <MenuItem value="MARRIED">Married</MenuItem>
                  <MenuItem value="DIVORCED">Divorced</MenuItem>
                  <MenuItem value="WIDOWED">Widowed</MenuItem>
                  <MenuItem value="SEPARATED">Separated</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
                <ErrorMessage name="maritalStatus" component="div" />
              </FormControl>

              <FormControl sx={{ gridColumn: "span 2" }}>
                <Select
                  label="Employment Type"
                  value={values.employmentType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "Employment Type" }}
                  name="employmentType"
                  error={!!touched.employmentType && !!errors.employmentType}
                  sx={{ gridColumn: "span 1" }}
                >
                  <MenuItem value="">
                    <em> Please Select Employment Type</em>
                  </MenuItem>

                  <MenuItem value="PERMANENT">Permanent</MenuItem>
                  <MenuItem value="CONTRACT">Contract</MenuItem>
                </Select>
              </FormControl>

                 <Box display="flex" alignItems="center" sx={{ gridColumn: "span 2" }}>
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
                <InputLabel id="jobtitle-label">Job Title</InputLabel>
                <Select
                  labelId="jobtitle-label"
                  value={values.jobId}
                  onChange={async (e) => {
                    const selectedJobId = e.target.value;
                    handleChange(e); // Update Formik values
                    if (selectedJobId) {
                      const selectedJob = jobRegistration.find(
                        (job) => job.id === selectedJobId
                      );
                      const associatedjobGradeId = selectedJob?.jobGradeId;
                      if (associatedjobGradeId) {
                        await fetchAllPayGrade(associatedjobGradeId);
                      } else {
                        console.warn(
                          "No associated PayGradeId found for the selected JobId"
                        );
                      }
                    }
                  }}
                  onBlur={handleBlur}
                  required
                  name="jobId"
                  error={!!touched.jobId && !!errors.jobId}
                >
                  <MenuItem value="">
                    <em>Select Job Title</em>
                  </MenuItem>
                  {jobRegistration.map((jobtitle) => (
                    <MenuItem key={jobtitle.id} value={jobtitle.id}>
                      {jobtitle.jobTitle}
                    </MenuItem>
                  ))}
                </Select>
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

              <Box
                display="flex"
                alignItems="center"
                sx={{ gridColumn: "span 2" }}
              >
                <FormControl
                  sx={{ flexGrow: 1, flexShrink: 1, minWidth: 0 }}
                  error={!!touched.titleNameId && !!errors.titleNameId}
                >
                  <InputLabel id="language-label">Select Title Name</InputLabel>
                  <Select
                    labelId="language-label"
                    value={values.titleNameId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="titleNameId"
                    fullWidth
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
                {canAddTitleName &&
                   <IconButton
                   sx={{ flexShrink: 0, marginLeft: 1 }}
                   onClick={handleTitleName}
                 >
                   <Add />
                 </IconButton>
                }
             
              </Box>

              <TextField
                fullWidth
                type="date"
                label="Hired Date"
                InputLabelProps={{ shrink: true }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.hiredDate}
                name="hiredDate"
                error={!!touched.hiredDate && !!errors.hiredDate}
                helperText={touched.hiredDate && errors.hiredDate}
                sx={{ gridColumn: "span 2" }}
              />

              <Box
                display="flex"
                alignItems="center"
                sx={{ gridColumn: "span 2" }}
              >
                <FormControl
                  sx={{ flexGrow: 1, flexShrink: 1, minWidth: 0 }}
                  error={!!touched.countryId && !!errors.countryId}
                >
                  <InputLabel id="language-label">Select Country</InputLabel>
                  <Select
                    labelId="country-label"
                    value={values.countryId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="countryId"
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>Select Country Name</em>
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

                {canAddCountry &&
                 <IconButton
                 sx={{ flexShrink: 0, marginLeft: 1 }}
                 onClick={handleCountry}
                 title="Click to add the new country"
               >
                 <Add />
               </IconButton>
                }
               
              </Box>

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
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ gridColumn: "span 2" }}
                />
              )}

              <TextField
                fullWidth
                type="text"
                label="Fayda Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.faydaNumber}
                name="faydaNumber"
                error={!!touched.faydaNumber && !!errors.faydaNumber}
                helperText={touched.faydaNumber && errors.faydaNumber}
                sx={{ gridColumn: "span 2" }}
              />

              <Box
                display="flex"
                alignItems="center"
                sx={{ gridColumn: "span 2" }}
              >
                <FormControl
                  sx={{ flexGrow: 1, flexShrink: 1, minWidth: 0 }}
                  error={!!touched.dutyStationId && !!errors.dutyStationId}
                >
                  <InputLabel id="language-label">
                    Select Duty Station
                  </InputLabel>
                  <Select
                    labelId="dutyStation-label"
                    value={values.dutyStationId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="dutyStationId"
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>SSelect Duty Station</em>
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

                {canAddDutyStation &&
                   <IconButton
                   sx={{ flexShrink: 0, marginLeft: 1 }}
                   onClick={handleDutyStation}
                   title="Click to add the new Duty Station"
                 >
                   <Add />
                 </IconButton>
                }
                
             

              </Box>

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
                label="Pension Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.pensionNumber}
                name="pensionNumber"
                error={!!touched.pensionNumber && !!errors.pensionNumber}
                helperText={touched.pensionNumber && errors.pensionNumber}
                sx={{ gridColumn: "span 2" }}
              />

              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              >
                {imagePreview && (
                  <Box
                    sx={{
                      gridColumn: "span 4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100px",
                    }}
                  >
                    <img
                      src={imagePreview}
                      alt="Profile Preview"
                      style={{ maxHeight: "100%", maxWidth: "100%" }}
                    />
                  </Box>
                )}

                <Box sx={{ gridColumn: "span 4" }}>
                  <TextField
                    fullWidth
                    type="file"
                    label="Profile Image"
                    onBlur={handleBlur}
                    onChange={handleFileUpload}
                    name="profileImage"
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100%" }} // Adjust the width of the input field
                  />
                </Box>
              </Box>
            </Box>
            <Box display="flex" justifyContent="center" mt="70px">
              <Button type="submit" color="secondary" variant="contained">
                Create Employee
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
      {/* Dialog for adding new category */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Header subtitle=" Create Title  Name" />
          <IconButton
            onClick={handleClose}
            style={{ position: "absolute", right: 8, top: 4 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
      </Dialog>
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

export default CreateEmployee;
