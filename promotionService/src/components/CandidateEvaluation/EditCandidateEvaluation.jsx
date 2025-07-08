import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Snackbar,
  Box,
  IconButton,
  Grid,
  Alert,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  getCandidateEvaluationById,
  updateMyEvaluation,
} from "../../Api/ApiPromo";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import NotPageHandle from "../common/NotPageHandle";
import Header from "../Header";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const EditCandidateEvaluation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!location.state) {
    return (
      <NotPageHandle
        message="No Evaluation Selected for updation."
        navigateTo="/promotion/createPromotionCandidate"
      />
    );
  }

  const { evaluationId, candidateId, candidateName, criteriaName } =
    location.state;

  if (!evaluationId) {
    return (
      <NotPageHandle
        message="No Evaluation Selected for updation."
        navigateTo="/promotion/createPromotionCandidate"
      />
    );
  }

  const [notification, setNotification] = useState({
    open: true,
    message: "",
    severity: "success",
  });
  const [authState] = useAtom(authAtom);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const id = candidateId;
  const name = candidateName;

  const tenantId = authState.tenantId;

  const validationSchema = Yup.object({
    result: Yup.number()
      .required("Result is required")
      .min(0, "Result must be at least 0")
      .max(100, "Result must be at most 100"),
  });

  useEffect(() => {
    fetchEvaluationDetails();
  }, []);

  const fetchEvaluationDetails = async () => {
    try {
      const response = await getCandidateEvaluationById(
        tenantId,
        candidateId,
        evaluationId
      );
      setEvaluation(response.data);
    } catch (error) {
      console.error("Error fetching evaluation details:", error);
      setNotification({
        open: "true",
        message: "Error fetching evaluation details",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await updateMyEvaluation(
        tenantId,
        candidateId,
        evaluationId,
        values.result
      );
      setNotification({
        open: "true",
        message: "Evaluation updated successfully!",
        severity: "success",
      });
      setTimeout(  
        () => navigate("/promotion/CreateCandidateEvaluation", { state: { id, name } }),
        1800
      );
    } catch (error) {
      console.error("Error updating evaluation:", error);
      setNotification({
        open: "true",
        message: "error updating evaluation",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setNotification(false);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!evaluation) return <Typography>No evaluation data found.</Typography>;

  return (
    <Box m="20px">
      <IconButton
        aria-label="back"
        color="primary"
        onClick={() =>
          navigate("/promotion/CreateCandidateEvaluation", { state: { id, name } })
        }
      >
        <ArrowBackIcon />
      </IconButton>
      <Container maxWidth="sm">
        <Header subtitle="Update Evaluation" />
        <Formik
          initialValues={{
            candidateName: candidateName || "",
            criteriaName: criteriaName || "",
            result: evaluation?.result || 0,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, touched, errors, values }) => (
            <Form>
              <Grid container spacing={3}>
                {/* Candidate Name and Criteria Name in a 2-column layout */}
                <Grid item xs={6}>
                  <TextField
                    label="Candidate Name"
                    name="candidateName"
                    value={values.candidateName}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Criteria Name"
                    name="criteriaName"
                    value={values.criteriaName}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                {/* Result field and Update button in a single column */}
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    label="Result"
                    name="result"
                    type="number"
                    fullWidth
                    margin="normal"
                    error={touched.result && Boolean(errors.result)}
                    helperText={touched.result && errors.result}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="center" mt="8px">
                    <Button type="submit" color="secondary" variant="contained">
                      Update
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default EditCandidateEvaluation;
