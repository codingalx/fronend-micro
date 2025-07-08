import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Typography,
  Container,
  useMediaQuery,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../common/Header";
import NotPageHandle from "../../common/NoPageHandle";
import { approveRetirement, getRetirement } from "../../Api/separationApi";

const ApproveRetirement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState("");
  const [currentRemark, setCurrentRemark] = useState(""); 
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  if (!location.state) {
    return <NotPageHandle message="No Retirement selected to Approve" navigateTo="/separation/list-retirement" />;
  }

  const { tenantId, retirementId } = location.state;

  const fetchRetirementData = async () => {
    try {
      const response = await getRetirement(tenantId, retirementId);
      const retirementData = response.data;
      setCurrentStatus(retirementData.status);
      setCurrentRemark(retirementData.remark || ""); 
    } catch (error) {
      console.error('Error fetching retirement data:', error);
      setNotification({
        open: true,
        message: 'Failed to load retirement data.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    if (values.decision === currentStatus && values.remark === currentRemark) {
      setNotification({
        open: true,
        message: `Retirement is already ${currentStatus.toLowerCase()} and remark unchanged. No changes made.`,
        severity: 'info',
      });
      return;
    }

    try {
      await approveRetirement(tenantId, retirementId, values);
      setNotification({
        open: true,
        message: `Retirement ${values.decision.toLowerCase()} successfully!`,
        severity: 'success',
      });
      navigate('/separation/list-retirement');
    } catch (error) {
      console.error('Approval failed:', error);
      setNotification({
        open: true,
        message: 'Failed to update retirement status.',
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    fetchRetirementData();
  }, []);

  const initialValues = {
    decision: currentStatus || 'PENDING',
    remark: currentRemark || '', 
  };

  const validationSchema = Yup.object({
    remark: Yup.string(),
    decision: Yup.string().required('Decision is required'),
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h6" component="div" style={{ textAlign: 'center', marginTop: '2rem' }}>
          Loading retirement data...
        </Typography>
      </Container>
    );
  }

  return (
    <Box m="20px">
      <Header subtitle= "Update Retirement Status"  />
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
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
              gridTemplateColumns={isNonMobile ? "repeat(4, minmax(0, 1fr))" : "1fr"}
              sx={{
                "& > div": { 
                  gridColumn: isNonMobile ? "span 2" : "span 1",
                },
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="decision-label">Decision</InputLabel>
                <Select
                  labelId="decision-label"
                  id="decision"
                  name="decision"
                  value={values.decision}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.decision && !!errors.decision}
                  label="Decision"
                >
                  <MenuItem value="PENDING">PENDING</MenuItem>
                  <MenuItem value="APPROVED">APPROVED</MenuItem>
                  <MenuItem value="REJECTED">REJECTED</MenuItem>
                </Select>
                {touched.decision && errors.decision && (
                  <Box color="red" fontSize="12px">{errors.decision}</Box>
                )}
              </FormControl>

              <TextField
                fullWidth
                id="remark"
                name="remark"
                label="Remark"
                value={values.remark}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.remark && !!errors.remark}
                helperText={touched.remark && errors.remark}
                multiline
                rows={4}
                sx={{ 
                  gridColumn: isNonMobile ? "span 2" : "span 1",
                }}
              />
            </Box>

            <Box display="flex" justifyContent={isNonMobile ? "start" : "flex-start"} mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update Status
              </Button>
            </Box>
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
    </Box>
  );
};

export default ApproveRetirement;