import React, { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik } from "formik";
import { getAssessmentBYrecruitmentId, getExamResultById, updateExamResult } from "../../../configuration/RecruitmentApp";
import Header from "../common/Header";
import AlertSnackbar from "../AssessementWeight/AlertSnackbar ";

import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';


const EditExamResult = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const { recruitmentId, applicantId  } = location.state;
  const examResultId = location.state?.id
  
            const [authState] = useAtom(authAtom); 
            const tenantId = authState.tenantId
        
  
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [assessmentWeight, setAssessmentWeight] = useState(null);

  const [assessement, setAssessement] = useState({
    writtenExam: "",
    interview: "",
    experience: "",
    other: "",
    assessmentWeightId: "",
    cgpa: "",
    practicalExam: "",
  });

  useEffect(() => {
    fetchExamResult();
  }, []);

  useEffect(() => {
    fetchAssessmentWeight(recruitmentId);
  }, [recruitmentId]);

  const fetchExamResult = async () => {
    try {
      const response = await getExamResultById(tenantId,recruitmentId, applicantId, examResultId);
      const data = response.data;
      setAssessement(data);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch advertisement:", error.message);
    }
  };

  const fetchAssessmentWeight = async (recruitmentId) => {
    try {
      const response = await getAssessmentBYrecruitmentId(tenantId,recruitmentId);
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = response.data;
      setAssessmentWeight(data);
      setAssessement(prevValues => ({
        ...prevValues,
        assessmentWeightId: data.assessmentWeightId,
      }));
      console.log("AssessmentWeight values are:", data);
    } catch (error) {
      console.error("Failed to fetch AssessmentWeight:", error);
      setAlertMessage("Failed to fetch AssessmentWeight data.");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  const getValidationSchema = (weights) => {
    return yup.object().shape({
      writtenExam: yup
        .number()
        .min(0, "Written score cannot be negative")
        .max(weights.writtenExam, `Written score cannot exceed ${weights.writtenExam}`)
        .required("Written Exam score is required"),
      interview: yup
        .number()
        .min(0, "Interview score cannot be negative")
        .max(weights.interview, `Interview score cannot exceed ${weights.interview}`)
        .required("Interview score is required"),
      experience: yup
        .number()
        .min(0, "Experience score cannot be negative")
        .max(weights.experience, `Experience score cannot exceed ${weights.experience}`)
        .required("Experience score is required"),
      other: yup
        .number()
        .min(0, "Other score cannot be negative")
        .max(weights.other, `Other score cannot exceed ${weights.other}`)
        .required("Other score is required"),
      cgpa: yup
        .number()
        .min(0, "CGPA score cannot be negative")
        .max(weights.cgpa, `CGPA score cannot exceed ${weights.cgpa}`)
        .required("CGPA score is required"),
      practicalExam: yup
        .number()
        .min(0, "Practical Exam score cannot be negative")
        .max(weights.practicalExam, `Practical Exam score cannot exceed ${weights.practicalExam}`)
        .required("Practical Exam score is required"),
    });
  };
  
  const handleFormSubmit = async (values) => {
    try {
      const response = await updateExamResult(
        tenantId,
        recruitmentId,
        applicantId,
        examResultId,
        values
      );
      console.log(response);
      setAlertMessage("Exam Result updated successfully");
      setAlertSeverity("success");
      setAlertOpen(true);
      // navigate("/recruitment/listexamresult", {
      //   state: { recruitmentId, applicantId },
      // });
      const id =applicantId 
      navigate('/recruitment/examResult', { state: { id,recruitmentId  } }); // 

    } catch (error) {
      console.error("Failed to update exam result:", error.message);
      setAlertMessage("Failed to update exam result.");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  }


  if (!assessmentWeight) {
    return <div>Loading...</div>;
  }

  const validationSchema = getValidationSchema(assessmentWeight);

  return (
    <Box m="20px">
      <Header subtitle="Edit Exam Result" />
      <Formik
        enableReinitialize
        onSubmit={handleFormSubmit}
        initialValues={assessement}
        validationSchema={validationSchema}
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
                type="text"
                label="Assessment Weight ID"
                value={values.assessmentWeightId}
                name="assessmentWeightId"
                error={!!touched.assessmentWeightId && !!errors.assessmentWeightId}
                helperText={touched.assessmentWeightId && errors.assessmentWeightId}
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  gridColumn: "span 2",
                  display: "none", // Hide the TextField
                }}
              />

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
                Edit Exam Result
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
    </Box>
  );
};

export default EditExamResult;
