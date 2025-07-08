import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Link,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik } from "formik";
import { getExperienceById, getExperienceFileById, updateExperience } from "../../Api/employeeApi";
import Header from "../common/Header";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import NotFoundHandle from "../common/NotFoundHandle";

const EditExperence = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const { employerId } = location.state;
  const experienceId = location.state.id;

  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const [experience, setExperience] = useState({
    institution: "",
    employmentType: "",
    jobTitle: "",
    salary: "",
    startDate: "",
    endDate: "",
    responsibility: "",
    reasonForTermination: "",
    document: null,
  });

  useEffect(() => {
    fetchExperience();
    fetchFileOfExperience();
  }, []);

  const fetchFileOfExperience = async () => {
    try {
      const response = await getExperienceFileById(tenantId, employerId, experienceId);
      if (response.ok) {
        setFileUrl(response.data.fileUrl); // Update this line to match your API response for the file URL
        setFileName(response.data.fileUrl.split('/').pop()); // Extract filename from URL
      } else {
        console.error("Failed to fetch the file. Status:", response.status);
      }
    } catch (error) {
      console.error("Failed to fetch experience document:", error.message);
    }
  };

  const fetchExperience = async () => {
    try {
      const response = await getExperienceById(tenantId, employerId, experienceId);
      const data = response.data;
      setExperience({
        institution: data.institution,
        employmentType: data.employmentType.toUpperCase(),
        jobTitle: data.jobTitle,
        salary: data.salary,
        startDate: data.startDate,
        endDate: data.endDate,
        responsibility: data.responsibility,
        reasonForTermination: data.reasonForTermination,
        document: null,
      });
    } catch (error) {
      console.error("Failed to fetch experience:", error.message);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("experience", new Blob([JSON.stringify(values)], { type: "application/json" }));
      formData.append("document", values.document || experience.document);
      const response = await updateExperience(tenantId, employerId, experienceId, formData);
      
      if (response.status === 200) {
        navigate('/employee/editDetails', { state: { id: employerId, isEditable: true, activeTab: 6 } }); 
      } else {
        console.error("Error updating experience. Status code:", response.status);
      }
    } catch (error) {
      console.error("An error occurred while updating the experience:", error.message);
    }
  };

  const handleFileUpload = (e, setFieldValue) => {
    const file = e.target.files[0];
    setFileName(file.name);
    setExperience((prevExperience) => ({
      ...prevExperience,
      document: file,
    }));
    setFieldValue("document", file);
  };

  const checkoutSchema = yup.object().shape({
    institution: yup.string().required("Institution name cannot be blank"),
    employmentType: yup.string().required("Employment type cannot be null"),
    jobTitle: yup.string().required("Job title cannot be blank"),
    salary: yup.number().min(0, "Salary must be a non-negative value").required("Salary is required"),
    startDate: yup.date().required("Start date is required").max(new Date(), "Start date must be in the past"),
    endDate: yup.date().required("End date is required").max(new Date(), "End date must be in the past or present")
      .when("startDate", (startDate, schema) => startDate ? schema.min(startDate, "End date must be after start date") : schema),
    responsibility: yup.string().required("Responsibility description cannot be blank"),
    reasonForTermination: yup.string().nullable(),
    document: yup.mixed().notRequired(),
  });

  if (!(experienceId && employerId)) {
    return <NotFoundHandle message="No employee experience selected for updation." navigateTo="/employee/list" />;
  }

  return (
    <Box m="20px">
      <Header title="Update Experience of Employer" />
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
                value={values.institution}
                name="institution"
                error={!!touched.institution && !!errors.institution}
                helperText={touched.institution && errors.institution}
                sx={{ gridColumn: "span 2" }}
              />
              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel>Employment Type</InputLabel>
                <Select
                  value={values.employmentType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="employmentType"
                  error={!!touched.employmentType && !!errors.employmentType}
                >
                  <MenuItem value="">
                    <em>Please Select Employment Type</em>
                  </MenuItem>
                  <MenuItem value="PERMANENT">Permanent</MenuItem>
                  <MenuItem value="CONTRACT">Contract</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                type="number"
                label="Salary"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.salary}
                name="salary"
                error={!!touched.salary && !!errors.salary}
                helperText={touched.salary && errors.salary}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Job Title"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.jobTitle}
                name="jobTitle"
                error={!!touched.jobTitle && !!errors.jobTitle}
                helperText={touched.jobTitle && errors.jobTitle}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Responsibility"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.responsibility}
                name="responsibility"
                error={!!touched.responsibility && !!errors.responsibility}
                helperText={touched.responsibility && errors.responsibility}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.startDate}
                name="startDate"
                error={!!touched.startDate && !!errors.startDate}
                helperText={touched.startDate && errors.startDate}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="date"
                label="End Date"
                InputLabelProps={{ shrink: true }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.endDate}
                name="endDate"
                error={!!touched.endDate && !!errors.endDate}
                helperText={touched.endDate && errors.endDate}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Reason for Termination"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.reasonForTermination}
                name="reasonForTermination"
                error={!!touched.reasonForTermination && !!errors.reasonForTermination}
                helperText={touched.reasonForTermination && errors.reasonForTermination}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="file"
                label="Choose To Change the Existing file"
                InputLabelProps={{ shrink: true }}
                onBlur={handleBlur}
                onChange={(e) => handleFileUpload(e, setFieldValue)}
                name="document"
                error={!!touched.document && !!errors.document}
                helperText={touched.document && errors.document}
                sx={{ gridColumn: "span 2" }}
                inputProps={{ accept: ".pdf,.doc,.docx" }}
                InputProps={{
                  startAdornment: (
                    <Box
                      component="div"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "80%",
                      }}
                    >
                      {fileName}
                    </Box>
                  ),
                }}
              />
              {fileUrl && (
                <Box sx={{ gridColumn: "span 4" }}>
                  <Typography variant="body2">
                    Download To see the Existing file:{" "}
                    <Link href={fileUrl} download={fileName}>
                      {fileName}
                    </Link>
                  </Typography>
                </Box>
              )}
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

export default EditExperence;  