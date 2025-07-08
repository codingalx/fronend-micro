import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import Header from "../common/Header";
import { editRecruitmentbyapprove,
  
  fetchJobGradeByJobId,
  getDepartementById,
  getEmployeeByEmployeId,
  getRecruitmentbyId,
  jobGradeById, } from "../../../configuration/RecruitmentApp";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ToolbarComponent from "../common/ToolbarComponent";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 




const EditRecruitmentbyapprove = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const { id, requesterEmployeeId } = location.state;
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId
  
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [departmentDetails, setDepartmentDetails] = useState(null);
  const [jobTitle, setJobTitles] = useState(null);
  const [jobGrade, setJobGrade] = useState(null);

  const [recruitment, setRecruitment] = useState({
    departmentId: "",
    numberOfEmployeesApproved: "",
    decision: "", // Set default value
    vacancyNumber: "",
  });

  useEffect(() => {
    fetchRecruitment();
    fetchEmployeeByEmployeeId();
  }, []);

  const fetchRecruitment = async () => {
    try {
      const response = await getRecruitmentbyId(tenantId,id);
      const data = response.data;
      setRecruitment({
        ...data,
        requesterEmployeeId: data.requesterEmployeeId, // Ensure the requesterId field is properly set
       
      });
      console.log(data); // Log the entire response object to inspect its structure
    } catch (error) {
      console.error("Failed to fetch recruitment:", error.message);
    }
  };

  const fetchEmployeeByEmployeeId = async () => {
    try {
      const response = await getEmployeeByEmployeId(tenantId,requesterEmployeeId);
      const data = response.data;
      setEmployeeDetails(data);

      const { departmentId, jobId } = data;

      // Ensure departmentId and jobId are defined before proceeding
      if (departmentId) {
        await fetchDepartmentDetails(departmentId);
      } else {
        console.error("Department ID is undefined");
      }

      if (jobId) {
        await fetchJob(jobId);
      } else {
        console.error("Job ID is undefined");
      }

      console.log(data);
    } catch (error) {
      console.error("Failed to fetch employee:", error.message);
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

 

  const fetchJob = async (jobId) => {
    try {
      console.log(`Fetching job details for jobId: ${jobId}`);
      const response = await fetchJobGradeByJobId(tenantId,jobId);
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jobData = response.data;
      setJobTitles(jobData);

      const { jobGradeId } = jobData;

      // Ensure jobGradeId is defined before proceeding
      if (jobGradeId) {
        await fetchJobGrade(jobGradeId);
      } else {
        console.error("Job Grade ID is undefined");
      }

      console.log("Job Data:", jobData);
    } catch (error) {
      console.error("Failed to fetch job details:", error.message);
    }
  };

 
  const fetchJobGrade = async (jobGradeId) => {
    try {
      const response = await jobGradeById(tenantId,jobGradeId);
  
      // Check the status directly; axios will throw for non-2xx statuses
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // With axios, response.data is already parsed JSON
      const jobGradeData = response.data;
      setJobGrade(jobGradeData);
      console.log("Job Grade Data:", jobGradeData);
  
    } catch (error) {
      console.error("Failed to fetch job grade details:", error);
    }
  };


  const handleFormSubmit = async (values) => {
    try {
      const response = await editRecruitmentbyapprove( tenantId,id, values);
      if (response.status === 200) {
        console.log("Recruitment updated successfully!");
        navigate("/recruitment/list", { state: { id } });
      } else {
        console.error(
          "Error updating recruitment. Status code:",
          response.status
        );
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
      } else {
        console.error(
          "An error occurred while updating the recruitment:",
          error.message
        );
      }
    }
  };

  const checkoutSchema = yup.object().shape({
    numberOfEmployeesApproved: yup
      .string()
      .required("Number of Employees Approved is required"),
    decision: yup.string().required("Decision is required"),
    vacancyNumber: yup
    .string()
    .required("Vacancy Number is required")
    .min(2, "Vacancy Number must be at least 2 characters"),  });


  const FormikEffect = ({ setFieldValue }) => {
    useEffect(() => {
      if (employeeDetails) {
        setFieldValue("firstName", employeeDetails.firstName);
        setFieldValue("lastName", employeeDetails.lastName);
        setFieldValue("employeeId", employeeDetails.employeeId);
      }
    }, [employeeDetails, setFieldValue]);
    

    useEffect(() => {
      if (departmentDetails) {
        setFieldValue("departmentName", departmentDetails.departmentName); // Update departmentName
      }
    }, [departmentDetails, setFieldValue]);

    useEffect(() => {
      if (recruitment) {
        setFieldValue(
          "numberOfEmployeesRequested",
          recruitment.numberOfEmployeesRequested
        ); // Update departmentName
        setFieldValue("recruitmentMode", recruitment.recruitmentMode);
        setFieldValue("recruitmentType", recruitment.recruitmentType);
        setFieldValue("remark", recruitment.remark);
      }
    }, [recruitment, setFieldValue]);

    useEffect(() => {
      if (jobGrade) {
        setFieldValue("jobGradeName", jobGrade.jobGradeName); // Update departmentName
      }
    }, [jobGrade, setFieldValue]);

    useEffect(() => {
      if (jobTitle) {
        setFieldValue("jobTitle", jobTitle.jobTitle); // Update jobTitle
        setFieldValue("description", jobTitle.description);
        setFieldValue("minExperience", `${jobTitle.minExperience} Year`);
      }
    }, [jobTitle, setFieldValue]);

    return null;
  };
  const handleIconClick = () => {
    navigate('/recruitment/list');
  };

  const refreshPage = () => {
    window.location.reload();
  };


  return (
    <Box >
          <ToolbarComponent
                mainIconType="search"
                onMainIconClick={handleIconClick}
                refreshPage={refreshPage}
            />
      <Header subtitle="Appovance of Recruitment" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={recruitment}
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
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <FormikEffect setFieldValue={setFieldValue} />
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
              //  variant="filled"
                type="hidden"
                label="Department ID"
                value={values.departmentId}
                name="departmentId"
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.departmentId && !!errors.departmentId}
                helperText={touched.departmentId && errors.departmentId}
                sx={{ display: "none" }} // Hide this input field
              />

              <TextField
                fullWidth
               
                type="text"
                label="Vacancy Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.vacancyNumber}
                name="vacancyNumber"
                error={!!touched.vacancyNumber && !!errors.vacancyNumber}
                helperText={touched.vacancyNumber && errors.vacancyNumber}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
            
                type="number"
                label="Number of Employees Approved"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.numberOfEmployeesApproved}
                name="numberOfEmployeesApproved"
                error={
                  !!touched.numberOfEmployeesApproved &&
                  !!errors.numberOfEmployeesApproved
                }
                helperText={
                  touched.numberOfEmployeesApproved &&
                  errors.numberOfEmployeesApproved
                }
                sx={{ gridColumn: "span 2" }}
              />

              <FormControl
                fullWidth
              //  variant="filled"
                sx={{ gridColumn: "span 2" }}
                error={!!touched.decision && !!errors.decision}
              >
                <InputLabel id="decision-label">Decision</InputLabel>
                <Select
                  labelId="decision-label"
                  value={values.decision}
                
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "Decision" }}
                  name="decision"
                  error={!!touched.decision && !!errors.decision}
                  helperText={touched.decision && errors.decision}
                >
                      <MenuItem value="PENDING">PENDING</MenuItem>
                  <MenuItem value="APPROVED">APPROVED</MenuItem>
                  <MenuItem value="REJECTED">REJECTED</MenuItem>
                </Select>
              </FormControl>
            
              <TextField
                fullWidth
              //  variant="filled"
                type="text"
                label="Requester FullName"
                value={
                  values.firstName && values.lastName
                    ? `${values.firstName} ${values.lastName}`
                    : ""
                } // Concatenate firstName and lastName if both are defined
                name="requesterName" // Change name if necessary
                disabled
                InputProps={{
                  readOnly: true,
                }}
                sx={{ gridColumn: "span 2" }} // Span the width of two columns
              />

              <TextField
                fullWidth
               // variant="filled"
                type="text"
                label="Number Of Requested"
                value={values.numberOfEmployeesRequested}
                name="numberOfEmployeesRequested"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true, // Ensure the label shrinks when there's a value
                }}
                sx={{ gridColumn: "span 2" }} // Span the width of two columns
              />
               <TextField
                fullWidth
             //   variant="filled"
                type="text"
                label="Requiester Mode"
                value={values.recruitmentMode}
                name="recruitmentMode"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true, // Ensure the label shrinks when there's a value
                }}
                sx={{ gridColumn: "span 2" }} // Span the width of two columns
              />
           
                <TextField
                fullWidth
               // variant="filled"
                type="text"
                label="Requiester Type"
                value={values.recruitmentType}
                name="recruitmentType"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true, // Ensure the label shrinks when there's a value
                }}
                sx={{ gridColumn: "span 2" }} // Span the width of two columns
              />
               <TextField
                fullWidth
              //  variant="filled"
                type="text"
                label="remark"
                value={values.remark}
                name="remark"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true, // Ensure the label shrinks when there's a value
                }}
                sx={{ gridColumn: "span 2" }} // Span the width of two columns
              />


              <TextField
                fullWidth
              //  variant="filled"
                type="text"
                label="Requester ID"
                value={values.employeeId} // Concatenate firstName and lastName if both are defined
                name="employeeId" // Change name if necessary
                disabled
                InputLabelProps={{
                  shrink: !!values.firstName || !!values.lastName,
                }}
                sx={{ gridColumn: "span 2" }} // Span the width of two columns
              />
              <TextField
                fullWidth
               // variant="filled"
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
               // variant="filled"
                type="text"
                label="Job Grade"
                value={values.jobGradeName}
                name="jobGradeName"
                disabled
                InputLabelProps={{ shrink: !!values.jobGradeName }}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
              //  variant="filled"
                type="text"
                label="Job Title"
                value={values.jobTitle}
                name="jobTitle"
                disabled
                InputLabelProps={{ shrink: !!values.jobTitle }}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
             //   variant="filled"
                type="text"
                label="Minimum Experience"
                value={values.minExperience}
                name="minExperience"
                disabled
                InputLabelProps={{ shrink: !!values.minExperience }}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
               // variant="filled"
                type="text"
                multiline
                rows={3}
                label="Description"
                value={values.description}
                name="description"
                disabled
                InputLabelProps={{ shrink: !!values.description }}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Edit Recruitment
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default EditRecruitmentbyapprove;
