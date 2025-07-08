import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { TextField, Grid, Box, IconButton, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import ToolbarComponent from '../common/Header';
import LayoutForCourse from '../TrainingCourse/LayoutForCourse';
import Header from '../common/Header';
import { addCourseType, getPreServiceCourseById, listCourseType, updatePreServiceCourse } from '../../../configuration/TrainingApi';




const UpdatePreServiceCourse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const precourseId = location?.state?.id;
  const [open, setOpen] = useState(false);
  const [courseTraining, setCourseTraining] = useState({
    courseName: "",
    description: "",
    courseTypeId: "",
  });
  const [courseType, setCourseType] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourseType();
    fetchCourseTraining();
  }, [precourseId]);

  const fetchCourseTraining = async () => {
    try {
      const response = await getPreServiceCourseById(precourseId);
      setCourseTraining(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch course training:", error.message);
    }
  };

  const fetchCourseType = async () => {
    try {
      const response = await listCourseType();
      setCourseType(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleCategoryFormSubmit = async (values, { resetForm }) => {
    try {
      await addCourseType(values);
      console.log("Course Type created successfully!");
      resetForm();
      setOpen(false);
      fetchCourseType(); // Refresh category list
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const handleCourseFormSubmit = async (values, { resetForm }) => {
    try {
      await updatePreServiceCourse(precourseId, values);
      
      // Manually reset form state to empty values
      setCourseTraining({
        courseName: '',
        description: '',
        courseTypeId: ''
      });
      resetForm({
        values: {
          courseName: '',
          description: '',
          courseTypeId: ''
        }
      });
      navigate("/training/preserviceCourses");
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const courseTypeSchema = yup.object().shape({
    courseType: yup.string().required("Category name is required"),
    description: yup.string().required("Description is required"),
  });

  const courseSchema = yup.object().shape({
    courseName: yup.string().required("Course name is required"),
    description: yup.string().required("Description is required"),
    courseTypeId: yup.string().required("Course Type is required"),
  });

  const handleIconClick = () => {
    navigate('/training/listpreserviceCourses');
  };

  return (
    <LayoutForCourse subtitle="Training Course Registration">
      <ToolbarComponent mainIconType="search" onMainIconClick={handleIconClick} refreshPage={refreshPage} />
      <Formik
        initialValues={courseTraining}
        validationSchema={courseSchema}
        onSubmit={handleCourseFormSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, resetForm }) => (
          <Form id="frmCourse" name="frmCourse" method="post" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center">
                  <Field
                    as={TextField}
                    fullWidth
                    select
                    variant="outlined"
                    SelectProps={{ native: true }}
                    name="courseTypeId"
                    value={values.courseTypeId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.courseTypeId && !!errors.courseTypeId}
                    helperText={touched.courseTypeId && errors.courseTypeId}
                  >
                    <option value="">--- select Course Type ---</option>
                    {courseType.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.courseType}
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
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="button"
                    onClick={() => {
                      resetForm();
                      setCourseTraining({
                        courseName: '',
                        description: '',
                        courseTypeId: ''
                      });
                    }}
                  >
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
          <Header subtitle="Register CourseType Name" />
          <IconButton onClick={() => setOpen(false)} style={{ position: 'absolute', right: 8, top: 4 }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <Formik
          initialValues={{ courseType: "", description: "" }}
          validationSchema={courseTypeSchema}
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
                      label="Course Type"
                      variant="outlined"
                      name="courseType"
                      value={values.courseType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!touched.courseType && !!errors.courseType}
                      helperText={touched.courseType && errors.courseType}
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

export default UpdatePreServiceCourse;
