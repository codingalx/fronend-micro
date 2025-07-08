import React, { useState, useEffect } from "react";
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
  createPromotionCriteriaName,
  fetchAllPromotionCriteriaName,
} from "../../Api/ApiPromo";
import useMediaQuery from "@mui/material/useMediaQuery";
import ListPromotion from "./ListPromotion";
import Header from "../Header";


const CreateName = () => {
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  
  const [existingCriteria, setExistingCriteria] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const isNonMobile = useMediaQuery("(min-width:600px)");

    const [notification, setNotification] = useState({
      open: false,
      message: "",
      severity: "success",
    });

    
  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  
  useEffect(() => {
    fetchExistingCriteria();
  }, []);


  const fetchExistingCriteria = async () => {
    try {
      const response = await fetchAllPromotionCriteriaName(tenantId);
      setExistingCriteria(response.data);
    } catch (error) {
      console.error("Error fetching existing criteria:", error);
      setNotification({
        open: true,
        message: "Error fetching existing criteria:.",
        severity: "warning",
      });
    }
  };
 

  const promotionSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string(),
  });

  const initialValues = {
    name: "",
    description: "",
  };

   

  const handleFormSubmit = async (values, { resetForm }) => {

    try {
      const isNameAlreadyUsed = existingCriteria.some(
        (criteria) => criteria.name.toLowerCase() === values.name.toLowerCase()
      );
      if (isNameAlreadyUsed) {
        setNotification({
          open: true,
          message: "This criteria name is already in use.",
          severity: "warning",
        });        
        return;
      }
     
    
      await createPromotionCriteriaName(tenantId, values);
      setNotification({
        open: true,
        message: "Promotion Criteria Created Succssfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey((prev) => prev + 1);
    } 
    catch (error) {
      console.error("Error creating promotion criteria:", error);
      setNotification({
        open: true,
        message: "Error creating promotion criteria!",
        severity: "error",
      }); 
    }
  };

  return (
    
      <Box m="20px">
      <Header subtitle= "Create Promotion" />       
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
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  margin="normal"
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
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
                  sx={{
                    gridColumn: "span 2",
                    "& .MuiInputBase-root": {
                      height: "auto",
                    },
                  }}
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
             <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
               {notification.message}
             </Alert>
           </Snackbar>

      <ListPromotion refreshKey={refreshKey} />
      </Box> 
       );
};

export default CreateName;
