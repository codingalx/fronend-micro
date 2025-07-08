import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert

} from "@mui/material";
import * as yup from "yup";
import { Formik } from "formik";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import {
  CreateNestedCriteriaName,
  fetchExistingNestedCriteriaName,
} from "../../Api/ApiPromo";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../Header";
import ListNestedCriteria from "./ListNestedCriteria";
import NotPageHandle from "../common/NotPageHandle";
const CreateNestedCriteria = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { criteriaNameId } = location.state || {};
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [existingCriteria, setExistingCriteria] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  useEffect(() => {
   
  fetchExistingCriteria();
    
  }, []);

  const fetchExistingCriteria = async () => {
    
  if (!criteriaNameId) {
    return <NotPageHandle message="No criteria selected for nested criteria" navigateTo="/promotion/nestedcriteria" />;
  }

    try {
      setLoading(true);
      const response = await fetchExistingNestedCriteriaName(tenantId, criteriaNameId);
      setExistingCriteria(response.data || []);
    } catch (error) {
      console.error("Error fetching existing nested criteria:", error);
      setNotification({
        open: true,
        message: "",
        severity: "warning",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const promotionSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string(),
  });

  const initialValues = {
    name: "",
    description: "",
  };

  const validate = (values) => {
    const errors = {};
    
    const isNameAlreadyUsed = existingCriteria.some(
      (criteria) => criteria.name.toLowerCase() === values.name.toLowerCase()
    );
    
    if (isNameAlreadyUsed) {
      errors.name = "This criteria name is already in use";
    }
    
    return errors;
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);
      
      const isNameAlreadyUsed = existingCriteria.some(
        (criteria) => criteria.name.toLowerCase() === values.name.toLowerCase()
      );
      
      if (isNameAlreadyUsed) {
        setNotification({
          open: true,
          message: "This criteria name is already in use",
          severity: "error",
        });
        return;
      }

      await CreateNestedCriteriaName(tenantId, criteriaNameId, values);
      setNotification({
        open: true,
        message: "Nested criteria created successfully!",
        severity: "success",
      });
      setRefreshKey(prev => prev + 1);

      resetForm();
    } catch (error) {
      console.error("Error creating nested criteria:", error);
      setNotification({
        open: true,
        message: "Error creating nested criteria",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    
      <Box m="20px">
      <Header subtitle= "Create Child Criteria" />       
        
      
          <Formik
            initialValues={initialValues}
            validationSchema={promotionSchema}
            onSubmit={handleFormSubmit}
            validate={validate}
            validateOnBlur
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(12, minmax(0, 1fr))" // 12-column grid
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? "span 6" : "span 12", // 6 columns each on desktop, full width on mobile
                    },
                  }}
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    sx={{ gridColumn: "span 2" }}

                    label="Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    margin="normal"
                  />

                  <TextField
                    fullWidth
                    sx={{ gridColumn: "span 4" }}
                    variant="outlined"
                    label="Description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.description && !!errors.description}
                    helperText={touched.description && errors.description}
                    margin="normal"
                    multiline
                    rows={4}
                  />
                </Box>
               <Box display="flex" justifyContent="center" mt="20px">
               <Button type="submit" color="secondary" variant="contained">
                         Submit
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
              <Alert 
                onClose={handleCloseSnackbar} 
                severity={notification.severity}
                sx={{ width: '100%' }}
              >
                {notification.message}
              </Alert>
            </Snackbar>

      <ListNestedCriteria refreshKey={refreshKey} criteriaNameId={criteriaNameId} />
    </Box>
  );
};

export default CreateNestedCriteria;