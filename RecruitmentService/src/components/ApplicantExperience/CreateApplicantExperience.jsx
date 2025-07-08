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
import Header from '../common/Header'
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import dayjs from 'dayjs';
import {  addApplicantExperences, listLocation } from "../../../configuration/RecruitmentApp";
import { useEffect } from "react";
import ListApplicantExperience from "./ListApplicantExperience";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';


const CreateApplicantExperience = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState("");
  const location = useLocation();
  const applicantId = location?.state?.id
  const [locations, setLocations] = useState([]);
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await listLocation(tenantId);
      setLocations(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching locations:', error);
    }
  };



  const [experience, setExperience] = useState({
    experience: {
      institution: "",
      experienceType: "",
      jobTitle: "",
      salary: "",
      locationId: "",
      startDate: "",
      endDate: "",
      responsibility: "",
      reasonForTermination: "",
      
      duration: "",
    },
    document: "",
  });

  const handleFormSubmit = async (values) => {
    console.log("Form values:", values);
    try {
      const formData = new FormData();
      formData.append(
        "experience",
        new Blob([JSON.stringify(values.experience)], { type: "application/json" })
      );

      formData.append("document", experience.document);

      const response = await addApplicantExperences(tenantId,applicantId, formData);

      if (response.status === 201) {
        console.log("Experience added successfully!");
        // navigate("/recruitment/listapplicantExperence", { state: { applicantId } });
      } else {
        console.error("Error adding experience of Applicant. Status code:", response.status);
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
      } else {
        console.error("An error occurred while adding the experience:", error.message);
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setExperience((prevExperience) => ({
      ...prevExperience,
      document: file,
    }));
    setImagePreview(URL.createObjectURL(file));
  };

  const checkoutSchema = yup.object().shape({
    experience: yup.object().shape({
      institution: yup.string().required("Institution name is required"),
      experienceType: yup.string().required("Experience Type is required"),
      jobTitle: yup.string().required("Job Title is required"),
      salary: yup.number().required("Salary is required").min(0, "Salary must be a non-negative value"),
      locationId: yup.string().required("Location is required"),
      startDate: yup.date().required("Start Date is required").max(dayjs(), "Start Date must be in the past"),
      endDate: yup.date().required("End Date is required").max(dayjs(), "End Date must be in the past or present"),
      responsibility: yup.string().required("Responsibility is required"),
      reasonForTermination: yup.string().required("Reason for Termination is required"),
     
      duration: yup.string().required("Duration is required"),
    }),
    document: yup.mixed().required("Document is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create Experience Of Applicant" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={experience}
        validationSchema={checkoutSchema}
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
                label="Institution"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.experience.institution}
                name="experience.institution"
                error={!!touched.experience?.institution && !!errors.experience?.institution}
                helperText={touched.experience?.institution && errors.experience?.institution}
                sx={{ gridColumn: "span 2" }}
              />

              <FormControl  fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel>Experience Type</InputLabel>
                <Select
                  value={values.experience.experienceType || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="experience.experienceType"
                  error={!!touched.experience?.experienceType && !!errors.experience?.experienceType}
                >
                  <MenuItem value="">
                    <em>Please Select Experience Type</em>
                  </MenuItem>
                  <MenuItem value="DIRECT">Direct</MenuItem>
                  <MenuItem value="RELATED">Related</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="number"
                label="Salary"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.experience.salary}
                name="experience.salary"
                error={!!touched.experience?.salary && !!errors.experience?.salary}
                helperText={touched.experience?.salary && errors.experience?.salary}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                label="Job Title"
                value={values.experience.jobTitle}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                name="experience.jobTitle"
                error={!!touched.experience?.jobTitle && !!errors.experience?.jobTitle}
                helperText={touched.experience?.jobTitle && errors.experience?.jobTitle}
                sx={{ gridColumn: "span 2" }}
              />


              <TextField
                fullWidth
                type="text"
                label="Responsibility"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.experience.responsibility}
                name="experience.responsibility"
                error={!!touched.experience?.responsibility && !!errors.experience?.responsibility}
                helperText={touched.experience?.responsibility && errors.experience?.responsibility}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="date"
                format="yyyy-MM-dd"
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.experience.startDate}
                name="experience.startDate"
                error={!!touched.experience?.startDate && !!errors.experience?.startDate}
                helperText={touched.experience?.startDate && errors.experience?.startDate}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="date"
                format="yyyy-MM-dd"
                label="End Date"
                InputLabelProps={{ shrink: true }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.experience.endDate}
                name="experience.endDate"
                error={!!touched.experience?.endDate && !!errors.experience?.endDate}
                helperText={touched.experience?.endDate && errors.experience?.endDate}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="text"
                label="Duration"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.experience.duration}
                name="experience.duration"
                error={!!touched.experience?.duration && !!errors.experience?.duration}
                helperText={touched.experience?.duration && errors.experience?.duration}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="text"
                label="Reason for Termination"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.experience.reasonForTermination}
                name="experience.reasonForTermination"
                error={!!touched.experience?.reasonForTermination && !!errors.experience?.reasonForTermination}
                helperText={touched.experience?.reasonForTermination && errors.experience?.reasonForTermination}
                sx={{ gridColumn: "span 2" }}
              />
              
              <FormControl  sx={{ gridColumn: "span 2" }}>
                <InputLabel id="locationId">Location</InputLabel>
                <Select
                  labelId="locationId"
                  value={values.experience.locationId || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="experience.locationId"
                  error={!!touched.experience?.locationId && !!errors.experience?.locationId}
                >
                  <MenuItem value="">
                    <em>Select Location</em>
                  </MenuItem>
                  {locations.map((location) => (
                    <MenuItem key={location.id} value={location.id}>
                      {location.locationName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

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
                Create Experience of Applicant
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <ListApplicantExperience  applicantId ={applicantId}/>

    </Box>
  );
};

export default CreateApplicantExperience;
