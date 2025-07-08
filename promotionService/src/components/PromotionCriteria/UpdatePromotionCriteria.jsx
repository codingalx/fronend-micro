import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from "@mui/material";
import * as yup from "yup";
import { Formik } from "formik";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import {
  fetchPromotionCriteriaById,
  fetchAllPromotionCriteriaName,
  updatePromotionCriteria,
  fetchAllPromotionCriteria,
} from "../../Api/ApiPromo";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLocation, useNavigate } from "react-router-dom";
import NotPageHandle from "../common/NotPageHandle";
import Header from "../Header";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
  


const UpdatePromotionCriteria = () => {
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const location = useLocation();
  const promotionCriteriaId = location.state?.promotionCriteriaId; 
  const navigate = useNavigate();

  const [promotionCriteria, setPromotionCriteria] = useState([]); 
  const [allPromotionCriteria, setAllPromotionCriteria] = useState([]); 

  const [promotionCriterial, setPromotionCriterial] = useState({
    criteriaNameId: "",
    weight: "",
  });

  const promotionSchema = yup.object().shape({
    criteriaNameId: yup.string().required("Name is required"),
    weight: yup.string().required("Weight is required"),
  });

  

  useEffect(() => {
    fetchPromotionCriterialById();
    fetchAllPromotionCriteriaNames();
    fetchAllPromotionCriteriaData(); 
  }, [promotionCriteriaId]); 

  const fetchPromotionCriterialById = async () => {
    if (!promotionCriteriaId) {
      return (
        <NotPageHandle
          message="No criteria selected for updation"
          navigateTo="/promotion/CreatePromotionCriteria"
        />
      );
    }
    try {
      const response = await fetchPromotionCriteriaById(
        tenantId,
        promotionCriteriaId
      );
      setPromotionCriterial(response.data);
    } catch (error) {
      console.error("Error fetching promotion criteria:", error.message);
      setNotification({
        open: true,
        message: "Failed to fetch promotion criteria.",
        severity: "error",
      });
    }
  };

  const fetchAllPromotionCriteriaNames = async () => {
    try {
      const response = await fetchAllPromotionCriteriaName(tenantId);
      setPromotionCriteria(response.data);
    } catch (error) {
      console.error("Error fetching promotion criteria names:", error.message);
      setNotification({
        open: true,
        message: "Failed to fetch promotion criteria names.",
        severity: "error",
      });
    }
  };

  const fetchAllPromotionCriteriaData = async () => {
    try {
      const response = await fetchAllPromotionCriteria(tenantId);
      setAllPromotionCriteria(response.data);
    } catch (error) {
      console.error("Error fetching all promotion criteria:", error.message);
      setNotification({
        open: true,
        message: "Failed to fetch all promotion criteria.",
        severity: "error",
      });
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const isCriteriaExists = allPromotionCriteria.some(
        (criteria) =>
          criteria.criteriaNameId === values.criteriaNameId &&
          criteria.id !== promotionCriteriaId 
      );

      if (isCriteriaExists) {
        setNotification({
          open: true,
          message:
            "A criteria with this name already exists in the promotion criteria.",
          severity: "error",
        });
        return;
      }

      await updatePromotionCriteria(tenantId, promotionCriteriaId, values);
      setNotification({
        open: true,
        message: "Promotion criteria updated successfully!",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/promotion/CreatePromotionCriteria"); 
      }, 1000); 
      resetForm();
    } catch (error) {
      console.error("Error updating promotion criteria:", error);
      setNotification({
        open: true,
        message: "Failed to update promotion criteria.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    
    <Box m="20px">
    <IconButton
      aria-label="back"
      color="primary"
      onClick={() => navigate('/promotion/createPromotionCriteria')}
    >
      <ArrowBackIcon />
    </IconButton>
  
    <Container maxWidth="sm" sx={{ mt: 4 }}>
     <Header subtitle="Update Promotion Criteria" />
      <Formik
        initialValues={promotionCriterial}
        validationSchema={promotionSchema}
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
              <FormControl sx={{ gridColumn: "span 4" }}>
                <InputLabel id="criteriaNameId">Criteria Name</InputLabel>
                <Select
                  labelId="criteriaNameId"
                  value={values.criteriaNameId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  name="criteriaNameId"
                  error={!!touched.criteriaNameId && !!errors.criteriaNameId}
                  label="Criteria Name"
                >
                  <MenuItem value="">
                    <em>Select Criteria Name</em>
                  </MenuItem>
                  {promotionCriteria.map((criteria) => (
                    <MenuItem key={criteria.id} value={criteria.id}>
                      {criteria.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Weight"
                name="weight"
                value={values.weight}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.weight && !!errors.weight}
                helperText={touched.weight && errors.weight}
                margin="normal"
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
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
               anchorOrigin={{ vertical: "top", horizontal: "right" }}
             >
               <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
                 {notification.message}
               </Alert>
             </Snackbar>
    </Container>
    </Box>
    
  );
};

export default UpdatePromotionCriteria;
