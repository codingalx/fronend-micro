import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { TextField, Grid, Box, IconButton, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import ToolbarComponent from './ToolbarComponent';
import LayoutForCourse from './LayoutForCourse';
import { getCourseTrainingById, listCourseCategory, addCourseCategory, updateCourseTraining } from "../../../configuration/TrainingApi";
import Header from '../common/Header';
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';


const UpdateTrainingCourse = () => {
  const location = useLocation();
  const courseId = location?.state?.id;
  const selectedCategoryId = location?.state?.selectedCategoryId || ''; // Retrieve selectedCategoryId if provided
  const { showBothIcons } = location.state || { showBothIcons: true };
  const [courseTraining, setCourseTraining] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [courseCategory, setCourseCategory] = useState([]);
  const [error, setError] = useState(null);
  const [mainIconType, setMainIconType] = useState('search');
     const [authState] = useAtom(authAtom); // Access the shared authentication state
      const tenantId = authState.tenantId

  useEffect(() => {
    fetchCourseCategory();
    fetchCourseTraining();
  }, [courseId]);

  const fetchCourseCategory = async () => {
    try {
      const response = await listCourseCategory(tenantId);
      const data = response.data;
      const categoryId =data.categoryId;
      setCourseCategory(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchCourseTraining = async () => {
    try {
      const response = await getCourseTrainingById(tenantId,courseId);
      const data = response.data;
      setCourseTraining(data);
      console.log(data)
    } catch (error) {
      console.error("Failed to fetch course training:", error.message);
    }
  };
  

  const handleCategoryFormSubmit = async (values, { resetForm }) => {
    try {
      await addCourseCategory(tenantId,values);
      console.log("Category created successfully!");
      resetForm();
      setOpen(false);
      fetchCourseCategory(); // Refresh category list
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const handleCourseFormSubmit = async (values, { resetForm }) => {
    try {
      console.log("Updating course with ID:", courseId);
      console.log("Form values:", values);
      
      const response = await updateCourseTraining(tenantId,courseId, values);
      
      console.log("Update response:", response);
  
      // Optionally, you can check the response status here
      if (response.status === 200) {
        console.log("Course updated successfully!");
        // Clear form fields
        resetForm();
        setCourseTraining({
          courseName: '',
          description: '',
          courseCategoryId: ''
        });
        // Navigate to the list page with the selected category ID
      //  navigate(`/training/listTrainingCourse?categoryId=${values.courseCategoryId}`);
        
      } else {
        console.error("Failed to update course: Unexpected response status", response.status);
      }
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };
  
  // const handleIconClick = () => {
  //   // Navigate back to the list page with the selected category ID
  //  // navigate(`/training/listTrainingCourse?categoryId=${selectedCategoryId}`);
  // };

  const handleMainIconClick = () => {
    setMainIconType(prev => (prev === 'search' ? 'add' : 'search'));
  };

  const handleSecondaryIconClick = () => {
    // Define the secondary icon click action if needed
  };
  
  

  const categoryInitialValues = {
    categoryName: "",
    description: "",
  };

  const courseSchema = yup.object().shape({
    courseName: yup.string().required("Course name is required"),
    description: yup.string().required("Description is required"),
    courseCategoryId: yup.string().required("Course category is required"),
  });

  const categorySchema = yup.object().shape({
    categoryName: yup.string().required("Category name is required"),
    description: yup.string().required("Description is required"),
  });
  const refreshPage = () => {
    window.location.reload();
  };
  const handleIconClick = () => {
    navigate('/training/trainingCourse');
  };

  return (
    <LayoutForCourse subtitle="Training Course Registration">
            <ToolbarComponent mainIconType="search" 
            onMainIconClick={handleIconClick}
             refreshPage={refreshPage} 
             
             />

      <Formik
        initialValues={courseTraining || {
          courseName: '',
          description: '',
          courseCategoryId: ''
        }}
        validationSchema={courseSchema}
        onSubmit={handleCourseFormSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, resetForm }) => (
          <Form id="frmCourse" name="frmCourse" method="post" action="/ERP-war/erp/hrms/training/trainingCourse.xhtml" encType="application/x-www-form-urlencoded" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center">
                  <Field
                    as={TextField}
                    fullWidth
                    select
                    variant="outlined"
                    SelectProps={{ native: true }}
                    name="courseCategoryId"
                    value={values.courseCategoryId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.courseCategoryId && !!errors.courseCategoryId}
                    helperText={touched.courseCategoryId && errors.courseCategoryId}
                  >
                    <option value="">--- select Course Category ---</option>
                    {courseCategory.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </Field>
                  <IconButton onClick={() => setOpen(true)} title="Click to register category type">
                    <Add />
                  </IconButton>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Course Name"
                  variant="outlined"
                  name="courseName"
                  value={values.courseName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.courseName && !!errors.courseName}
                  helperText={touched.courseName && errors.courseName}
                  style={{ marginTop: 8 }}
                />
              </Grid>
              <Grid item xs={12} style={{ marginTop: 8 }}>
                <Field
                  as={TextField}
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  variant="outlined"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.description && !!errors.description}
                  helperText={touched.description && errors.description}
                  placeholder="Write some description ....."
                  style={{ marginTop: 8 }}
                />
              </Grid>
              <Grid container spacing={3} justifyContent="center" style={{ marginTop: 16 }}>
                <Grid item xs={12} md={3}>
                  <Button fullWidth variant="contained" color="primary" type="submit">
                    Save
                  </Button>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button fullWidth variant="contained" color="primary" type="button" onClick={() => {
                    resetForm();
                    setCourseTraining({
                      courseName: '',
                      description: '',
                      courseCategoryId: ''
                    });
                  }}>
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          <Header subtitle=" Register Category Name" />
          <IconButton onClick={() => setOpen(false)} style={{ position: 'absolute', right: 8, top: 4 }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <Formik
          initialValues={categoryInitialValues}
          validationSchema={categorySchema}
          onSubmit={handleCategoryFormSubmit}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit, resetForm }) => (
            <Form onSubmit={handleSubmit}>
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
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
                    <Field
                      as={TextField}
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
                  <Button fullWidth variant="contained" color="primary" type="button" onClick={() => resetForm()}>
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Dialog>
    </LayoutForCourse>
  );
};

export default UpdateTrainingCourse;
