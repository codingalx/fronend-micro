import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, TextField, Button, Alert, Snackbar, MenuItem, Box, IconButton } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Formik, Form } from 'formik';
import ListPromoteCandidate from './ListPromoteCandidate';
import * as Yup from 'yup';
import {
  createPromoteCandidate,
  fetchAllPromotionCandidate,
  fetchAllPayGrade,
  fetchAllPromoteCandidate,
} from '../../Api/ApiPromo';
import { useAtom } from 'jotai';
import Header from '../Header';
import { authAtom } from 'shell/authAtom';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NotPageHandle from '../common/NotPageHandle';
import useMediaQuery from "@mui/material/useMediaQuery";



const CreatePromoteCandidate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, name } = location.state || {}; 
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [payGrades, setPayGrades] = useState([]); 
  const [selectedPayGradeId, setSelectedPayGradeId] = useState(''); 
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const validationSchema = Yup.object({
    payGradeId: Yup.string().required('Pay Grade ID is required'),
    candidateId: Yup.string().required('Candidate ID is required'),
  });

  const fetchPayGrades = async () => {
    try {
      setLoading(true);
      const response = await fetchAllPayGrade(tenantId);
      setPayGrades(response.data);
    } catch (error) {
      console.error('Error fetching pay grades:', error);
      showNotification('Error fetching pay grades', 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkCandidatePromotion = async () => {
    try {
      const response = await fetchAllPromoteCandidate(tenantId);
      return response.data.some(promotion => promotion.candidate.id === id);
    } catch (error) {
      console.error('Error checking promotion:', error);
      showNotification('Error checking candidate promotion status', 'error');
      return false;
    }
  };

  const promoteCandidate = async (payload) => {
    try {
      await createPromoteCandidate(tenantId, payload);
      showNotification('Candidate promoted successfully', 'success');
      setRefreshKey(prev => prev + 1);
      return true;
    } catch (error) {
      console.error('Error promoting candidate:', error);
      showNotification('Error promoting candidate', 'error');
      return false;
    }
  };

  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (id) {
      fetchPayGrades();
    }
  }, [id, tenantId]);

  const initialValue = {
    payGradeId: selectedPayGradeId,
    candidateId: id,
    candidateName: name
  };

  if (!id) {
    return <NotPageHandle message="No Candidate selected to Promote" navigateTo="/promotion/createPromotionCandidate" />;
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      
      const isPromoted = await checkCandidatePromotion();
      if (isPromoted) {
        showNotification('Candidate is already promoted', 'warning');
        return;
      }

      const payload = { ...values, payGradeId: selectedPayGradeId, candidateId: id };
      await promoteCandidate(payload);
    } finally {
      setSubmitting(false);
    }
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

      <Header subtitle="Promote Candidate" />
      <Formik
        initialValues={initialValue}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize 
      >
        {({ isSubmitting, touched, errors, setFieldValue, values }) => (
          <Form>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": {
                  gridColumn: isNonMobile ? undefined : "span 4",
                },
              }}
            >
              <TextField
                label="Candidate Name"
                name="candidateName"
                fullWidth
                value={name}
                sx={{ gridColumn: "span 2" }}
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                select
                label="Salary Step"
                name="payGradeId"
                fullWidth
                sx={{ gridColumn: "span 2" }}
                value={selectedPayGradeId}
                onChange={(event) => {
                  setSelectedPayGradeId(event.target.value);
                  setFieldValue('payGradeId', event.target.value);
                }}
                error={touched.payGradeId && Boolean(errors.payGradeId)}
                helperText={touched.payGradeId && errors.payGradeId}
                disabled={loading}
              >
                {loading ? (
                  <MenuItem disabled>Loading pay grades...</MenuItem>
                ) : payGrades.length === 0 ? (
                  <MenuItem disabled>No pay grades available</MenuItem>
                ) : (
                  payGrades.map((payGrade) => (
                    <MenuItem key={payGrade.id} value={payGrade.id}>
                      {payGrade.salaryStep || `Pay Grade ${payGrade.id}`}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Box>

            <Box display="flex" justifyContent="center" mt="20px">
              <Button 
                type="submit" 
                color="secondary" 
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Promoting...' : 'Promote'}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
      
      <ListPromoteCandidate refreshKey={refreshKey} />
    </Box>
  );
};

export default CreatePromoteCandidate;