import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { addAssessment, listAssessment } from "../../../configuration/RecruitmentApp";
import Header from "../common/Header";
import { useLocation } from 'react-router-dom';
import AlertSnackbar from "./AlertSnackbar ";
import ListAssessementWeight from "./ListAssessementWeight";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';



const CreateAssessmentWeight = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const recruitmentId = location?.state?.id;
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId
  

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");
 
  const handleFormSubmit = async (values) => {
    const total = parseFloat(values.writtenExam) + parseFloat(values.interview) + parseFloat(values.experience) + parseFloat(values.other) + parseFloat(values.cgpa) + parseFloat(values.practicalExam);

    if (total !== 100) {
      setAlertMessage(`Total score must be 100. Current total is ${total}`);
      setAlertSeverity("error");
      setAlertOpen(true);
      return;
    }

    try {
      const response = await listAssessment(tenantId);
     
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = response.data;
      const exists = data.some(ad => ad.recruitmentId === recruitmentId);

      if (exists) {
        navigate('/recruitment/assessmenterror');
        return;
      }

      await addAssessment(tenantId,values);
      console.log("Form data submitted successfully!");
      navigate('/recruitment/more');

      
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setAlertMessage("Failed to submit form data.");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };
 

  const initialValues = {
    writtenExam: "",
    interview: "",
    experience: "",
    other: "",
    recruitmentId: recruitmentId,
    cgpa: "",
    practicalExam: ""
  };

  const checkoutSchema = yup.object().shape({
    writtenExam: yup
      .number()
      .min(0, "Written score cannot be negative")
      .max(100, "Written score cannot exceed 100")
      .required("Written Exam score is required"),
    interview: yup
      .number()
      .min(0, "Interview score cannot be negative")
      .max(100, "Interview score cannot exceed 100")
      .required("Interview score is required"),
    experience: yup
      .number()
      .min(0, "Experience score cannot be negative")
      .max(100, "Experience score cannot exceed 100")
      .required("Experience score is required"),
    other: yup
      .number()
      .min(0, "Other score cannot be negative")
      .max(100, "Other score cannot exceed 100")
      .required("Other score is required"),
    cgpa: yup
      .number()
      .min(0, "CGPA score cannot be negative")
      .max(100, "CGPA score cannot exceed 100")
      .required("CGPA score is required"),
    practicalExam: yup
      .number()
      .min(0, "Practical Exam score cannot be negative")
      .max(100, "Practical Exam score cannot exceed 100")
      .required("Practical Exam score is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create Assessment Weight" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
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
                type="number"
                label="Written Exam"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.writtenExam}
                name="writtenExam"
                error={!!touched.writtenExam && !!errors.writtenExam}
                helperText={touched.writtenExam && errors.writtenExam}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="number"
                label="Practical Exam"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.practicalExam}
                name="practicalExam"
                error={!!touched.practicalExam && !!errors.practicalExam}
                helperText={touched.practicalExam && errors.practicalExam}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="number"
                label="Interview"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.interview}
                name="interview"
                error={!!touched.interview && !!errors.interview}
                helperText={touched.interview && errors.interview}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="number"
                label="Experience"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.experience}
                name="experience"
                error={!!touched.experience && !!errors.experience}
                helperText={touched.experience && errors.experience}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="number"
                label="Other"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.other}
                name="other"
                error={!!touched.other && !!errors.other}
                helperText={touched.other && errors.other}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="number"
                label="CGPA"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cgpa}
                name="cgpa"
                error={!!touched.cgpa && !!errors.cgpa}
                helperText={touched.cgpa && errors.cgpa}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Assessment Weight
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <AlertSnackbar
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
        severity={alertSeverity}
      />
      <ListAssessementWeight />
    </Box>
  );
};

export default CreateAssessmentWeight;
