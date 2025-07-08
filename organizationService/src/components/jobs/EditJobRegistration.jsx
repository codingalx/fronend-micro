import {
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import SelectedKeyContext from "../department/SelectedKeyContext";
import {
  jobRegistrationsEndpoint,
  jobCategoriesEndpoint,
  workUnitEndpoint,
  qualificationEndpoint,
  jobGradeEndpoint,
  educationalLevelEndpoint,
  departmentEndpoint,
} from "../../../configuration/organizationApi";
import Header from "../common/Header";
import DepartementTree from "../common/DepartementTree";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

const validationSchema = yup.object().shape({
  jobTitle: yup.string().required("required"),
  jobCode: yup.string().required("required"),
  description: yup.string().required("required"),
  minExperience: yup.string().required("required"),
  relativeExperience: yup.string().required("required"),
  alternativeExperience: yup.string().required("required"),
  duties: yup.string().required("required"),
  skills: yup.string().required("required"),
});

const EditJobRegistration = () => {
  
  const [jobEdits, setJobEdits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const id = location.state.id;
   const [authState] = useAtom(authAtom); 
    const tenantId = authState.tenantId;

  // initialization for each drop down
  const [jobGrades, setJobGrades] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [workUnits, setWorkUnits] = useState([]);
  const [enducationLevels, setEnducationLevels] = useState([]);
  const [qualifications, setQualifications] = useState([]);

  /* 
  for existing department display, department from job register find department Id then, 
  display the department name from the departmet 
  */
  const [departmentName, setDepartmentName] = useState("");
  useEffect(() => {
    const { url, headers } = jobRegistrationsEndpoint(authState.accessToken);
    // Fetch the job data to get the departmentId
    axios
      .get(`${url}/${tenantId}/get/${id}`, {
        headers,
      })
      .then((response) => {
        const departmentId = response.data.departmentId;
        console.log("Department ID:", departmentId);

        const { url, headers } = departmentEndpoint(authState.accessToken);
        // Now fetch the department name using the departmentId
        return axios.get(`${url}/${tenantId}/get/${departmentId}`, {
          headers,
        });
      })
      .then((response) => {
        // Set the department name in the state
        setDepartmentName(response.data.departmentName);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching department name:", error);
        setError("Error fetching department name");
        setLoading(false);
      });
  }, [id]);
  // end of existing department

  const { selectedKey, setSelectedKey } = useContext(SelectedKeyContext);

  const handleSelect = (key) => {
    setSelectedKey(key); // This should update the context
  };

  // after update redirect to the list all component
  const navigate = useNavigate();

  // for jbo graade drop down
  useEffect(() => {
    const { url, headers } = jobGradeEndpoint(authState.accessToken);
    axios
      .get(`${url}/${tenantId}/get-all`, {
        headers,
      })
      .then((response) => {
        setJobGrades(response.data);
      })
      .catch((error) => {
        setError(error.message);
        setError("There was an error fetching job grade!");
      });
  }, []);
  // end of job drop down

  // for jbo category drop down
  useEffect(() => {
    const { url, headers } = jobCategoriesEndpoint(authState.accessToken);
    axios
      .get(`${url}/${tenantId}/get-all`, {
        headers,
      })
      .then((response) => {
        setJobCategories(response.data);
      })
      .catch((error) => {
        setError(error.message);
        setError("There was an error fetching job category!");
      });
  }, []);
  // end of job category drop down

  // for work unit drop down
  useEffect(() => {
    const { url, headers } = workUnitEndpoint(authState.accessToken);
    axios
      .get(`${url}/${tenantId}/get-all`, {
        headers,
      })
      .then((response) => {
        setWorkUnits(response.data);
      })
      .catch((error) => {
        setError(error.message);
        setError("There was an error fetching work units!");
      });
  }, []);
  // end of work unit drop down

  // for educational levels drop down
  useEffect(() => {
    const { url, headers } = educationalLevelEndpoint(authState.accessToken);
    axios
      .get(`${url}/${tenantId}/get-all`, {
        headers,
      })
      .then((response) => {
        setEnducationLevels(response.data);
      })
      .catch((error) => {
        setError(error.message);
        setError("There was an error fetching educational level!");
      });
  }, []);
  // end of education level down

  // for qualifications drop down
  useEffect(() => {
    const { url, headers } = qualificationEndpoint(authState.accessToken);
    axios
      .get(`${url}/${tenantId}/get-all`, {
        headers,
      })
      .then((response) => {
        setQualifications(response.data);
      })
      .catch((error) => {
        setError(error.message);
        setError("There was an error fetching qualifications!");
      });
  }, []);
  // end of qualifications down

  // job registration fetch by id
  useEffect(() => {
    const fetchData = async () => {
      const { url, headers } = jobRegistrationsEndpoint(authState.accessToken);
      try {
        const response = await axios.get(`${url}/${tenantId}/get/${id}`, {
          headers,
        });
        const data = response.data;
        setJobEdits({
          ...data,
          jobGrade: data.jobGradeId,
          jobCategory: data.jobCategoryId,
          workUnit: data.workUnitId,
          educationLevel: data.educationLevelId,
          qualificate: data.qualificationId,
          jobType:data.jobType === "NonManagerial" ? "nonmanagerial" : "managerial",
        });
        setLoading(false);
      } catch (error) {
        setError("There was an error fetching the job registration!");
      }
    };

    fetchData();
  }, [id]);


  const reportsToOptions = {
    IMMEDIATE_MANAGER: "IMMEDIATE MANAGER",
    SUPERVISOR: "SUPERVISOR",
    ADMINISTRATIVE: "ADMINISTRATIVE",
    FINANCE: "FINANCE",
    SECURITY: "SECURITY",
    HR: "HR",
  };
  // end of reports to

  const handleSubmit = (values, { setSubmitting }) => {
    const { url, headers } = jobRegistrationsEndpoint(authState.accessToken);

    const data = {
      ...values,
      jobGradeId: values.jobGrade,
      jobCategoryId: values.jobCategory,
      workUnitId: values.workUnit,
      educationLevelId: values.educationLevel,
      qualificationId: values.qualificate,


      jobType:
        values.jobType === "nonmanagerial" ? "NonManagerial" : "Managerial",
    };

    axios
      .put(`${url}/${tenantId}/update-job/${id}`, data, {
        headers,
      })
      .then((response) => {
        console.log(response.data);
        {
          navigate('/manage_organization', { state: { activeTab: 2 ,id} }); //


        }
        setSubmitting(false);
      })
      .catch((error) => {
        setError(error.message);
        setError("There was an error updating the job registration!");
        setSubmitting(false);
      });
  };

  const isNonMobile = useMediaQuery("(min-width:600px)");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box m="20px" className="insert-tenant">
      <Header
        subtitle="Edit an existing job registration profile"
      />

      <Formik
        initialValues={jobEdits}
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
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 0" },
              }}
              className="form-group"
            >
              
              <TextField
                fullWidth
                label="Job Title"
                onBlur={handleBlur}
                error={!!touched.jobTitle && !!errors.jobTitle}
                helperText={touched.jobTitle && errors.jobTitle}
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={values.jobTitle}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Job Code"
                onBlur={handleBlur}
                error={!!touched.jobCode && !!errors.jobCode}
                helperText={touched.jobCode && errors.jobCode}
                type="text"
                id="jobCode"
                name="jobCode"
                value={values.jobCode}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                select
                name="jobGrade"
                label="Job Grade"
                value={values.jobGrade}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              >
                {jobGrades.map((type, index) => (
                  <MenuItem key={index} value={type.id}>
                    {type.jobGradeName}
                  </MenuItem>
                ))}
              </TextField>
              

              <TextField
                select
                name="jobCategory"
                label="Job Category"
                value={values.jobCategory}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              >
                {jobCategories.map((type, index) => (
                  <MenuItem key={index} value={type.id}>
                    {type.jobCategoryName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                name="workUnit"
                label="Work unit"
                value={values.workUnit}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              >
                {workUnits.map((type, index) => (
                  <MenuItem key={index} value={type.id}>
                    {type.workUnitName}
                  </MenuItem>
                ))}
              </TextField>
              <FormLabel component="legend">Job Type</FormLabel>
              <RadioGroup
                row
                aria-labelledby="jobType"
                name="jobType"
                id="jobType"
                value={values.jobType}
                onChange={handleChange}
                sx={{
                  justifyContent: "center",
                  mb: 1,
                }}
              >
                <FormControlLabel
                  value="nonmanagerial"
                  control={<Radio color="primary" />}
                  label="Non Managerial"
                />
                <FormControlLabel
                  value="managerial"
                  control={<Radio color="primary" />}
                  label="Managerial"
                />
              </RadioGroup>
              <TextField
                select
                label="Reports To"
                name="reportsTo"
                value={values.reportsTo}
                onChange={handleChange}
                error={!!touched.reportsTo && !!errors.reportsTo}
                helperText={touched.reportsTo && errors.reportsTo}
                sx={{ gridColumn: "span 2" }}
              >
                {Object.keys(reportsToOptions).map((key) => (
                  <MenuItem key={key} value={key}>
                    {reportsToOptions[key]}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Job Description"
                onBlur={handleBlur}
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                type="text"
                id="description"
                name="description"
                value={values.description}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                select
                name="educationLevel"
                label="Educational Level"
                value={values.educationLevel}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              >
                {enducationLevels.map((type, index) => (
                  <MenuItem key={index} value={type.id}>
                    {type.educationLevelName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Minimum Experience"
                onBlur={handleBlur}
                error={!!touched.minExperience && !!errors.minExperience}
                helperText={touched.minExperience && errors.minExperience}
                type="text"
                id="minExperience"
                name="minExperience"
                value={values.minExperience}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Relative Experience"
                onBlur={handleBlur}
                error={
                  !!touched.relativeExperience && !!errors.relativeExperience
                }
                helperText={
                  touched.relativeExperience && errors.relativeExperience
                }
                type="text"
                id="relativeExperience"
                name="relativeExperience"
                value={values.relativeExperience}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Alternative Experience"
                onBlur={handleBlur}
                error={
                  !!touched.alternativeExperience &&
                  !!errors.alternativeExperience
                }
                helperText={
                  touched.alternativeExperience && errors.alternativeExperience
                }
                type="text"
                id="alternativeExperience"
                name="alternativeExperience"
                value={values.alternativeExperience}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                select
                name="qualificate"
                label="Qualifications"
                value={values.qualificate}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              >
                {qualifications.map((type, index) => (
                  <MenuItem key={index} value={type.id}>
                    {type.qualification}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Duties Description"
                onBlur={handleBlur}
                error={!!touched.duties && !!errors.duties}
                helperText={touched.duties && errors.duties}
                type="text"
                id="duties"
                name="duties"
                value={values.duties}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Skills Description"
                onBlur={handleBlur}
                error={!!touched.skills && !!errors.skills}
                helperText={touched.skills && errors.skills}
                type="text"
                id="skills"
                name="skills"
                value={values.skills}
                onChange={handleChange}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            <Box display="flex" justifyContent="start" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
              >
                Update Job Registration
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EditJobRegistration;
