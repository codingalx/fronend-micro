import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  useMediaQuery,
} from '@mui/material';
import * as Yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import { updateExitInterview, getExitInterview } from '../../Api/separationApi';
import { getEmployeeById } from '../../Api/separationApi';
import { Formik } from 'formik';
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import Header from '../../common/Header';
import NotPageHandle from "../../common/NoPageHandle";

// Validation schema moved outside component
const exitInterviewSchema = Yup.object({
  employeeName: Yup.string().required('Employee name is required'),
  leaveReason: Yup.string().required('Leave reason is required'),
  remark: Yup.string(),
});

const UpdateExitInterview = () => {
  const isNonMobile = useMediaQuery('(min-width:600px)');
  const navigate = useNavigate();
  const location = useLocation();
  const { exitInterviewId } = location.state || {};
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const username = authState.username;

  const [initialValues, setInitialValues] = useState({
    employeeName: '',
    leaveReason: '',
    remark: '',
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loading, setLoading] = useState(true);

 
  const fetchExitInterview = async () => {
    return await getExitInterview(tenantId, exitInterviewId);
  };

  const fetchEmployeeData = async () => {
    return await getEmployeeById(tenantId, username);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [exitInterviewResponse, employeeResponse] = await Promise.all([
        fetchExitInterview(),
        fetchEmployeeData()
      ]);
      
      const employeeData = employeeResponse.data;
      setInitialValues({
        employeeName: `${employeeData.firstName} ${employeeData.middleName || ''} ${employeeData.lastName}`.trim(),
        leaveReason: exitInterviewResponse.data.leaveReason,
        remark: exitInterviewResponse.data.remark || '',
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setNotification({
        open: true,
        message: 'Failed to fetch exit interview or employee data.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchData();
  }, []);

  const handleFormSubmit = async (values) => {
    try {
      await updateExitInterview(tenantId, exitInterviewId, {
        leaveReason: values.leaveReason,
        remark: values.remark,
      });
      setNotification({
        open: true,
        message: 'Exit interview updated successfully!',
        severity: 'success',
      });
      setTimeout(() => navigate(-1), 2000);
    } catch (error) {
      console.error('Error updating exit interview:', error);
      setNotification({
        open: true,
        message: 'Failed to update exit interview.',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  if (!exitInterviewId) {
    return <NotPageHandle message="No Exit Interview selected to Update" navigateTo="/create-exit-interview" />;
  }

 

  return (
    <Box m="20px">
      <Header subtitle="Update Exit Interview" />
      
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
                Update
              </Button>
            </Box>
          </form>
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
    </Box>
  );
};

export default UpdateExitInterview;