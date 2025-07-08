import React, { useState,useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import Header from "../common/Header";
import ListCategory from "./ListCategory";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import { createCategory, getAllCategory } from "../../../configuration/EvaluationApi";



const CreateCategory = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId


  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const [category, setCategory] = useState([])

  useEffect(() => {
    fetchAllCategory();
}, []);

  const fetchAllCategory = async () => {
    try {
        const response = await getAllCategory(tenantId);
        const data = response.data;
        setCategory(data);
    } catch (error) {
        console.error("Error fetching category:", error.message);
        
    }
};


const handleFormSubmit = async (values, { resetForm }) => {
    try {
        const categoryNameExists = category.some(
            (category) => category.name === values.name
        );

        if (categoryNameExists) {
            setNotification({
                open: true,
                message: "Category Name already exists. Please use a different one.",
                severity: "warning",
            });
            return;
        }

        const totalWeight = category.reduce((acc, curr) => acc + curr.weight, 0);
        
        const newWeight = parseFloat(values.weight);
        if (totalWeight + newWeight > 100) {
            setNotification({
                open: true,
                message: "Total weight exceeds 100. Please adjust the weights.",
                severity: "warning",
            });
            return;
        }

        await createCategory(tenantId, values);
        setNotification({
            open: true,
            message: "Evaluation category created successfully!",
            severity: "success",
        });
        resetForm();
        setRefreshKey(prev => prev + 1);
        
    } catch (error) {
        console.error("Failed to submit form data:", error);
        setNotification({
            open: true,
            message: "Failed to create category name. Please try again.",
            severity: "error",
        });
    }
};

  const initialValues = {
    name: "",
    weight: "",
    description: ""
  };

  const checkoutSchema = yup.object().shape({
    name: yup.string().required("name is required"),
    weight: yup
    .number()
    .min(0, "Weight  score cannot be negative")
    .max(100, "Weight score cannot exceed 100")
    .required("Weight score is required"),
    
  });

  
  return (
    <Box m="20px">
      <Header subtitle= "Evaluation category " />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
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
                label="catgory Name "
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
                label="weight"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.weight}
                name="weight"
                error={!!touched.weight && !!errors.weight}
                helperText={touched.weight && errors.weight}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="description"
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
                Create Category
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      {/* Snackbar for Notifications */}
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
      <ListCategory  refreshKey={refreshKey}/>
          
    </Box>
  );
};

export default CreateCategory;