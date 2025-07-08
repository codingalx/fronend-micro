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
import Header from "../common/Header";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import {  getApplicantExperencesbyId,
  updateApplicantExperience, } from "../../../configuration/RecruitmentApp";
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';

const EditApplicantExperience = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState("");
  const location = useLocation();
  const {  applicantId } = location.state;
  const experienceId = location?.state?.id
    const [authState] = useAtom(authAtom); 
    const tenantId = authState.tenantId

  const [experience, setExperience] = useState({
    experience: {
      institution: "",
      experienceType: "",
      jobTitle: "",
      salary: "",
      startDate: "",
      endDate: "",
      responsibility: "",
      reasonForTermination: "",
      duration: "",
      locationId: 0,
    },
    document: "",
  });

  useEffect(() => {
    fetchApplicantExperience();
  }, []);

  const fetchApplicantExperience = async () => {
    try {
      const response = await getApplicantExperencesbyId(tenantId,applicantId, experienceId);
      const data = response.data;
  
      const formattedData = {
        experience: {
          institution: data.institution || "",
          experienceType: ["DIRECT", "RELATED"].includes(data.experienceType.toUpperCase()) ? data.experienceType.toUpperCase() : "",
          jobTitle: data.jobTitle || "",
          salary: data.salary || "",
          startDate: data.startDate || "",
          endDate: data.endDate || "",
          responsibility: data.responsibility || "",
          reasonForTermination: data.reasonForTermination || "",
          duration: data.duration || "",
          locationId: data.locationId || 0,
        },
        document: data.document || "",
      };
  
      setExperience(formattedData);
    } catch (error) {
      console.error("Failed to fetch Applicant Experience:", error.message);
    }
  };
  
  const handleFormSubmit = async (values) => {
    // Ensure dates are in "yyyy-MM-dd" format before submission
    const formattedValues = {
      ...values,
      experience: {
        ...values.experience,
        experienceType: ["DIRECT", "RELATED"].includes(values.experience.experienceType) ? values.experience.experienceType : "",
        startDate: values.experience.startDate
          ? format(new Date(values.experience.startDate), 'yyyy-MM-dd')
          : '',
        endDate: values.experience.endDate
          ? format(new Date(values.experience.endDate), 'yyyy-MM-dd')
          : '',
      },
    };
  
    console.log("Formatted form values:", formattedValues);
    try {
      const formData = new FormData();
      formData.append(
        "experience",
        new Blob([JSON.stringify(formattedValues.experience)], {
          type: "application/json",
        })
      );
  
      formData.append("document", experience.document);
  
      const response = await updateApplicantExperience(
        tenantId,
        applicantId,
        experienceId,
        formData
      );
  
      if (response.status === 200) {
        // navigate("/recruitment/listapplicantExperence", {
        //   state: { applicantId },
        // });
        const id = applicantId;
        navigate("/recruitment/moreaboutapplicant", { state: { id } });
      } else {
        console.error("Error updating experience. Status code:", response.status);
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
      } else {
        console.error("An error occurred while updating the experience:", error.message);
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
      salary: yup
        .number()
        .required("Salary is required")
        .min(0, "Salary must be a non-negative value"),
      locationId: yup.number().required("Location is required"),
      startDate: yup
        .date()
        .required("Start Date is required")
        .max(dayjs(), "Start Date must be in the past"),
      endDate: yup
        .date()
        .required("End Date is required")
        .max(dayjs(), "End Date must be in the past or present"),
      responsibility: yup.string().required("Responsibility is required"),
      reasonForTermination: yup.string().required("Reason for Termination is required"),
      duration: yup.string().required("Duration is required"),
    }),
    document: yup.mixed().required("Document is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Edit Applicant Experience" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={experience}
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
                error={
                  !!touched.experience?.institution &&
                  !!errors.experience?.institution
                }
                helperText={
                  touched.experience?.institution && errors.experience?.institution
                }
                sx={{ gridColumn: "span 2" }}
              />

             <FormControl
  fullWidth
  sx={{ gridColumn: "span 2" }}
>
  <InputLabel>Experience Type</InputLabel>
  <Select
    value={values.experience.experienceType || ""}
    onChange={handleChange}
    onBlur={handleBlur}
    name="experience.experienceType"
    error={
      !!touched.experience?.experienceType &&
      !!errors.experience?.experienceType
    }
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
                error={
                  !!touched.experience?.responsibility &&
                  !!errors.experience?.responsibility
                }
                helperText={
                  touched.experience?.responsibility &&
                  errors.experience?.responsibility
                }
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
                error={
                  !!touched.experience?.startDate && !!errors.experience?.startDate
                }
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
                error={
                  !!touched.experience?.reasonForTermination &&
                  !!errors.experience?.reasonForTermination
                }
                helperText={
                  touched.experience?.reasonForTermination &&
                  errors.experience?.reasonForTermination
                }
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
                Update Experience
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default EditApplicantExperience;
