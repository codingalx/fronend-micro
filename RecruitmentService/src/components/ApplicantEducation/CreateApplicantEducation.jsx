import {
  Box,
Button,
TextField,
MenuItem,
Select,
FormControl,
InputLabel,
Snackbar,Alert
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../common/Header";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Formik } from "formik";
import {  addApplicantEducations, listEducationLevels, listFieldStudies  } from "../../../configuration/RecruitmentApp";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import ListApplicantEducation from "./ListApplicantEducation";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';




const CreateApplicantEducation = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const applicantId = location?.state?.id
   const [imagePreview, setImagePreview] = useState("");
   const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
    

  const [educationLevels, setEducationLevels] = useState([]);
  const [fieldOfStudies, setFieldOfStudies] = useState([]);
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId
  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };
  

  const [education, setEducation] = useState({
    educationLevelId: "",
    educationType: "",
    fieldOfStudyId: "",
    institution: '',
    startDate: '',
    endDate: '',
    result: '',
    document: ""
  });

  useEffect(() => {
    fetchEducationLevels();
    fetchFieldOfStudies();
  }, []);
  
  const fetchEducationLevels = async () => {
    try {
      const response = await listEducationLevels(tenantId);
      setEducationLevels(response.data);
      console.log(response.data); // Optional: log the data to the console
    } catch (error) {
      console.error('Error fetching education levels:', error.message);
    }
  };
  
  const fetchFieldOfStudies = async () => {
    try {
      const response = await listFieldStudies(tenantId);
      setFieldOfStudies(response.data);
      console.log(response.data); // Optional: log the data to the console
    } catch (error) {
      console.error('Error fetching field of studies:', error.message);
    }
  };
  

  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("education", new Blob([JSON.stringify(values)], { type: "application/json" }));
      formData.append("document", values.document);

      const response = await addApplicantEducations(tenantId,applicantId, formData);

      if (response.status === 201) {
        setNotification({
          open: true,
          message: "Applicant education  created successfully!",
          severity: "success",
        });
         
      } else {
        console.error("Error adding education. Status code:", response.status);
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
        setNotification({
          open: true,
          message: "Failed to create applicant education. Please try again.",
          severity: "error",
        });
      } else {
        console.error("An error occurred while adding the education:", error.message);
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setEducation(prevEducation => ({
      ...prevEducation,
      document: file
    }));
    setImagePreview(URL.createObjectURL(file));
  };

  const checkoutSchema = yup.object().shape({
    educationLevelId: yup.string().required("Education Level is required"),
    educationType: yup.string().required("Education Type is required"),
    fieldOfStudyId: yup.string().required("Field of Study is required"),
    institution: yup.string().required("Institution is required"),
    startDate: yup.date().required("Start Date is required").max(new Date(), "Start date must be in the past or present"),
    endDate: yup.date().required("End Date is required").max(new Date(), "End date must be in the past or present"),
  
    result: yup.number().required("Result/CGPA is required").min(0, "Result must be a non-negative value").max(100, "Result cannot exceed 100"),
    document: yup.mixed().required("Document is required")
  });

  return (
    <Box m="20px">
   
  
   
       
      <Header subtitle="Create education of employee"  />
      <Formik
        initialValues={education}
        validationSchema={checkoutSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" }
              }}
            >
              <FormControl  sx={{ gridColumn: "span 2" }}>
              <InputLabel id="fieldOfStudy">Education Level</InputLabel>
                <Select
                  labelId="educationLevel"
                  value={values.educationLevelId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  name="educationLevelId"
                  error={!!touched.educationLevelId && !!errors.educationLevelId}
                >
                  <MenuItem value="">
                    <em>Select Education Level</em>
                  </MenuItem>
                  {educationLevels.map((educationLevel) => (
                    <MenuItem key={educationLevel.id} value={educationLevel.id}>
                      {educationLevel.educationLevelName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl  sx={{ gridColumn: "span 2" }}>
                <InputLabel id="fieldOfStudy">Fields of Study</InputLabel>
                <Select
                  labelId="fieldOfStudy"
                  value={values.fieldOfStudyId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  name="fieldOfStudyId"
                  error={!!touched.fieldOfStudyId && !!errors.fieldOfStudyId}
                >
                  <MenuItem value="">
                    <em>Select Field of Study</em>
                  </MenuItem>
                  {fieldOfStudies.map((fieldOfStudy) => (
                    <MenuItem key={fieldOfStudy.id} value={fieldOfStudy.id}>
                      {fieldOfStudy.fieldOfStudy}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              

              <FormControl  sx={{ gridColumn: "span 2" }}>
                <Select
                label="Education Type"
                value={values.educationType}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                displayEmpty
                inputProps={{ "aria-label": "educationType" }}
                error={!!touched.educationType && !!errors.educationType}
                name="educationType"
                sx={{ gridColumn: "span 2" }}
              >
                  <MenuItem value="">
                    <em>Education Type</em>
                  </MenuItem>
                  <MenuItem value="REGULAR">Regular</MenuItem>
                  <MenuItem value="WEEKEND">Weekend</MenuItem>
                  <MenuItem value="NIGHT">Night</MenuItem>
                  <MenuItem value="DISTANCE">Distance</MenuItem>
                  <MenuItem value="SUMMER">Summer</MenuItem>
                   </Select>
                
              </FormControl>
            
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.startDate}
                name="startDate"
                error={!!touched.startDate && !!errors.startDate}
                helperText={touched.startDate && errors.startDate}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />

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
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                type="text"
                label="School/Institution"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.institution}
                name="institution"
                error={!!touched.institution && !!errors.institution}
                helperText={touched.institution && errors.institution}
                sx={{ gridColumn: "span 2" }}
              />

            

              <TextField
                fullWidth
                type="text"
                label="Result/CGPA"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.result}
                name="result"
                error={!!touched.result && !!errors.result}
                helperText={touched.result && errors.result}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                type="file"
                fullWidth
                name="document"
                onChange={(e) => {
                  handleFileUpload(e);
                  setFieldValue("document", e.currentTarget.files[0]);
                }}
                onBlur={handleBlur}
                error={!!touched.document && !!errors.document}
                helperText={touched.document && errors.document}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Education
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

      <ListApplicantEducation   applicantId={applicantId} />

    </Box>
  );
};


export default CreateApplicantEducation;




