import React from 'react';
import { Box, Button, Grid, TextField, DialogContent, Snackbar, Alert } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import { listCourseCategory ,addCourseCategory} from '../../../configuration/TrainingApi' 
import Header from '../common/Header'
import LayoutForCourse from '../TrainingCourse/LayoutForCourse'
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import ListCourseCategory from './ListCourseCategory';
import { useState } from 'react';


function CreateTrainingCategory() {
  const [courseCategory, setCourseCategory] = React.useState([]);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
    const [authState] = useAtom(authAtom); // Access the shared authentication state
    const tenantId = authState.tenantId
      const [refreshKey, setRefreshKey] = useState(0);

  React.useEffect(() => {
    fetchCourseCategory();
  }, []);

  const fetchCourseCategory = async () => {
    try {
      const response = await listCourseCategory(tenantId);
      setCourseCategory(response.data);
    } catch (error) {
      console.error("Error fetching course categories:", error.message);
    }
  };

  const handleCategoryFormSubmit = async (values, { resetForm }) => {
    try {
      // Check if the category name already exists
      const existingCategory = courseCategory.find(
        (category) => category.categoryName.toLowerCase() === values.categoryName.toLowerCase()
      );

      if (existingCategory) {
        setSnackbarMessage("Category name already exists. Please use a different name.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      // Add new category
      await addCourseCategory(tenantId,values);
      setSnackbarMessage("Category created successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      resetForm();
      setRefreshKey(prev => prev + 1); 
      fetchCourseCategory();
    } catch (error) {
      console.error("Failed to create category:", error);
      setSnackbarMessage("Failed to create category. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const categoryInitialValues = {
    categoryName: "",
    description: "",
  };

  const categorySchema = yup.object().shape({
    categoryName: yup.string().required("Category name is required"),
    description: yup.string().required("Description is required"),
  });

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <LayoutForCourse subtitle="Training Course Registration">
     <Header  subtitle="Craete Trainning Course Category " />
      <Formik
        initialValues={categoryInitialValues}
        validationSchema={categorySchema}
        onSubmit={handleCategoryFormSubmit}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, resetForm }) => (
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
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                >
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
        anchorOrigin={{ vertical: 'top', horizontal: 'end' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '50%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <ListCourseCategory  refreshKey={refreshKey}/>
    </LayoutForCourse>

  );
}

export default CreateTrainingCategory;
