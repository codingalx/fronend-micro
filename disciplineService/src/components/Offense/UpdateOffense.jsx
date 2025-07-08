import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik, Form } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { updateOffense, getAllOffenses, getOffense, getAllPenalties } from "../../Api/disciplineApi";
import NoPageHandle from "../../common/NoPageHandle";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import Header from "../../common/Header";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const UpdateOffense = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { offenseId } = location.state || {};

  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const [offenses, setOffenses] = useState([]);
  const [penalties, setPenalties] = useState([]);
  const [selectedPenalties, setSelectedPenalties] = useState([]);
  const [offenseData, setOffenseData] = useState({
    code: "",
    name: "",
    phaseOutTime: 0,
    weight: 0,
    description: "",
  });

  useEffect(() => {
    fetchAllOffenses();
    fetchAllPenalties();
  }, []);

  useEffect(() => {
      fetchOffense();
  }, []);

  const fetchAllOffenses = async () => {
    try {
      const response = await getAllOffenses(tenantId);
      setOffenses(response.data);
    } catch (error) {
      console.error("Error fetching offenses:", error.message);
      setNotification({
        open: true,
        message: "Failed to fetch existing offenses. Please try again.",
        severity: "error",
      });
    }
  };

  const fetchAllPenalties = async () => {
    try {
      const response = await getAllPenalties(tenantId);
      setPenalties(response.data);
    } catch (error) {
      console.error("Error fetching penalties:", error.message);
      setNotification({
        open: true,
        message: "Failed to fetch penalties. Please try again.",
        severity: "error",
      });
    }
  };

  const fetchOffense = async () => {
    try {
      const response = await getOffense(tenantId, offenseId);
      setOffenseData(response.data);
      setSelectedPenalties(response.data.penaltyIds || []);
    } catch (error) {
      console.error("Error fetching offense:", error.message);
      setNotification({
        open: true,
        message: "Failed to fetch offense data. Please try again.",
        severity: "error",
      });
    }
  };

  const handlePenaltyChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedPenalties(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const offenseExists = offenses.some(
        (offense) => (offense.code.toLowerCase() === values.code.toLowerCase() || 
                     offense.name.toLowerCase() === values.name.toLowerCase()) &&
                     offense.id !== offenseId
      );

      if (offenseExists) {
        setNotification({
          open: true,
          message: "Offense with this code or name already exists.",
          severity: "warning",
        });
        return;
      }

      const offenseData = {
        ...values,
        penaltyIds: selectedPenalties
      };

      await updateOffense(tenantId, offenseId, offenseData);
      setNotification({
        open: true,
        message: "Offense updated successfully!",
        severity: "success",
      });
      resetForm();
      setSelectedPenalties([]);
      setRefreshKey((prev) => prev + 1);
      navigate("/discipline/create-offense");
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to update offense. Please try again.",
        severity: "error",
      });
    }
  };

  const checkoutSchema = yup.object().shape({
    code: yup.string().required("Code is required"),
    name: yup.string().required("Name is required"),
    phaseOutTime: yup.number()
      .min(0, "Must be 0 or positive")
      .integer("Must be a whole number")
      .required("Phase out time is required"),
    weight: yup.number()
      .min(0, "Must be 0 or positive")
      .required("Weight is required"),
    description: yup.string(),
  });

  if (!offenseId) {
    return (
      <NoPageHandle
        message="No offense selected for update."
        navigateTo="/discipline/create-offense"
      />
    );
  }

  return (
    <Box m="20px">
      <Header subtitle="Update Offense" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={offenseData}
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
                label="Name"
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
                type="number"
                label="Phase Out Time (days)"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phaseOutTime}
                name="phaseOutTime"
                error={!!touched.phaseOutTime && !!errors.phaseOutTime}
                helperText={touched.phaseOutTime && errors.phaseOutTime}
                sx={{ gridColumn: "span 2" }}
                inputProps={{ min: 0, step: 1 }}
              />
              <TextField
                fullWidth
                type="number"
                label="Weight"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.weight}
                name="weight"
                error={!!touched.weight && !!errors.weight}
                helperText={touched.weight && errors.weight}
                sx={{ gridColumn: "span 2" }}
                inputProps={{ min: 0 }}
              />
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
              
              {/* Penalties Multi-Select Dropdown */}
              <Box sx={{ gridColumn: "span 2" }}>
                <FormControl fullWidth>
                  <InputLabel id="penalties-multiple-select-label">Associated Penalties</InputLabel>
                  <Select
                    labelId="penalties-multiple-select-label"
                    id="penalties-multiple-select"
                    multiple
                    value={selectedPenalties}
                    onChange={handlePenaltyChange}
                    input={<OutlinedInput label="Associated Penalties" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const penalty = penalties.find(p => p.id === value);
                          return (
                            <Chip 
                              key={value} 
                              label={penalty ? `${penalty.name} (${penalty.code})` : value} 
                            />
                          );
                        })}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {penalties.map((penalty) => (
                      <MenuItem
                        key={penalty.id}
                        value={penalty.id}
                      >
                        {`${penalty.name} (${penalty.code})`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update Offense
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

export default UpdateOffense;