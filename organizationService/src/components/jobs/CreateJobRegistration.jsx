import {
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField, Snackbar, Alert, DialogActions,Dialog, DialogContent, DialogTitle,
} from "@mui/material";

import { Formik, Form } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import SelectedKeyContext from '../department/SelectedKeyContext'
import DepartementTree from '../common/DepartementTree'

import {
  jobRegistrationsEndpoint,
  jobCategoriesEndpoint,
  workUnitEndpoint,
  qualificationEndpoint,
  jobGradeEndpoint,
  educationalLevelEndpoint,
} from "../../../configuration/organizationApi";
import Header from '../common/Header'
import ListJobRegistration from "./ListJobRegistration";
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
  jobGrade: yup
    .string()
    .required("Please select an option from the dropdown menu."),
  jobCategory: yup
    .string()
    .required("Please select an option from the dropdown menu."),
  workUnit: yup
    .string()
    .required("Please select an option from the dropdown menu."),
  reportsTo: yup
    .string()
    .required("Please select an option from the dropdown menu."),
  educationLevel: yup
    .string()
    .required("Please select an option from the dropdown menu."),
  qualificate: yup
    .string()
    .required("Please select an option from the dropdown menu."),
});


const reportsToOptions = {
  IMMEDIATE_MANAGER: "IMMEDIATE MANAGER",
  SUPERVISOR: "SUPERVISOR",
  ADMINISTRATIVE: "ADMINISTRATIVE",
  FINANCE: "FINANCE",
  SECURITY: "SECURITY",
  HR: "HR",
};

const CreateJobRegistration = () => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;
  const [refreshKey, setRefreshKey] = useState(0);
  const { selectedKey, setSelectedKey } = useContext(SelectedKeyContext);
  const [localSelectedKey, setLocalSelectedKey] = useState(selectedKey);


  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

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


  const handleSelect = (key) => {
    setSelectedKey(key); // This should update the context
    setLocalSelectedKey(key); // Update local state
  };
  /* end of selectedkey functionality */

  /* drop down for job grade create */
  const [jobGrades, setJobGrades] = useState([]);

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
        console.error("There was an error!", error);
      });
  }, []);

  /* end of drop down */

  /* Job Category drop down list */
  const [jobCategory, setJobCategory] = useState([]);

  useEffect(() => {
    const { url, headers } = jobCategoriesEndpoint(authState.accessToken);
    axios
      .get(`${url}/${tenantId}/get-all`, {
        headers,
      })
      .then((response) => {
        setJobCategory(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);
  /* end of job category drop down list */

  /* work unit drop down list */
  const [workunits, setWorkunits] = useState([]);

  useEffect(() => {
    const { url, headers } = workUnitEndpoint(authState.accessToken);
    axios
      .get(`${url}/${tenantId}/get-all`, {
        headers,
      })
      .then((response) => {
        setWorkunits(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);
  /* end of work unit drop down list */

  /* education level drop down list */
  const [educationLevels, setEducationLevels] = useState([]);

  useEffect(() => {
    const { url, headers } = educationalLevelEndpoint(authState.accessToken);
    axios
      .get(`${url}/${tenantId}/get-all`, {
        headers,
      })
      .then((response) => {
        setEducationLevels(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);
  /* end of education level drop down list */

  /* qualifications drop down list */
  const [qualifications, setQualifications] = useState([]);

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
        console.error("There was an error!", error);
      });
  }, []);
  /* end of qualifications drop down list */

  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const { url, headers } = jobRegistrationsEndpoint(authState.accessToken);

    const data = {
      jobTitle: values.jobTitle,
      jobCode: values.jobCode,
      reportsTo: values.reportsTo,
      jobType:
        values.jobType === "nonmanagerial" ? "NonManagerial" : "Managerial",
      minExperience: Number(values.minExperience),
      duties: values.duties,
      language: values.language,
      skills: values.skills,
      description: values.description,
      alternativeExperience: values.alternativeExperience,
      relativeExperience: values.relativeExperience,
      educationLevelId: values.educationLevel,
      jobCategoryId: values.jobCategory,
      jobGradeId: values.jobGrade,
      workUnitId: values.workUnit,
      qualificationId: values.qualificate,
      // departmentId: localSelectedKey,
      departmentId: selectedDepartment.id,

    };

    console.log("Data to be sent:", data);

    axios
      .post(`${url}/${tenantId}/add-job`, data, { headers })
      .then((response) => {
        console.log("Response data:", response.data);
        setSuccessMessage(true);
        setSubmitting(false);
        resetForm();
        setRefreshKey(prev => prev + 1);

        setSelectedKey(null);
        setLocalSelectedKey(null);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        setSubmitting(false);
      });
  };

  const isNonMobile = useMediaQuery("(min-width:600px)");


  return (
    <Box m="20px" className="insert-tenant">
      <Header subtitle="Create a new job profile" />

      <Formik
        initialValues={{
          jobTitle: "",
          jobCode: "",
          minExperience: "",
          relativeExperience: "",
          alternativeExperience: "",
          duties: "",
          skills: "",
          jobGrade: "",
          jobCategory: "",
          description: "",
          workUnit: "",
          jobType: "nonmanagerial",
          reportsTo: "",
          educationLevel: "",
          qualificate: "",
          language: "",
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
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 0" },
              }}
              className="form-group"
            >
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
                error={!!touched.jobGrade && !!errors.jobGrade}
                helperText={touched.jobGrade && errors.jobGrade}
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
                error={!!touched.jobCategory && !!errors.jobCategory}
                helperText={touched.jobCategory && errors.jobCategory}
                sx={{ gridColumn: "span 2" }}
              >
                {jobCategory.map((type, index) => (
                  <MenuItem key={index} value={type.id}>
                    {type.jobCategoryName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                name="workUnit"
                label="Work Unit"
                value={values.workUnit}
                onChange={handleChange}
                error={!!touched.workUnit && !!errors.workUnit}
                helperText={touched.workUnit && errors.workUnit}
                sx={{ gridColumn: "span 2" }}
              >
                {workunits.map((type, index) => (
                  <MenuItem key={index} value={type.id}>
                    {type.workUnitName}
                  </MenuItem>
                ))}
              </TextField>

              {/* job type */}

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
                multiline
                value={values.description}
                onChange={handleChange}
                name="description"
                type="text"
                onBlur={handleBlur}
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                select
                name="educationLevel"
                label="Educational Level"
                value={values.educationLevel}
                onChange={handleChange}
                error={!!touched.educationLevel && !!errors.educationLevel}
                helperText={touched.educationLevel && errors.educationLevel}
                sx={{ gridColumn: "span 2" }}
              >
                {educationLevels.map((type, index) => (
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
                type="number"
                id="minExperience"
                name="minExperience"
                value={values.minExperience}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Relevant Experience"
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
                label="Qualification"
                value={values.qualificate}
                onChange={handleChange}
                error={!!touched.qualificate && !!errors.qualificate}
                helperText={touched.qualificate && errors.qualificate}
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
                multiline
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
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
              >
                Create New Job
              </Button>
            </Box>

            {successMessage && (
              <span display="flex" className="success-message">
                Job created successfully!
              </span>
            )}
            <ListJobRegistration refreshKey={refreshKey} />
          </Form>
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
          <Button
            onClick={handleSaveDepartment}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default CreateJobRegistration;
