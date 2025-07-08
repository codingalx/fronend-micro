import React, { useEffect, useState } from 'react';
import {
  TextField,
  Box,
  Button,
  Typography,
  Snackbar,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Autocomplete,
  CircularProgress,
  Alert
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  createPromotionCandidate,
  fetchAllApprovedRecruitments,
  fetchAllPromotionCandidate,
  getAllEmployee,
  getEmployeeByEmployeIdd,
  fetchAllRecruitmentsById
} from '../../Api/ApiPromo';
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import ListPromotionCandidates from './ListPromotionCandidate';
import Header from '../Header';
import useMediaQuery from "@mui/material/useMediaQuery";

const CreatePromotionCandidate = () => {
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [employees, setEmployees] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [existingCandidates, setExistingCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  useEffect(() => {
   
    fetchData();

  }, []);


  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeesResponse, recruitments, candidates] = await Promise.all([
        getAllEmployee(tenantId),
        fetchAllApprovedRecruitments(tenantId),
        fetchAllPromotionCandidate(tenantId)
      ]);
      
      setEmployees(employeesResponse.data || []);
      setVacancies(recruitments.data || []);
      setExistingCandidates(candidates.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setNotification({
        open: true,
        message: 'Error loading required data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    vacancyNumber: Yup.string().required('Vacancy number is required'),
    employeeId: Yup.string().required('Employee ID is required')
  });

  const initialValues = 
  {
     vacancyNumber: '',
     employeeId: ''
     };

     const handleSubmit = async (values, { resetForm }) => {
      try {
        setLoading(true);
    
        const employeeResponse = await getEmployeeByEmployeIdd(tenantId, values.employeeId);
        const employee = employeeResponse.data;
    
        if (!employee) {
          setNotification({
            open: true,
            message: 'Employee not found',
            severity: 'error'
          });
          return;
        }
    
        const selectedVacancy = vacancies.find(v => v.vacancyNumber === values.vacancyNumber);
        if (!selectedVacancy) {
          setNotification({
            open: true,
            message: 'Selected vacancy not found',
            severity: 'error'
          });
          return;
        }
    
        // Try to create the promotion candidate directly
        await createPromotionCandidate(tenantId, {
          employeeId: values.employeeId,
          vacancyNumber: values.vacancyNumber
        });
    
        setNotification({
          open: true,
          message: 'Candidate created successfully',
          severity: 'success'
        });
        resetForm();
        setRefreshKey(prev => prev + 1);
    
      } catch (error) {
        if (error.response?.status === 409) {
          // Handle specific case where candidate already exists
          setNotification({
            open: true,
            message: 'This employee is already a candidate for this vacancy',
            severity: 'warning'
          });
        } else {
          // Generic error handler
          console.error('Error creating candidate:', error);
          setNotification({
            open: true,
            message: error.response?.data?.message || 'Error creating candidate',
            severity: 'error'
          });
        }
      } finally {
        setLoading(false);
      }
    };
    

  return (
    <Box m="20px">
      <Header subtitle="Create Promotion Candidate" />
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(12, minmax(0, 1fr))"
                sx={{
                  "& > div": {
                    gridColumn: isNonMobile ? "span 6" : "span 12",
                  },
                }}
              >
                <Autocomplete
                  freeSolo
                  options={employees.map(emp => emp.employeeId)}
                  value={values.employeeId}
                  onChange={(event, newValue) => {
                    setFieldValue('employeeId', newValue || '');
                  }}
                  onInputChange={(event, newInputValue) => {
                    setFieldValue('employeeId', newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Employee ID"
                      error={touched.employeeId && Boolean(errors.employeeId)}
                      helperText={touched.employeeId && errors.employeeId}
                      required
                      fullWidth
                    />
                  )}
                />
        
                {/* Vacancy Selection */}
                <FormControl fullWidth error={touched.vacancyNumber && Boolean(errors.vacancyNumber)}>
                  <InputLabel>Vacancy Number *</InputLabel>
                  <Select
                    name="vacancyNumber"
                    value={values.vacancyNumber}
                    onChange={(e) => setFieldValue('vacancyNumber', e.target.value)}
                    label="Vacancy Number *"
                  >
                    {vacancies.map((vacancy) => (
                      <MenuItem key={vacancy.id} value={vacancy.vacancyNumber}>
                        {vacancy.vacancyNumber}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.vacancyNumber && errors.vacancyNumber && (
                    <Typography color="error" variant="body2">
                      {errors.vacancyNumber}
                    </Typography>
                  )}
                </FormControl>
              </Box>
        
              <Box display="flex" justifyContent="center" mt="20px">
                <Button 
                  type="submit" 
                  color="secondary" 
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Submit'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      )}

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
      
      <ListPromotionCandidates refreshKey={refreshKey} />
    </Box>
  );
};

export default CreatePromotionCandidate;