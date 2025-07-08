import React, { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { addExamResult, getAssessmentBYrecruitmentId, listExamResult } from "../../../configuration/RecruitmentApp";
import Header from "../common/Header";
import { useLocation } from "react-router-dom";
import ListExamResult from "./ListExamResult";
import AlertSnackbar from "../AssessementWeight/AlertSnackbar ";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';


const CreateExamResult = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const { recruitmentId } = location.state;
  const applicantId = location.state?.id
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [assessmentWeight, setAssessmentWeight] = useState(null);
  const [examResults, setExamResults] = useState([]);
    const [authState] = useAtom(authAtom); 
    const tenantId = authState.tenantId

  useEffect(() => {
    fetchListOfExamResult();
  }, []);

  const fetchListOfExamResult = async () => {
    try {
      const response = await listExamResult(tenantId,recruitmentId);
      const data = response.data;
      setExamResults(data);
      console.log(data);
    } catch (error) {
      console.error(error.message);
      setAlertMessage("Failed to fetch exam results.");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  const [initialValues, setInitialValues] = useState({
    writtenExam: "",
    interview: "",
    experience: "",
    other: "",
    assessmentWeightId: "",
    cgpa: "",
    practicalExam: "",
  });

  useEffect(() => {
    fetchAssessmentWeight(recruitmentId);
  }, [recruitmentId]);

  const fetchAssessmentWeight = async (recruitmentId) => {
    try {
      const response = await getAssessmentBYrecruitmentId(tenantId,recruitmentId);
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = response.data;
      setAssessmentWeight(data);
      const { id } = data;
      setInitialValues((prevValues) => ({
        ...prevValues,
        assessmentWeightId: id,
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
    const applicantExists = examResults.some(
      (examResult) => examResult.applicantId === applicantId
    );


    if (applicantExists) {

      navigate("/recruitment/examresultexist", {
        state: { recruitmentId, applicantId },
      });
      return;
    }

    try {
      await addExamResult(tenantId,recruitmentId, applicantId, values);
   
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setAlertMessage("Failed to submit form data.");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  if (!assessmentWeight) {
    return <div>Loading...</div>;
  }

  const validationSchema = getValidationSchema(assessmentWeight);

  return (
    <Box m="20px">
      <Header subtitle="Create Exam Result" />
      <Formik
        enableReinitialize
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
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
                Create Exam Result
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
      <ListExamResult recruitmentId={recruitmentId} applicantId={applicantId} />
    </Box>
  );
};

export default CreateExamResult;
