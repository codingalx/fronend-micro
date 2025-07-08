import React from 'react';
import { Box, Button, Grid, IconButton, TextField, Dialog,  DialogContent, DialogTitle } from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {  addCourseType, addPreCourse, listCourseType } from '../../../configuration/TrainingApi';
import ToolbarComponent from '../common/ToolbarComponent';
import LayoutForCourse from '../TrainingCourse/LayoutForCourse';
import Header from '../common/Header';
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import ListOfPresServiceCourse from './ListOfPresServiceCourse'
import { useState } from 'react';




function CreatePreServiceCourse() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
    const [authState] = useAtom(authAtom);
    const tenantId = authState.tenantId
    const [refreshKey, setRefreshKey] = useState(0);


  const handleAddCategoryClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const [courseType, setCourseType] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchCourseType();
  }, []);

  const fetchCourseType = async () => {
    try {
      const response = await listCourseType(tenantId);
      const data = response.data;

      setCourseType(data);
      console.log(data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleCouseTypeFormSubmit = async (values, { resetForm }) => {
    try {
      await addCourseType(tenantId,values);
      resetForm();
      setOpen(false);
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const handleCourseFormSubmit = async (values, { resetForm }) => {
    try {
      await addPreCourse(tenantId,values);
      resetForm();
      setRefreshKey(prev => prev + 1); 

    } catch (error) {
      console.error("Failed to create course:", error);
    }
  };


  const refreshPage = () => {
    window.location.reload();
  };



  

  const courseTyeIntialValues = {
    courseType: "",
    description: "",
  };

  const courseInitialValues = {
    courseName: "",
    description: "",
    courseTypeId: "",
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
    // navigate('/training/listpreserviceCourses');
  };
  

  return (
    <LayoutForCourse subtitle="Training Course Registration">
      <ToolbarComponent mainIconType="search" onMainIconClick={handleIconClick} refreshPage={refreshPage} />
      <Formik
        initialValues={courseInitialValues}
        validationSchema={courseSchema}
        onSubmit={handleCourseFormSubmit}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, resetForm }) => (
          <form  onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>

                <Box display="flex" alignItems="center">
                  <TextField
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
                    {courseType.map((courseType) => (
                      <option key={courseType.id} value={courseType.id}>
                        {courseType.courseType}
                      </option>


                    ))}
                  </TextField>
                  <IconButton onClick={handleAddCategoryClick} title="Click to register termination type">
                    <Add />
                  </IconButton>
                </Box>

              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
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
                <TextField
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
                    color="primary"
                    type="button"
                    onClick={() => resetForm()}
                  >
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>

      {/* Dialog for adding new category */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Header subtitle=" Register CourseType Name" />
          <IconButton
            onClick={handleClose}
            style={{ position: 'absolute', right: 8, top: 4 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <Formik
          initialValues={courseTyeIntialValues}
          validationSchema={courseTypeSchema}
          onSubmit={handleCouseTypeFormSubmit}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit, resetForm }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
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

              <Grid container spacing={3} justifyContent="center" style={{marginBottom: 16 }}>
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
                    color="primary"
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
      </Dialog>
      <ListOfPresServiceCourse  refreshKey={refreshKey}/>
      
    </LayoutForCourse>
  );
}

export default CreatePreServiceCourse;