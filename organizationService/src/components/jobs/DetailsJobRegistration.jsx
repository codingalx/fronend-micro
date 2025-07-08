import { Box, TextField,Button } from "@mui/material";
import { Formik, Form } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
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
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 



const nonSelectableStyle = {
  border: "none",
  background: "transparent",
  boxShadow: "none",
  WebkitTouchCallout: "none" /* iOS Safari */,
  WebkitUserSelect: "none" /* Safari */,
  KhtmlUserSelect: "none" /* Konqueror HTML */,
  MozUserSelect: "none" /* Old versions of Firefox */,
  MsUserSelect: "none" /* Internet Explorer/Edge */,
  userSelect:
    "none" /* Non-prefixed version, currently supported by Chrome, Opera and Firefox */,
  pointerEvents: "none" /* Disabling pointer events to prevent focus */,
};

const DetailsJobRegistration = () => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const id = location.state.id;

  // the following is best option for multiple api
  // including id to name change
  // also normat string value display
  const [departmentName, setDepartmentName] = useState("");
  const [jobCategoryName, setJobCategoryName] = useState("");
  const [jobGradeName, setJobGradeName] = useState("");
  const [workUnitName, setWorkUnitName] = useState("");
  const [educationLevelName, setEducationLevel] = useState("");
  const [qualification, setQualifications] = useState("");
  const [jobEdits, setJobEdits] = useState({});

  useEffect(() => {
    const { url: JRURL, headers } = jobRegistrationsEndpoint(
      authState.accessToken
    );
    // Initialize loading and error states
    setLoading(true);
    setError(null);

    // Fetch the job data to get the departmentId and jobCategoryId
    axios
      .get(`${JRURL}/${tenantId}/get/${id}`, { headers })
      .then((response) => {
        const {
          departmentId,
          jobCategoryId,
          jobGradeId,
          workUnitId,
          educationLevelId,
          qualificationId,
          ...jobData
        } = response.data;
        // the following setJobEdits is used for other non dropdown elements like string, enums, radio groups used
        setJobEdits({
          ...jobData,
          jobType:
            jobData.jobType === "NonManagerial"
              ? "Non Managerial"
              : "Managerial",
        });
        const { url: DURL } = departmentEndpoint(authState.accessToken);
        const { url: JCURL } = jobCategoriesEndpoint(authState.accessToken);
        const { url: JGURL } = jobGradeEndpoint(authState.accessToken);
        const { url: WURL } = workUnitEndpoint(authState.accessToken);
        const { url: EURL } = educationalLevelEndpoint(authState.accessToken);
        const { url: QURL } = qualificationEndpoint(authState.accessToken);

        // Fetch the department name using the departmentId
        return Promise.all([
          axios.get(`${DURL}/${tenantId}/get/${departmentId}`, { headers }),
          axios.get(`${JCURL}/${tenantId}/get/${jobCategoryId}`, { headers }),
          axios.get(`${JGURL}/${tenantId}/get/${jobGradeId}`, { headers }),
          axios.get(`${WURL}/${tenantId}/get/${workUnitId}`, { headers }),
          axios.get(`${EURL}/${tenantId}/get/${educationLevelId}`, { headers }),
          axios.get(`${QURL}/${tenantId}/get/${qualificationId}`, { headers }),
        ]);
      })
      .then(
        ([
          departmentResponse,
          jobCategoryResponse,
          jobGradeResponse,
          workUnitResponse,
          educationLevelResponse,
          qualificationResponse,
        ]) => {
          // Set the department and job category names in the state
          setDepartmentName(departmentResponse.data.departmentName);
          setJobCategoryName(jobCategoryResponse.data.jobCategoryName);
          setJobGradeName(jobGradeResponse.data.jobGradeName);
          setWorkUnitName(workUnitResponse.data.workUnitName);
          setEducationLevel(educationLevelResponse.data.educationLevelName);
          setQualifications(qualificationResponse.data.qualification);
        }
      )
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // after update redirect to the list all component
  const navigate = useNavigate();

  const isNonMobile = useMediaQuery("(min-width:600px)");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box m="20px" className="insert-tenant">
      <Header
        title="DETAILS OF JOB REGISTRATION"
        subtitle="Details of an existing job registration profile"
      />

      <Formik initialValues={jobEdits}>
        {({ values }) => (
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
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                value={values.jobTitle}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Job Code"
                value={values.jobCode}
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                label="Job Grade"
                // value display jobGradeName without values for helping id to name change useEffect
                value={jobGradeName}
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Job Category"
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                value={jobCategoryName}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                label="Work unit"
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                value={workUnitName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Job Type"
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                value={values.jobType}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Reports To"
                name="reportsTo"
                value={values.reportsTo}
                sx={{ gridColumn: "span 2" }}
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
              />
              <TextField
                fullWidth
                label="Job Description"
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                value={values.description}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                label="Educational Level"
                value={educationLevelName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Minimum Experience"
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                value={values.minExperience}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Relative Experience"
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                value={values.relativeExperience}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Alternative Experience"
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                value={values.alternativeExperience}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                label="Qualifications"
                value={qualification}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Duties Description"
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                value={values.duties}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Skills Description"
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                value={values.skills}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Department"
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                value={departmentName}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button
                variant="contained"
                sx={{ mr: 2 }}
                onClick={() => navigate(`/manage_organization`,{ state: { activeTab: 2 ,id} })}

                
              >
                Cancel
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default DetailsJobRegistration;
