import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  useMediaQuery,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import { createExitInterview, getEmployeeById } from '../../Api/separationApi';
import Header from '../../common/Header';
import ListExitInterview from './ListExitInterview';

const exitInterviewSchema = Yup.object({
  employeeName: Yup.string().required('Employee name is required'),
  leaveReason: Yup.string().required('Leave reason is required'),
  remark: Yup.string(),
});

const CreateExitInterview = () => {
  const isNonMobile = useMediaQuery('(min-width:600px)');
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const username = authState.username;
  const [employee, setEmployee] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [refreshKey, setRefreshKey] = useState(0);

 
  const fetchEmployee = async () => {
    try {
      const response = await getEmployeeById(tenantId, username);
      const employeeData = response.data;
      setEmployee(employeeData);
      setEmployeeId(employeeData.id);
    } catch (error) {
      console.error('Error fetching employee details', error);
      setNotification({
        open: true,
        message: 'Failed to load employee data',
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const initialValues = {
    employeeName: employee ? `${employee.firstName} ${employee.middleName || ''} ${employee.lastName}`.trim() : '',
    leaveReason: '',
    remark: '',
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      await createExitInterview(tenantId, {
        ...values,
        employeeId: employeeId,
      });
      setNotification({
        open: true,
        message: 'Exit interview created successfully!',
        severity: 'success',
      });
      resetForm();
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error creating exit interview:', error);
      setNotification({
        open: true,
        message: 'Failed to create exit interview.',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box m="20px">
      <Header subtitle="Create Exit Interview" />
      
      <Formik
        initialValues={initialValues}
        validationSchema={exitInterviewSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <Form onSubmit={handleSubmit}>
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
                name="employeeName"
                label="Employee Name"
                value={values.employeeName}
                InputProps={{ readOnly: true }}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                name="leaveReason"
                label="Leave Reason"
                value={values.leaveReason}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.leaveReason && !!errors.leaveReason}
                helperText={touched.leaveReason && errors.leaveReason}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                name="remark"
                label="Remark"
                value={values.remark}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.remark && !!errors.remark}
                helperText={touched.remark && errors.remark}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Submit
              </Button>
            </Box>
          </Form>
        )}
      </Formik>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
      
      <ListExitInterview key={refreshKey} />
    </Box>
  );
};

export default CreateExitInterview;