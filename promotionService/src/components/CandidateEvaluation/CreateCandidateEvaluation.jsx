import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  Snackbar,
  MenuItem,
  Alert
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  fetchAllPromotionCriteria,
  createCandidateEvaluation,
  fetchPromotionCriteriaNameById,
  fetchAllPromotionCandidate,
  fetchAllCandidateEvaluation, // Add this import
} from "../../Api/ApiPromo";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import ListCandidateEvaluation from "./ListCandidateEvaluation";
import NotPageHandle from "../common/NotPageHandle";
import Header from "../Header";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useMediaQuery from "@mui/material/useMediaQuery";




const CreateCandidateEvaluation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, name } = location.state || {};

  const [notification, setNotification] = useState({
       open: false,
       message: "",
       severity: "success",
     });
  const [authState] = useAtom(authAtom);
  const [criteriaList, setCriteriaList] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [evaluations, setEvaluations] = useState([]);
  const tenantId = authState.tenantId;
  const [refreshKey, setRefreshKey] = useState(0);
  const [existingEvaluations, setExistingEvaluations] = useState([]); 
  const isNonMobile = useMediaQuery("(min-width:600px)");


  const validationSchema = Yup.object({
    result: Yup.number()
      .required('Result is required')
      .min(0, 'Result must be at least 0')
      .max(Yup.ref('maxWeight'), 'Result must not exceed the maximum weight for the selected criteria'),
    criteriaId: Yup.string().required('Criteria ID is required'),
    candidateId: Yup.string().required('Candidate ID is required'),
    maxWeight: Yup.number(), 
  });

  useEffect(() => {
    const fetchData = async () => {
      await fetchAllPromotionCriter();
      await fetchAllPromotionCandidates();
      await fetchExistingEvaluations(); 
    };
    fetchData();
  }, [id]); 

  const fetchAllPromotionCriter = async () => {
    try {
      const response = await fetchAllPromotionCriteria(tenantId);
      const criteriaData = response.data;

      const criteriaWithNames = await Promise.all(
        criteriaData.map(async (criteria) => {
          try {
            const criteriaNameResponse = await fetchPromotionCriteriaNameById(
              tenantId,
              criteria.criteriaNameId
            );
            return {
              id: criteria.id,
              name: criteriaNameResponse.data.name,
              weight: criteria.weight, 
            };
          } catch (error) {
            console.error("Error fetching criteria name:", error);
            return {
              id: criteria.id,
              name: "Unknown Criteria", 
              weight: criteria.weight, 
            };
          }
        })
      );

      setCriteriaList(criteriaWithNames);
    } catch (error) {
      console.error("Error fetching criteria:", error);
     setNotification({
      open:true,
      message:"Failed to fetch criteria. Please try again later",
      severity:"error"
     })
    }
  };

  const fetchAllPromotionCandidates = async () => {
    try {
      const response = await fetchAllPromotionCandidate(tenantId);
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setNotification({
        open:true,
        message:"Error fetching candidates:",
        severity:"error"
       })
    }
  };

  const fetchExistingEvaluations = async () => {
    
      try {
      const response = await fetchAllCandidateEvaluation(tenantId, id);
      setExistingEvaluations(response.data);
    } catch (error) {
      console.error("Error fetching existing evaluations:", error);
      setNotification({
        open:true,
        message:"Error fetching existing evaluations:",
        severity:"error"
       })
    }
  };

 

  const initialValues = {
    result: "",
    criteriaId: "",
    candidateId: id, 
  };
  if (!id) {
    return (
      <NotPageHandle
        message="No Candidate selected to Evaluate"
        navigateTo="/promotion/createPromotionCandidate"
      />
    );
  }  

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const evaluationExists = existingEvaluations.some(
        (evaluation) => evaluation.criteriaId === values.criteriaId
      );
      if (evaluationExists) {
        setNotification({
          open:true,
          message:"An evaluation for this criteria already exists",
          severity:"warning"
         })
        return; 
      }
  
      const newEvaluation = {
        id: Date.now(), 
        candidateName: name,
        criteriaName:
          criteriaList.find((c) => c.id === values.criteriaId)?.name || "Unknown",
        result: values.result,
        candidateId: values.candidateId,
      };
  
      setEvaluations([...evaluations, newEvaluation]);
  
      const response = await createCandidateEvaluation(
        tenantId,
        values.candidateId,
        { result: values.result, criteriaId: values.criteriaId }
      );
  
      setEvaluations((prevEvaluations) =>
        prevEvaluations.map((evaluation) =>
          evaluation.id === newEvaluation.id ? response.data : evaluation
        )
      );
  
      setNotification({
        open:true,
        message:"Evaluation created successfully!",
        severity:"success"
       })
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error creating evaluation:", error);
      setNotification({
        open:true,
        message:"Error creating evaluation!",
        severity:"error"
       })
  
      // Remove the temporary evaluation from the local state if the API call fails
      setEvaluations((prevEvaluations) =>
        prevEvaluations.filter((evaluation) => evaluation.id !== newEvaluation.id)
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setNotification(false);
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="flex-end" mb={2}>
          <IconButton
            aria-label="back"
            color="primary"
            onClick={() => navigate('/promotion/createPromotionCandidate')}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>
       <Header subtitle="Create Candidate Evaluation" />
        <Typography variant="h6" gutterBottom>
          Evaluating: {name || "Unknown Candidate"} 
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, touched, errors, values, setFieldValue }) => (
            <Form>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" }
              }}
              >
                <Field
                  as={TextField}
                  label="Result"
                  name="result"
                  type="number"
                  fullWidth
                  // margin="normal"
                  sx={{ gridColumn: "span 2" }}
                  error={touched.result && Boolean(errors.result)}
                  helperText={touched.result && errors.result}
                />
  
                <TextField
                  select
                  label="Select Criteria"
                  name="criteriaId"
                  fullWidth
                  sx={{ gridColumn: "span 2" }}

                  // margin="normal"
                  value={values.criteriaId}
                  onChange={(event) => {
                    setFieldValue("criteriaId", event.target.value);
                    const selectedCriterion = criteriaList.find(
                      (c) => c.id === event.target.value
                    );
                    setFieldValue(
                      "maxWeight",
                      selectedCriterion ? selectedCriterion.weight : 0
                    );
                  }}
                  error={touched.criteriaId && Boolean(errors.criteriaId)}
                  helperText={touched.criteriaId && errors.criteriaId}
                >
                  {criteriaList.map((criterion) => (
                    <MenuItem key={criterion.id} value={criterion.id}>
                      {criterion.name} (Max Weight: {criterion.weight})
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
  
             
              <Box display="flex" justifyContent="center" mt="20px">
                             <Button type="submit" color="secondary" variant="contained">
                                 Submit
                               </Button>
                             </Box>
            </Form>
          )}
        </Formik>
  
        {/* Snackbar for Notifications */}
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
      <ListCandidateEvaluation
        refreshKey={refreshKey}
        evaluations={evaluations}
      />
    </Box>
  );
};

export default CreateCandidateEvaluation;