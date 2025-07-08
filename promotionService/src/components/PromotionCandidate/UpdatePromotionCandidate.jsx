import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  MenuItem,
  Box,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  fetchPromotionCandidateById,
  getEmployeeByEmployeId,
  updatePromotionCandidate,
  fetchAllRecruitments,
  getEmployeeByEmployeIdd,
} from "../../Api/ApiPromo";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import Header from "../Header";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import NotPageHandle from "../common/NotPageHandle";

const UpdatePromotionCandidate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const { id, name, vacancyNumber } = location.state || {};
  const [vacancies, setVacancies] = useState([]);

  const [initialValues, setInitialValues] = useState({
    vacancyNumber: "",
    employeeName: name,
  });

  useEffect(() => {
    loadCandidateAndVacancies();
  }, []);

  const loadCandidateAndVacancies = async () => {
    if (!id) {
      return (
        <NotPageHandle
          message="no candidate selected for updation"
          navigateTo="/promotion/createPromotionCandidate"
        ></NotPageHandle>
      );
    }
    try {
      const response = await fetchPromotionCandidateById(tenantId, id);
      const candidateData = response.data;
      const Empresponse = await getEmployeeByEmployeId(
        tenantId,
        candidateData.employeeId
      );
      const Data = Empresponse.data;
      const vacanciesResponse = await fetchAllRecruitments(tenantId);
      setVacancies(vacanciesResponse.data);

      setInitialValues({
        vacancyNumber: vacancyNumber || "",

        employeeId: Data.employeeId || "",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setNotification({
        open: true,
        message: "Error fetching data",
        severity: "Error",
      });
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    vacancyNumber: Yup.string().required("Vacancy Number is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await updatePromotionCandidate(tenantId, id, {
        employeeId: values.employeeId,
        vacancyNumber: values.vacancyNumber,
      });

      setNotification({
        open: true,
        message: "Candidate updated successfully!",
        severity: "success",
      });
      setTimeout(() => navigate("/promotion/createPromotionCandidate"), 1500);
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
    }finally {
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setNotification(false);
  };

  return (
    <Box m="20px">
      <IconButton
        aria-label="back"
        color="primary"
        onClick={() => navigate("/promotion/createPromotionCandidate")}
      >
        <ArrowBackIcon />
      </IconButton>

      <Header subtitle="Update Promotion Candidate" />
      {loading ? (
        <CircularProgress />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isSubmitting,
            values,
            touched,
            errors,
            handleChange,
            handleBlur,
            setFieldValue,
          }) => (
            <Form>
              <Box
                marginTop="40px"
                display="grid"
                ml="26%"
                gap="30px"
                gridTemplateColumns="repeat(3, 1fr)"
                sx={{
                  "& > div": { gridColumn: "span 1" },
                }}
              >
                <TextField
                  label="Employee Name"
                  name="employeeName"
                  value={name}
                  fullWidth
                  margin="normal"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.employeeName && Boolean(errors.employeeName)}
                  helperText={touched.employeeName && errors.employeeName}
                  InputProps={{ readOnly: true }}
                />

                <TextField
                  select
                  label="Vacancy Number"
                  name="vacancyNumber"
                  value={values.vacancyNumber}
                  fullWidth
                  margin="normal"
                  onChange={(event) =>
                    setFieldValue("vacancyNumber", event.target.value)
                  }
                  onBlur={handleBlur}
                  error={touched.vacancyNumber && Boolean(errors.vacancyNumber)}
                  helperText={touched.vacancyNumber && errors.vacancyNumber}
                >
                  {vacancies.map((vacancy) => (
                    <MenuItem key={vacancy.id} value={vacancy.vacancyNumber}>
                      {vacancy.vacancyNumber}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box display="flex" justifyContent="center" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Update
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
    </Box>
  );
};

export default UpdatePromotionCandidate;
