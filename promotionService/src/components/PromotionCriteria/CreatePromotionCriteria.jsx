import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Container,
  Typography,
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
  createPromotionCriteria,
  fetchAllPromotionCriteriaName,
  fetchAllPromotionCriteria,
} from "../../Api/ApiPromo";
import useMediaQuery from "@mui/material/useMediaQuery";
import ListPromotionCriteria from "./ListPromotionCriteria";
import Header from "../Header";



const CreatePromotionCriteria = () => {
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
 
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [refreshKey, setRefreshKey] = useState(0);
  const [promotionCriteria, setPromotionCriteria] = useState([]);


  const [notification,setNotification] = useState({
    open:false,
    message:"",
    severity:"success"
  })

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const promotionSchema = yup.object().shape({
    criteriaNameId: yup.string().required("Criteria Name is required"),
    weight: yup.string().required("Weight is required"),
  });

  const initialValues = {
    criteriaNameId: "",
    weight: "",
  };

 
  
  

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const response = await fetchAllPromotionCriteria(tenantId);
      const existingCriteriaData = response.data || [];
  
      const isCriteriaCreated = existingCriteriaData.some(
        (criteria) => criteria.criteriaNameId === values.criteriaNameId
      );
      
      if (isCriteriaCreated) {
        setNotification({
          open: true,
          message: "This criteria already exists",
          severity: "warning"
        });
        return;
      }
  
      const existingTotalWeight = existingCriteriaData.reduce(
        (sum, item) => sum + (item.weight || 0),
        0
      );
  
      const newWeight = parseFloat(values.weight) || 0;
  
      if (existingTotalWeight + newWeight > 100) {
        setNotification({
          open: true,
          message: "Total weight exceeds 100! Please adjust the weight.",
          severity: "error",
        });
        return; 
      }
  
      const remainingWeight = 100 - (existingTotalWeight + newWeight);
  
      await createPromotionCriteria(tenantId, {
        criteriaNameId: values.criteriaNameId,
        weight: newWeight
      });
  
      setNotification({
        open: true,
        message: `Promotion criteria created successfully! Remaining weight: ${remainingWeight}`,
        severity: "success",
      });
  
      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error creating promotion criteria:", error);
      setNotification({
        open: true,
        message: "Error creating weight.",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchAllPromotionCriteriaNamee();
  }, []);

  const fetchAllPromotionCriteriaNamee = async () => {
    try {
      const response = await fetchAllPromotionCriteriaName(tenantId);
      setPromotionCriteria(response.data);
    } catch (error) {
      console.error("Error fetching promotion criteria:", error.message);
    }
  };

  return (
    
      <Box m="20px" >
       <Header subtitle="Weight Promotion Criteria" />
        <Formik
          initialValues={initialValues}
          validationSchema={promotionSchema}
          onSubmit={handleFormSubmit}
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
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" }
              }}
              >
                <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                  <InputLabel id="criteriaNameId">Criteria Name</InputLabel>
                  <Select
                    labelId="id"
                    value={values.id}
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
                  {touched.criteriaNameId && errors.criteriaNameId && (
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                      {errors.criteriaNameId}
                    </Typography>
                  )}
                </FormControl>

                {/* Weight Input */}
                <TextField
                  fullWidth
                  label="Weight"
                  name="weight"
                  value={values.weight}
                  sx={{ gridColumn: "span 2" }}
                                    onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.weight && !!errors.weight}
                  helperText={touched.weight && errors.weight}
                />
              </Box>

              {/* Submit Button */}
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
                   <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
                     {notification.message}
                   </Alert>
                 </Snackbar>

      {/* List of Promotion Criteria */}
      <ListPromotionCriteria refreshKey={refreshKey} />
    </Box>
  );
};

export default CreatePromotionCriteria;
