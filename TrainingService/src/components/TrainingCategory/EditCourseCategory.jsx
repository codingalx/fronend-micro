import React, { useEffect, useState } from "react";
import { 
  Box, Button, Grid, TextField, DialogContent, Snackbar, Alert 
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import {  listCourseCategory, updateCourseCategory, getTrainingCourseCategoryById  } from "../../../configuration/TrainingApi";
import LayoutForCourse from "../TrainingCourse/LayoutForCourse";
import Header from "../common/Header";
import { useNavigate, useLocation } from "react-router-dom";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';


function EditCourseCategory() {
  const [courseCategory, setCourseCategory] = useState({
    categoryName: "",
    description: "",
  });
  const [allCategories, setAllCategories] = useState([]);
  const location = useLocation();
  const { id } = location.state || {};
  const navigate = useNavigate();
     const [authState] = useAtom(authAtom);
      const tenantId = authState.tenantId

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (id) {
      fetchCourseCategoryById();
    }
    fetchAllCourseCategories();
  }, [id]);

  const fetchAllCourseCategories = async () => {
    try {
      const response = await listCourseCategory(tenantId);
      setAllCategories(response.data);
    } catch (error) {
      console.error("Error fetching course categories:", error.message);
    }
  };

  const fetchCourseCategoryById = async () => {
    try {
      const response = await getTrainingCourseCategoryById(tenantId,id);
      setCourseCategory(response.data);
    } catch (error) {
      console.error("Error fetching course category by ID:", error.message);
    }
  };

  const handleCategoryFormSubmit = async (values) => {
    try {
      const existingCategory = allCategories.find(
        (category) =>
          category.categoryName.toLowerCase() === values.categoryName.toLowerCase() &&
          category.id !== id
      );

      if (existingCategory) {
        setSnackbarMessage("Category name already exists. Please use a different name.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      // Update the category
      await updateCourseCategory(tenantId,id, values);
      setSnackbarMessage("Category updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchAllCourseCategories();
      navigate("/training/coursecategory");

    } catch (error) {
      console.error("Failed to update category:", error);
      setSnackbarMessage("Failed to update category. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Yup validation schema
  const categorySchema = yup.object().shape({
    categoryName: yup.string().required("Category name is required"),
    description: yup.string().required("Description is required"),
  });

  // Snackbar close handler
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <LayoutForCourse subtitle="Training Course Registration">
      <Header subtitle="Edit Training Course Category" />
      <Formik
        enableReinitialize
        initialValues={courseCategory}
        validationSchema={categorySchema}
        onSubmit={handleCategoryFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Category"
                    variant="outlined"
                    name="categoryName"
                    value={values.categoryName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.categoryName && !!errors.categoryName}
                    helperText={touched.categoryName && errors.categoryName}
                    style={{ marginTop: 8 }}
                  />
                </Grid>
                <Grid item xs={12} style={{ marginTop: 8 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    variant="outlined"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.description && !!errors.description}
                    helperText={touched.description && errors.description}
                    style={{ marginTop: 8 }}
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <Grid container spacing={3} justifyContent="center" style={{ marginBottom: 16 }}>
              <Grid item xs={12} md={3}>
                <Button fullWidth variant="contained" color="primary" type="submit">
                  Save
                </Button>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  type="button"
                  onClick={() => resetForm()}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>

      {/* Snackbar for displaying messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </LayoutForCourse>
  );
}

export default EditCourseCategory;
