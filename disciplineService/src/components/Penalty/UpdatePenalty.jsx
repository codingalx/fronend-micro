import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { updatePenalty, getAllPenalties, getPenalty } from "../../Api/disciplineApi";
import NoPageHandle from "../../common/NoPageHandle";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import Header from "../../common/Header";

const UpdatePenalty = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { penaltyId } = location.state || {};

  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const [penalties, setPenalties] = useState([]);

  useEffect(() => {
    fetchAllPenalties();
  }, []);

  const fetchAllPenalties = async () => {
    try {
      const response = await getAllPenalties(tenantId);
      setPenalties(response.data);
    } catch (error) {
      console.error("Error fetching penalties:", error.message);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const penaltyExists = penalties.some(
        (penalty) => penalty.name === values.name && penalty.id !== penaltyId
      );

      if (penaltyExists) {
        setNotification({
          open: true,
          message: "Penalty with this name already exists.",
          severity: "warning",
        });
        return;
      }

      await updatePenalty(tenantId, penaltyId, values);
      setNotification({
        open: true,
        message: "Penalty updated successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey((prev) => prev + 1);
      navigate("/discipline/create-penalty");
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to update penalty. Please try again.",
        severity: "error",
      });
    }
  };

  const [error, setError] = useState(null);
  const [penaltyData, setPenaltyData] = useState({
    name: "",
    code: "",
    classification: "",
    actionTaker: "",
    description: ""
  });

  useEffect(() => {
      fetchPenalty();
  }, []);

  const fetchPenalty = async () => {
    try {
      const response = await getPenalty(tenantId, penaltyId);
      setPenaltyData(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const actionTakerOptions = [
    { value: "IMMEDIATE_BOSS", label: "Immediate Boss" },
    { value: "TOP_MANAGEMENT", label: "Top Management" },
  ];

  const checkoutSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    code: yup.string().required("Code is required"),
    classification: yup.string().required("Classification is required"),
    actionTaker: yup.string().required("Action taker is required"),
    description: yup.string().required("Description is required"),
  });

  if (!penaltyId) {
    return (
      <NoPageHandle
        message="No penalty selected for update."
        navigateTo="/discipline/create-penalty"
      />
    );
  }

  return (
    <Box m="20px">
      <Header subtitle="Update Penalty" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={penaltyData}
        validationSchema={checkoutSchema}
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
                type="text"
                label="Penalty Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Code"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.code}
                name="code"
                error={!!touched.code && !!errors.code}
                helperText={touched.code && errors.code}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Classification"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.classification}
                name="classification"
                error={!!touched.classification && !!errors.classification}
                helperText={touched.classification && errors.classification}
                sx={{ gridColumn: "span 2" }}
              />
              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel>Action Taker</InputLabel>
                <Select
                  label="Action Taker"
                  name="actionTaker"
                  value={values.actionTaker}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.actionTaker && !!errors.actionTaker}
                >
                  {actionTakerOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update Penalty
              </Button>
            </Box>
          </form>
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

export default UpdatePenalty;