import React, { useEffect, useState } from "react";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../common/Header";
import { Formik, Form, ErrorMessage } from "formik";
import {getEmployeeImageById, listTitleName, listJobRegestration, listDepartement, updateEmployee, listPayGrade, getEmployeeByEmployeId, getDepartementById } from "../../Api/employeeApi";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const ViewEmployee = ({ onIdReceive }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
     const [authState] = useAtom(authAtom); 
    const tenantId = authState.tenantId;
    const username = authState.username;
     const { id, isEditable } = location.state || {};

  const [employee, setEmployee] = useState({
    employeeId: "",
    departmentId: "",
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
    dutyStation: "",
    fydaNumber: "",
    passportNumber: "",
    tinNumber: "",
    pensionNumber: "",
    email: "",
    profileImage: null,
  });
  const [departments, setDepartments] = useState([]);
  const [jobRegistration, setJobRegistration] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [allTitleName, setAlltitleName] = useState([]);
  const [allPayGradeName, setAllPayGradeName] = useState([]);
  const [departement, setDepartement] = useState([]);



  useEffect(() => {
    fetchEmployee();
    fetchDepartments();
    fetchJobRegistrations();
    fetchImageOfEmployee();
    fetchAlltitleName();
    fetchAllPayGrade();
  }, [id]);
  const fetchEmployee = async () => {
    try {
      const response = await getEmployeeByEmployeId(tenantId, username);
      const data = response.data;
      setEmployee({
        ...data,
        profileImage: null, // Clear existing profile image state if needed
      });
  
      // Ensure employeeId is available
      const employeeId = data.id; // Assuming 'id' is the key for the employee's ID
      const departmentId = data.departmentId; // Assuming 'departmentId' is the key
  
      // Log the retrieved IDs
      console.log("Fetched Employee ID:", employeeId);
      console.log("Fetched Department ID:", departmentId);
  
      // Fetch image and department details if IDs are valid
      if (employeeId) {
        // Delay fetching the image until after the employee state is set
        setTimeout(() => {
          fetchImageOfEmployee(employeeId);
        }, 0); // Use setTimeout to defer the call
      } else {
        console.error("Employee ID is undefined.");
      }
  
      if (departmentId) {
        fetchDepartementById(departmentId);
      } else {
        console.error("Department ID is undefined.");
      }
  
      if (onIdReceive) {
        onIdReceive(data.id); // Pass the employee ID to Details component
      }
    } catch (error) {
      console.error("Failed to fetch employee:", error.message);
    }
  };
  

  



  const fetchDepartments = async () => {
    try {
      const response = await listDepartement(tenantId)
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
      console.log("Pay Grade:", response.data);
    } catch (error) {
      console.error("Error fetching titleName:", error);
    }
  };

  const fetchImageOfEmployee = async (employeeId) => {
    if (!employeeId) {
      return;
    }
  
    try {
      const imageUrl = await getEmployeeImageById(tenantId, employeeId);
      setImagePreview(imageUrl); // Set the image preview in the state
    } catch (error) {
      // Enhanced error handling
      if (error.response) {
        console.error("Failed to fetch Employee Image:", error.response.data);
      } else {
        console.error("Failed to fetch Employee Image:", error.message);
      }
    }
  };
  const fetchDepartementById = async (departementId) => {
    try {

      const response = await getDepartementById(tenantId,departementId);
      setDepartement(response.data);
      console.log("fetched Departement bY:", response.data);

    } catch (error) {
      console.error("Failed to fetch Employee Image:", error.message);
    }
  };



  const fetchAlltitleName = async () => {
    try {
      const response = await listTitleName(tenantId);
      setAlltitleName(response.data);
      console.log("Job titleName:", response.data);
    } catch (error) {
      console.error("Error fetching titleName:", error);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append(
        "employee",
        new Blob([JSON.stringify(values)], { type: "application/json" })
      );
      formData.append("profileImage", values.profileImage);

      const response = await updateEmployee(tenantId,id, formData);
      if (response.status === 200) {
        console.log("Employee updated successfully!");
        navigate(`/employee/list`);
      } else {
        console.error(
          "Error updating employee. Status code:",
          response.status
        );
      }
    } catch (error) {
      if (error.response) {
        console.error(
          "Server responded with an error:",
          error.response.data
        );
      } else {
        console.error(
          "An error occurred while updating the employee:",
          error.message
        );
      }
    }
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
    employeeId: yup.string().required("Employee ID cannot be blank"),
    email: yup.string().required("Employee ID cannot be blank"),

    payGradeId: yup.string().required("Pay Grade Name cannot be blank"),
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

    departmentId: yup
      .string()
      .required("Department ID cannot be null")
      .typeError("Department ID must be a number"),
    jobId: yup
      .string()
      .required("Job ID cannot be null")
      .typeError("Job ID must be a number"),
  });


  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <Box m="20px">
      <Header
        subtitle={isEditable ? "Update Employee" : "Employee Details"}
      />



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
                <InputLabel id="language-label"></InputLabel>

                {/* Hidden Select for Title Name */}
                <Select
                  labelId="language-label"
                  value={values.titleNameId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="titleNameId"
                  disabled={!isEditable}
                  style={{ display: 'none' }} // Hide the Select
                >
                  <MenuItem value="">
                    <em>see Your Title Name</em>
                  </MenuItem>
                  {allTitleName.map((title) => (
                    <MenuItem key={title.id} value={title.id}>
                      {title.titleName}
                    </MenuItem>
                  ))}
                </Select>

                {/* Display TextField for Title Name */}
                <TextField
                  label="Title Name"
                  value={
                    allTitleName.find((title) => title.id === values.titleNameId)?.titleName || ''
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  disabled={!isEditable}
                />
                {touched.titleNameId && errors.titleNameId && (
                  <FormHelperText>{errors.titleNameId}</FormHelperText>
                )}
              </FormControl>







              <FormControl sx={{ gridColumn: "span 2" }}>
                <InputLabel id="job-registration-label">Job Registration</InputLabel>

                {/* Hidden Select for Job Registration */}
                <Select
                  labelId="job-registration-label"
                  value={values.jobId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="jobId"
                  error={!!touched.jobId && !!errors.jobId}
                  disabled={!isEditable}
                  style={{ display: 'none' }} // Hide the Select
                >
                  <MenuItem value="">
                    <em> Job Registration</em>
                  </MenuItem>
                  {jobRegistration.map((job) => (
                    <MenuItem key={job.id} value={job.id}>
                      {job.jobTitle}
                    </MenuItem>
                  ))}
                </Select>

                {/* Display TextField for Job Title */}
                <TextField
                  label="Job Registration"
                  value={
                    jobRegistration.find((job) => job.id === values.jobId)?.jobTitle || ''
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  disabled={!isEditable}
                />
                <ErrorMessage name="jobId" component="div" />
              </FormControl>

              <FormControl
                sx={{ flexGrow: 1, flexShrink: 1, minWidth: 0, gridColumn: "span 2" }}
                error={!!touched.payGradeId && !!errors.payGradeId}
              >
                <InputLabel id="paygrade-label">Select PayGrade Name</InputLabel>

                {/* Hidden Select for PayGrade */}
                <Select
                  labelId="paygrade-label"
                  value={values.payGradeId}
                  onChange={(e) => {
                    handleChange(e);
                    console.log("Selected Pay Grade ID:", e.target.value);
                  }}
                  onBlur={handleBlur}
                  name="payGradeId"
                  fullWidth
                  disabled={!isEditable}
                  style={{ display: 'none' }} // Hide the Select
                >
                  <MenuItem value="">
                    <em>Select PayGrade Name</em>
                  </MenuItem>
                  {allPayGradeName.map((payGrade) => (
                    <MenuItem key={payGrade.id} value={payGrade.id}>
                      {payGrade.salary}
                    </MenuItem>
                  ))}
                </Select>

                {/* Display TextField for Pay Grade */}
                <TextField
                  label="Pay Grade"
                  value={
                    allPayGradeName.find((payGrade) => payGrade.id === values.payGradeId)?.salary || ''
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  disabled={!isEditable}
                />

                {touched.payGradeId && errors.payGradeId && (
                  <FormHelperText>{errors.payGradeId}</FormHelperText>
                )}
              </FormControl>










              <TextField
                fullWidth
                type="text"
                label="Gender"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.gender}
                name="gender"
                error={!!touched.gender && !!errors.gender}
                helperText={touched.gender && errors.gender}
                sx={{ gridColumn: "span 2" }}
                InputProps={{ readOnly: !isEditable }}
              />

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
                label="Duty Station"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dutyStation}
                name="dutyStation"
                error={!!touched.dutyStation && !!errors.dutyStation}
                helperText={touched.dutyStation && errors.dutyStation}
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
                value={values.fydaNumber}
                name="fydaNumber"
                error={!!touched.fydaNumber && !!errors.fydaNumber}
                helperText={touched.fydaNumber && errors.fydaNumber}
                sx={{ gridColumn: "span 2" }}
                InputProps={{ readOnly: !isEditable }}
              />

              <TextField
                fullWidth
                type="text"
                label="  Employment Type"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.employmentType}
                name="employmentType"
                error={!!touched.employmentType && !!errors.employmentType}
                helperText={touched.employmentType && errors.employmentType}
                sx={{ gridColumn: "span 2" }}
                InputProps={{ readOnly: !isEditable }}
              />

              {values.employmentType === 'CONTRACT' && (
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

              <TextField
                fullWidth
                type="text"
                label="maritalStatus"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.maritalStatus}
                name="maritalStatus"
                error={!!touched.maritalStatus && !!errors.maritalStatus}
                helperText={touched.maritalStatus && errors.maritalStatus}
                sx={{ gridColumn: "span 2" }}
                InputProps={{ readOnly: !isEditable }}
              />



              <FormControl sx={{ gridColumn: "span 2" }}>
                <TextField
                  fullWidth
                  type="text"
                  label="Department Name" // Label for the field
                  onBlur={handleBlur} // Handle blur event
                  onChange={handleChange} // Handle change event
                  value={departement ? departement.departmentName : ''} // Display the department name if fetched
                  name="departmentName" // Field name for Formik
                  error={false} // No error handling for display field
                  helperText={false} // No helper text needed
                  sx={{ gridColumn: "span 2" }} // Additional styling
                  InputProps={{
                    readOnly: !isEditable, // Control read-only state
                    shrink: true // Ensure the label shrinks when there is a value
                  }}
                  InputLabelProps={{
                    shrink: true, // Always shrink label
                  }}
                  placeholder="Select a department..." // Optional placeholder
                />
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
                gap={2} // Add gap between buttons
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
                  sx={{ mr: 2 }}
                  onClick={() => navigate(`/dashboard`)}
                >
                  Cancel
                </Button>


              </Box>



            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ViewEmployee;
