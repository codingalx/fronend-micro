import React, { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Tooltip,
  IconButton,
  useTheme,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FormHelperText,
  Chip,Grid
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
// import DeleteDialog from "../../DeleteDialog";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getPreServiceTraineeCourseById,
  listAllCourse,
  listCourseType,
  updatePreServiceTrainieeCourese
} from "../../../configuration/TrainingApi";
import ToolbarComponent from "../TrainingCourse/ToolbarComponent";
import LayoutForCourse from "../TrainingCourse/LayoutForCourse";
import { tokens } from "../common/theme";
import Header from "../common/Header";
import { Formik } from "formik";
import * as Yup from "yup";
import { canAccessResource } from "../../../configuration/SecurityService";
import TrainingServiceResourceName from "../../../configuration/TrainingServiceResourceName";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';



const CoursesForTrainee = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [courseTraining, setCourseTraining] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [preCourseTraineeToDelete, setPreCourseTraineeToDelete] = useState(null);
  const location = useLocation();
  const traineeId = location?.state?.id;
  const courseTyeIntialValues = { courseTypes: [] };

  const [canDelete, setCanDelete] = useState(false);
  const [canAddTraineResult, setCanAddTraineResult] = useState(false);

  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId
    const userRoles = authState.roles;

  const checkPermissions = async () => {
    const deleteAccess = await canAccessResource(TrainingServiceResourceName.REMOVE_COURSE_BY_TRAINEE_ID, userRoles);
    const addAccess = await canAccessResource(TrainingServiceResourceName.ADD_PRE_SERVICE_TRAINEE_RESULT, userRoles);

    setCanDelete(deleteAccess);
    setCanAddTraineResult(addAccess)
  };

  const courseTypeSchema = Yup.object().shape({
  });

  useEffect(() => {
    if (traineeId) {
      fetchData();
      checkPermissions();
    }
  }, [traineeId]);

  const fetchData = async () => {
    try {
      const [preServiceCourseResponse, courseTypeNamesResponse] = await Promise.all([
        getPreServiceTraineeCourseById(tenantId,traineeId),
        listCourseType(tenantId)
      ]);
      

      const preServiceCourseData = preServiceCourseResponse.data;
      const courseTypeNamesData = courseTypeNamesResponse.data;

      const mappedData = preServiceCourseData.map((course) => ({
        ...course,
        courseType: getCourseTypeName(course.courseTypeId, courseTypeNamesData)
      }));

      setCourseTraining(mappedData);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const getCourseTypeName = (courseTypeId, courseTypes) => {
    const courseTypeItem = courseTypes.find((type) => type.id === courseTypeId);
    return courseTypeItem ? courseTypeItem.courseType : "Unknown";
  };

  const handleDelete = (traineeId, courseTraining) => {
    setPreCourseTraineeToDelete(courseTraining);
    setOpenDialog(true);
  };

  

  const handleTraineeCourseResult = (traineeId,id) => {
    navigate('/training/preserviceTraineeResult', { state: { traineeId,id } });
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleIconClick = () => {
    setOpen(true);
  };

  const [courseTypes, setCourseTypes] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const handleCoursesYtpesChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCourses(
      typeof value === 'string' ? value.split(',') : value
    );
  };

  useEffect(() => {
    fetchAllCourse();
  }, []);

  const fetchAllCourse = async () => {
    try {
      const response = await listAllCourse(tenantId);
      setCourseTypes(response.data);
      console.log("Job mediatype:", response.data);
    } catch (error) {
      console.error("Error fetching media types:", error);
    }
  };

  const handleCouseTypeFormSubmit = async (values, { setSubmitting }) => {
    try {
      const courseTypeIds = selectedCourses.map(name => {
        const courseType = courseTypes.find(courseType => courseType.courseName === name);
        return courseType ? courseType.id : null;
      }).filter(id => id !== null); // Remove any null values

      const formattedValues = courseTypeIds;

      console.log("Formatted values: ", formattedValues); // Log the payload

      await updatePreServiceTrainieeCourese(tenantId,traineeId, formattedValues);
      handleClose();
     
      navigate("/training/listPreserviceTraining");
    } catch (error) {
      console.error("Failed to submit form data:", error);
      if (error.response && error.response.data) {
        console.error("Server response data:", error.response.data);
      }
    } finally {
      setSubmitting(false);
      handleClose();
    }
  };

  const columns = [
    { field: "courseName", headerName: "Course Name", flex: 1 },
    { field: "courseType", headerName: "Course Type", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        {canDelete &&
          <Tooltip title="Delete Course">
          <IconButton onClick={() => handleDelete(traineeId, params.row)} color="error">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        }
        
       {canAddTraineResult &&
          <Tooltip title="Add Trainee Result for Course">
          <IconButton
            onClick={() => handleTraineeCourseResult(traineeId,params.row.id)}
            color="primary"
          >
           <AddIcon />
          </IconButton>
        </Tooltip>
       }
      
        </Box>
      ),
    },
  ];

  return (
    <LayoutForCourse subtitle="List Of Courses">
      <ToolbarComponent mainIconType="add" onMainIconClick={handleIconClick} refreshPage={refreshPage} />

      <DataGrid
        rows={courseTraining}
        columns={columns}
        getRowId={(row) => row.id}
        checkboxSelection={false}
      />
      {/* <DeleteDialog
        open={openDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this course?"
      /> */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Header subtitle="Assign Course for Trainee from list" />
          <IconButton
            onClick={handleClose}
            style={{ position: 'absolute', right: 8, top: 4 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Formik
          initialValues={courseTyeIntialValues}
          validationSchema={courseTypeSchema}
          onSubmit={handleCouseTypeFormSubmit}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm }) => (
            <form onSubmit={handleSubmit}>
  <DialogContent style={{ maxHeight: '70vh', overflowY: 'auto' }}>
    <FormControl fullWidth>
      <InputLabel>Assign Courses for Trainee</InputLabel>
      <Select
        multiple
        label="Please Select Trainee Courses "
        value={values.courseTypes}
        variant="filled"
        onChange={(event) => {
          handleCoursesYtpesChange(event);
          setFieldValue("courseTypes", event.target.value);
        }}
        renderValue={(selected) => (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {selected.map((value) => (
              <Chip key={value} label={value} style={{ margin: 2 }} />
            ))}
          </div>
        )}
      >
        {courseTypes.map((courseType) => (
          <MenuItem key={courseType.id} value={courseType.courseName}>
            <Checkbox checked={values.courseTypes.indexOf(courseType.courseName) > -1} />
            <ListItemText primary={courseType.courseName} />
          </MenuItem>
        ))}
      </Select>
      {touched.courseTypes && errors.courseTypes && (
        <FormHelperText error>{errors.courseTypes}</FormHelperText>
      )}
    </FormControl>
    <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 10 }}>
      {courseTypes.map((courseType) => (
        <Chip key={courseType.id} label={courseType.courseName} style={{ margin: 2 }} />
      ))}
    </div>
  </DialogContent>
  <Grid container spacing={3} justifyContent="center" style={{ marginBottom: 16, marginTop: 8 }}>
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
</form>

          
          )}
        </Formik>
      </Dialog>
    </LayoutForCourse>
  );
};

export default CoursesForTrainee;