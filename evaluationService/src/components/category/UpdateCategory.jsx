import React, { useState, useEffect } from "react";
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
import { getAllCategory, getCategoryById, updateCategory } from "../../../configuration/EvaluationApi";
import { useLocation, useNavigate } from "react-router-dom";
import NotFoundHandle from '../common/NotFoundHandle'

const UpdateCategory = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {};

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({
    name: "",
    weight: "",
    description: ""
  });

  useEffect(() => {
    fetchAllCategories();
    fetchCategory();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const response = await getAllCategory(tenantId);
      const data = response.data;
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await getCategoryById(tenantId, id);
      setCategory(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const categoryNameExists = categories.some(
        (cat) => cat.name === values.name && cat.id !== id
      );

      if (categoryNameExists) {
        setNotification({
          open: true,
          message: "Category Name already exists. Please use a different one.",
          severity: "warning",
        });
        return;
      }

      // Calculate total weight excluding the current category
      const totalWeight = categories.reduce((acc, curr) => {
        return acc + (curr.id !== id ? curr.weight : 0); // Exclude the current category's weight
      }, 0);
      
      const newWeight = parseFloat(values.weight);
      if (totalWeight + newWeight > 100) {
        setNotification({
          open: true,
          message: "Total weight exceeds 100. Please adjust the weights.",
          severity: "warning",
        });
        return;
      }

      await updateCategory(tenantId, id, values);
      setNotification({
        open: true,
        message: "Evaluation category updated successfully!",
        severity: "success",
      });
      resetForm();
      navigate('/evaluation/evalution_setup', { state: { id, activeTab: 0 } }); 
      setRefreshKey(prev => prev + 1);
      
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to update category name. Please try again.",
        severity: "error",
      });
    }
  };

  const checkoutSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    weight: yup
      .number()
      .min(0, "Weight score cannot be negative")
      .max(100, "Weight score cannot exceed 100")
      .required("Weight score is required"),
  });

  if (!id) {
    return <NotFoundHandle message="No category selected for updation." navigateTo="/evaluation/category" />;
  }

  return (
    <Box m="20px">
      <Header subtitle="Evaluation category" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={category}
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
                label="Category Name"
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
                label="Weight"
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
                Update Category
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
    </Box>
  );
};

export default UpdateCategory;