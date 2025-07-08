import {
  Box,
  Button,
  TextField,
  FormControl,
  Autocomplete,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import Header from '../common/Header'
import { addRecruitment, 
  getDepartementById,
   getEmployeeByEmployeId, getJoblistByDepartementId, jobGradeById  } from "../../../configuration/RecruitmentApp";
import { useState, useEffect } from "react";
import ToolbarComponent from '../common/ToolbarComponent'
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

 
const CreateRecruitment = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [departmentDetails, setDepartmentDetails] = useState(null);
  const [jobRegistrations, setJobRegistrations] = useState([]);
  const [jobGrades, setJobGrades] = useState(null);
    const [authState] = useAtom(authAtom); 
    const tenantId = authState.tenantId
    const username  = authState.username




  

  const fetchEmployeeDetails = async (employeeId) => {
    try {
      const response = await getEmployeeByEmployeId(tenantId,employeeId);
      console.log(response);
      
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = response.data;
      setEmployeeDetails(data);
      console.log("Employee Details:", data);
  
      const { departmentId } = data;
      await fetchDepartmentDetails(departmentId);
      await fetchJobRegistrations(departmentId);
  
    } catch (error) {
      console.error("Failed to fetch employee details:", error);
    }
  };
  
  const fetchDepartmentDetails = async (departmentId) => {
    try {
      const response = await getDepartementById(tenantId,departmentId);
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const departmentData = response.data;
      setDepartmentDetails(departmentData);
      console.log("Department Data:", departmentData);
    } catch (error) {
      console.error("Failed to fetch department details:", error);
    }
  };

  const fetchJobRegistrations = async (departmentId) => {
    try {
      const response = await getJoblistByDepartementId(tenantId,departmentId);
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jobRegistrationsData = response.data;
      setJobRegistrations(jobRegistrationsData);
      console.log("Job Registrations:", jobRegistrationsData);

      // Fetch job grades for each job registration
      if (jobRegistrationsData.length > 0) {
        const jobGradeId = jobRegistrationsData[0].jobGradeId;
        await fetchJobGrade(jobGradeId);
      }
    } catch (error) {
      console.error("Error fetching job registrations:", error);
    }
  };

  const fetchJobGrade = async (jobGradeId) => {
    try {
      const response = await jobGradeById(tenantId,jobGradeId);
  
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // With axios, response.data is already parsed JSON
      const jobGradeData = response.data;
      setJobGrades(jobGradeData);
      console.log("Job Grade Data:", jobGradeData);
  
    } catch (error) {
      console.error("Failed to fetch job grade details:", error);
    }
  };
  

  const handleFormSubmit = async (values) => {
    try {
      console.log("Submitting values:", values); // Log the values before submitting
      await addRecruitment(tenantId,values);
      navigate("/recruitment/list");
    } catch (error) {
      console.error("Failed to submit form data:", error);
    }
  };
  


  const initialValues = {
    requesterEmployeeId: username && !username.includes("admin") ? username : "",
    departmentId: "",
    numberOfEmployeesRequested: "",
    recruitmentType: "",
    recruitmentMode: "",
    remark: "",
    jobId: "",
    minExperience: "",
    description:"" // Add minExperience to initialValues
  };

  const checkoutSchema = yup.object().shape({
    requesterEmployeeId: yup
      .string()
      .required("Requester ID is required"),
  
    numberOfEmployeesRequested: yup
      .number()
      .required("Number of employees requested is required")
      .positive("Number must be positive")
      .integer("Number must be an integer"),
    recruitmentType: yup.string().required("Recruitment type is required"),
    recruitmentMode: yup.string().required("Recruitment mode is required"),
    remark: yup.string().required("Remark is required"),
    jobId: yup.string().required("Job ID is required"), // Add validation for jobId
  });
  const handleIconClick = () => {
    navigate('/recruitment/list');

};

const refreshPage = () => {
    window.location.reload();
};


  return (
    <Box m="20px">
        <ToolbarComponent
                mainIconType="search"
                onMainIconClick={handleIconClick}
                refreshPage={refreshPage}
            />
      <Header subtitle="Create  new recruitment  " />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          setFieldValue,
          handleSubmit,
        }) => 
          {
          useEffect(() => {
            if (values.requesterEmployeeId) {
              fetchEmployeeDetails(values.requesterEmployeeId);
            }
          }, [values.requesterEmployeeId]);

          useEffect(() => {
            if (employeeDetails) {
              setFieldValue("firstName", employeeDetails.firstName);
              setFieldValue("lastName", employeeDetails.lastName);
              setFieldValue("departmentId", employeeDetails.departmentId); // Update departmentId
            }
          }, [employeeDetails, setFieldValue]);

          useEffect(() => {
            if (departmentDetails) {
              setFieldValue("departmentName", departmentDetails.departmentName); // Update departmentName
            }
          }, [departmentDetails, setFieldValue]);

          useEffect(() => {
            if (jobGrades) {
              setFieldValue("jobGradeName", jobGrades.jobGradeName);
            }
          }, [jobGrades, setFieldValue]);

          useEffect(() => {
            if (values.jobId) {
              const selectedJob = jobRegistrations.find(
                (job) => job.id === values.jobId
              );
              if (selectedJob) {
                setFieldValue(
                  "minExperience",
                  `${selectedJob.minExperience} years`
                ); 
                setFieldValue(
                  "description",
                  selectedJob.description
                ); 
               
                fetchJobGrade(selectedJob.jobGradeId); // Fetch job grade based on jobGradeId
              }
            }
          }, [values.jobId, jobRegistrations, setFieldValue]);

          return (
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
                  label="requesterEmployeeId "
                  value={values.requesterEmployeeId}
                  name="requesterEmployeeId"
                  disabled
                  InputLabelProps={{ shrink: !!values.requesterEmployeeId }}
                  sx={{ gridColumn: "span 2" }}
                />


                <FormControl  sx={{ gridColumn: "span 2" }}>
                  <InputLabel id="jobtitle-label">Job Title</InputLabel>
                  <Select
                    labelId="jobtitle-label"
                    value={values.jobId}
                    onChange={(event) => {
                      setFieldValue("jobId", event.target.value);
                      const selectedJob = jobRegistrations.find(
                        (job) => job.id === event.target.value
                      );
                      if (selectedJob) {
                        setFieldValue(
                          "minExperience",
                          `${selectedJob.minExperience} years`
                        );
                        fetchJobGrade(selectedJob.jobGradeId); // Fetch job grade based on jobGradeId
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
                    {jobRegistrations.map((job) => (
                      <MenuItem key={job.id} value={job.id}>
                        {job.jobTitle}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
       
                  type="text"
                  label="Requester Name"
                  value={
                    values.firstName && values.lastName
                      ? `${values.firstName} ${values.lastName}`
                      : ""
                  } // Concatenate firstName and lastName if both are defined
                  name="requesterName" // Change name if necessary
                  disabled
                  InputLabelProps={{
                    shrink: !!values.firstName || !!values.lastName,
                  }}
                  sx={{ gridColumn: "span 2" }} // Span the width of two columns
                />

                <TextField
                  fullWidth
            
                  type="text"
                  label="Department Name"
                  value={values.departmentName}
                  name="departmentName"
                  disabled
                  InputLabelProps={{ shrink: !!values.departmentName }}
                  sx={{ gridColumn: "span 2" }}
                />

                <TextField
                  fullWidth
          
                  type="text"
                  label="Grade"
                  value={values.jobGradeName}
                  name="jobGradeName"
                  disabled
                  InputLabelProps={{ shrink: !!values.jobGradeName }}
                  sx={{ gridColumn: "span 2" }}
                />
                   <TextField
                  fullWidth
             
                  type="text" // Changed to text to allow the display of "years"
                  label="Minimum Experience"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.minExperience}
                  name="minExperience"
                  disabled
                  error={!!touched.minExperience && !!errors.minExperience}
                  helperText={touched.minExperience && errors.minExperience}
                  sx={{ gridColumn: "span 2" }}
                />

                <TextField
                  fullWidth
        
                  type="number"
                  label="Number of Employees Requested"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.numberOfEmployeesRequested}
                  name="numberOfEmployeesRequested"
                  error={
                    !!touched.numberOfEmployeesRequested &&
                    !!errors.numberOfEmployeesRequested
                  }
                  helperText={
                    touched.numberOfEmployeesRequested &&
                    errors.numberOfEmployeesRequested
                  }
                  sx={{ gridColumn: "span 2" }}
                />

                <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                  <InputLabel>Recruitment Type</InputLabel>
                  <Select
                    label="Recruitment Type"
                    value={values.recruitmentType}
           
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    displayEmpty
                    inputProps={{ "aria-label": "Recruitment Type" }}
                    name="recruitmentType"
                    error={
                      !!touched.recruitmentType && !!errors.recruitmentType
                    }
                  >
                    
                    <MenuItem value="PERMANENT">Permanent</MenuItem>
                    <MenuItem value="CONTRACT">Contract</MenuItem>
                    <MenuItem value="TEMPORARY">Temporary</MenuItem>
                    <MenuItem value="OTHER">Other</MenuItem>
                  </Select>
                  {touched.recruitmentType && errors.recruitmentType && (
                    <FormHelperText error>
                      {errors.recruitmentType}
                    </FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                  <InputLabel>Recruitment Mode</InputLabel>
                  <Select
                    label="Recruitment Mode"
                    value={values.recruitmentMode}
             
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    displayEmpty
                    inputProps={{ "aria-label": "Recruitment Mode" }}
                    name="recruitmentMode"
                    error={
                      !!touched.recruitmentMode && !!errors.recruitmentMode
                    }
                  >
                    
                    <MenuItem value="INTERNAL">Internal</MenuItem>
                    <MenuItem value="EXTERNAL">External</MenuItem>
                    <MenuItem value="TRANSFER">Transfer</MenuItem>
                    <MenuItem value="OTHER">Other</MenuItem>
                  </Select>
                  {touched.recruitmentMode && errors.recruitmentMode && (
                    <FormHelperText error>
                      {errors.recruitmentMode}
                    </FormHelperText>
                  )}
                </FormControl>

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
      
                multiline
                rows={2}
                label="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                disabled
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 2" }}
              />
             
              </Box>
              <Box display="flex" justifyContent="center" mt="20px">
                <Button type="submit" color="primary" variant="contained">
                  Create Recruitment
                </Button>
              </Box>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default CreateRecruitment;
