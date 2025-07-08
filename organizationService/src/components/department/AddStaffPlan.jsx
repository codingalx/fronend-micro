import { Box, Button, MenuItem, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  staffPlanEndpoint,
  jobGradeEndpoint,
  jobRegistrationsEndpoint,
 } from "../../../configuration/organizationApi";
import { useLocation } from "react-router-dom";
import Header from "../common/Header";
import ListStaffPlan from "../staffPlan/ListStaffPlan";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 




const validationSchema = yup.object().shape({
  jobTitle: yup
    .string()
    .required("Please select an option from the dropdown menu."),
  quantity: yup.string().required("required"),
});

const AddStaffPlan = () => {
   const [authState] = useAtom(authAtom);
   const tenantId = authState.tenantId;

  const [jobTitles, setJobTitles] = useState([]);
  const [jobCodes, setJobCodes] = useState([]);
  const [jobGrades, setJobGrades] = useState([]);

  const location = useLocation();
  const id = location.state.id;
  console.log(`the deparetement id for staf pln  is ${id}`)

  /* THIS IS FOR SAME NAME YOU TYPE TO PROTECT */
  const [existedMessage, setExistedMessage] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);


  useEffect(() => {
    const { url, headers } = jobRegistrationsEndpoint(authState.accessToken);
    axios
      // .get(apiEndpointGetJobRegistration)
      .get(`${url}/${tenantId}/get-all`, { headers })
      .then((response) => {
        setJobTitles(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = (values, { setSubmitting, resetForm}) => {
    const { url, headers } = staffPlanEndpoint(authState.accessToken);
    // const headers = {
    //   accept: "*/*",
    //   "Content-Type": "application/json",
    // };

    const data = {
      ...values,
      jobRegistrationId: values.jobTitle,
      departmentId: id,
    };

    axios
      // .post(apiEndpointAddPayGrade, data, { headers })
      .post(`${url}/${tenantId}/add-staff-plan`, data, { headers })
      .then((response) => {
        console.log(response.data);
        setSuccessMessage(true);
        setExistedMessage(false);
        setSubmitting(false);
        resetForm();
        setRefreshKey(prev => prev + 1);
      })
      .catch((error) => {
        console.error("There was an error!", error);
        setSubmitting(false);
        if (error.response.status === 500) {
          console.error("An internal server error occurred. Existed");
        }
        // You can display an error message to the user, existed user existed
        setExistedMessage(true);
      });
  };

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleJobTitleChange = async (event) => {
    const selectedJobId = event.target.value;
    const selectedJob = jobTitles.find((job) => job.id === selectedJobId);

    if (selectedJob) {
      setJobCodes(selectedJob.jobCode);

      // Fetch job grade value using the jobGradeId
      try {
        const { url, headers } = jobGradeEndpoint(authState.accessToken);
        // const response = await axios.get(
        //   `${apiEndpointGetJobGrade}/${selectedJob.jobGradeId}`
        // );
        const response = await axios.get(
          `${url}/${tenantId}/get/${selectedJob.jobGradeId}`,
          {
            headers,
          }
        );
        setJobGrades(response.data.jobGradeName); // Adjust this line based on the actual response structure
      } catch (error) {
        console.error("Error fetching job grade:", error);
      }
    }
  };

  return (
    <Box m="20px" className="insert-tenant">
      <Header  subtitle="Add a new staff plan profile" />
      <Formik
        initialValues={{
          quantity: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          isSubmitting,
          handleChange,
        }) => (
          <Form>
            <Box
              display="grid"
              gap="30px"
              // this is where the page cols is choose totally now 4 containers at a time
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 0" },
              }}
              className="form-group"
            >
              <TextField
                select
                name="jobTitle"
                label="Job Title"
                value={values.jobTitle}
                onChange={(event) => {
                  handleChange(event);
                  handleJobTitleChange(event);
                }}
                error={!!touched.jobTitle && !!errors.jobTitle}
                helperText={touched.jobTitle && errors.jobTitle}
                sx={{ gridColumn: "span 2" }}
              >
                {jobTitles.map((type, index) => (
                  <MenuItem key={index} value={type.id}>
                    {type.jobTitle}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Job Code"
                id="jobCode"
                name="jobCode"
                value={jobCodes}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Job Grade"
                id="jobGrade"
                name="jobGrade"
                value={jobGrades}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Quantity"
                onBlur={handleBlur}
                error={!!touched.quantity && !!errors.quantity}
                helperText={touched.quantity && errors.quantity}
                type="number"
                id="quantity"
                name="quantity"
                value={values.quantity}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="start" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
              >
                Create New Staff Plan
              </Button>
            </Box>

            {successMessage && (
              <span display="flex" className="success-message">
                Staff Plan created successfully!
              </span>
            )}
            {/* You can display an error message to the user, existed user existed */}

            {existedMessage && (
              <span display="flex" className="success-message">
                The given Job Title Quantity already created, try different Job
                Title!
              </span>
            )}
            <ListStaffPlan  refreshKey ={refreshKey}/>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddStaffPlan;
