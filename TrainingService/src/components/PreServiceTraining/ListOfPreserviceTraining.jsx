import React, { useEffect, useState } from "react";
import {
  Box,
  useTheme,
  Tooltip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import LayoutForCourse from "../TrainingCourse/LayoutForCourse";
import AddIcon from "@mui/icons-material/Add";
import {
  listPreServiceTraining,
  listOfBudgetYears,
  listEducationLevels,
  listFieldStudies,
  listLocation,
  getPreServiceTrainingByYearId,
} from "../../../configuration/TrainingApi";
import TrainingServiceResourceName from "../../../configuration/TrainingServiceResourceName";
import { canAccessResource } from "../../../configuration/SecurityService";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';


const ListOfPreserviceTraining = ({refreshKey}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId
    const userRoles = authState.roles;
  const [selectedBudgetTypeId, setSelectedBudgetTypeId] = useState(''); 
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [preServiceTrainingToDelete, setpreServiceTrainingToDelete] = useState(null);
  const [preServiceTraining, setPreServiceTraining] = useState([]);
  const [budgetYear, setBudgetYear] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);
  const [fieldOfStudies, setFieldOfStudies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canAddTraineCourse, setCanAddTraineCourse] = useState(false);



  const checkPermissions = async () => {
    const editAccess = await canAccessResource(TrainingServiceResourceName.UPDATE_PRE_SERVICE_TRAINEE, userRoles);
    const deleteAccess = await canAccessResource(TrainingServiceResourceName.DELETE_PRE_SERVICE_TRAINEE, userRoles);
    const addAccess = await canAccessResource(TrainingServiceResourceName.ADD_COURSES_TO_PRE_SERVICE_TRAINEE, userRoles);

    setCanEdit(!editAccess);
    setCanDelete(!deleteAccess);
    setCanAddTraineCourse(!addAccess)
  };


  useEffect(() => {
    fetchData(selectedBudgetTypeId);
    checkPermissions();
  }, [selectedBudgetTypeId,refreshKey]);

  const fetchData = async (yearId) => {
    try {
      const [
        PreServiceTrainingRequestResponse,
        locationNamesResponse,
        fieldOfStudyNameResponse,
        educationLevelNamesResponse,
        budgetResponse
      ] = await Promise.all([
        yearId ?getPreServiceTrainingByYearId(tenantId,yearId) 
        : listPreServiceTraining(tenantId),
    
        listLocation(tenantId),
        listFieldStudies(tenantId),
        listEducationLevels(tenantId),
        listOfBudgetYears(tenantId),
      ]);

      const PreServiceTrainingData = PreServiceTrainingRequestResponse.data;

      const educationLevelNamesData = educationLevelNamesResponse.data;
      const fieldOfStudyNameData = fieldOfStudyNameResponse.data;
      const locationNameData = locationNamesResponse.data;
      const budgetYearData = budgetResponse.data;

      const mappedData = PreServiceTrainingData.map((lang) => ({
        ...lang,
        
        educationLevelName: getEducationLevel(lang.educationLevelId, educationLevelNamesData),
        fieldOfStudy: getFieldOfStudies(lang.fieldOfStudyId, fieldOfStudyNameData),
        locationName: getLocationName(lang.locationId, locationNameData),
        budgetYear: getBudgetYear(lang.budgetYearId, budgetYearData),
      }));

      setPreServiceTraining(mappedData);
      setEducationLevels(educationLevelNamesData);
      setFieldOfStudies(fieldOfStudyNameData);
      setLocations(locationNameData);
      setBudgetYear(budgetYearData);
    } catch (error) {
      setError(error.message);
    }
  };

  const getBudgetYear = (budgetYearId, budgetYears) => {
    const budget = budgetYears.find((budget) => budget.id === budgetYearId);
    return budget ? budget.budgetYear : "Unknown";
  };

  const getLocationName = (locationId, locationsData) => {
    const location = locationsData.find((location) => location.id === locationId);
    return location ? location.locationName : "Unknown";
  };

  const getEducationLevel = (educationLevelId, educationLevels) => {
    const education = educationLevels.find((lang) => lang.id === educationLevelId);
    return education ? education.educationLevelName : "Unknown";
  };

  const getFieldOfStudies = (fieldOfStudyId, fieldOfStudies) => {
    const field = fieldOfStudies.find((lang) => lang.id === fieldOfStudyId);
    return field ? field.fieldOfStudy : "Unknown";
  };

  const handleCourseChange = (event) => {
    setSelectedBudgetTypeId(event.target.value);
  };

  const handleDelete = (preServiceTraining) => {
    setpreServiceTrainingToDelete(preServiceTraining);
    setOpenDialog(true);
  };





  const handleMoreAbout = (id) => {
    navigate('/training/CoursesOfTrainee',{ state: { id } });
  };
  

  
  const handlePreServiceTraining = (id) => {
    navigate('/training/updatepreserviceTraining', { state: { id } });
  };

  const columns = [

    { field: "budgetYear", headerName: "Budget Year", flex: 1 },
    { field: "locationName", headerName: "Location Name", flex: 1 },
    { field: "fieldOfStudy", headerName: "Field of Study", flex: 1, cellClassName: "name-column--cell" },
    { field: "educationLevelName", headerName: "Education Level", flex: 1, cellClassName: "name-column--cell" },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {/* {canDelete &&
              <Tooltip title="Delete Course">
              <IconButton onClick={() => handleDelete(params.row)} color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          } */}

           {canDelete && (
          <Tooltip title="Delete pre service training ">
          <IconButton onClick={() => navigate("/training/delete_training", { state: { trainingId: params.row.id } })} color="error">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}


        {canEdit &&
              <Tooltip title="Update">
              <IconButton
                onClick={() => handlePreServiceTraining(params.row.id)}
                color="primary"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
             
        }
      {canAddTraineCourse &&
             <Tooltip title="Add Courses for Trainee">
             <IconButton onClick={() => handleMoreAbout(params.row.id)}>
               <AddIcon />
             </IconButton>
         </Tooltip>
      }


      </Box>
      ),
    },
  ];

  return (
    <LayoutForCourse subtitle="List Of Annual Training Requests">
  
      <Paper elevation={3} sx={{ padding: 2, minHeight: 5, marginBottom: 1 }}>
        <FormControl variant="outlined" sx={{ minWidth: 200, marginBottom: 2 }}>
          <InputLabel id="status-select-label">Search Training by Year</InputLabel>
          <Select
            labelId="budget"
            id="budget"
            value={selectedBudgetTypeId}
            onChange={handleCourseChange}
            label="budget"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {budgetYear.map((budget) => (
              <MenuItem key={budget.id} value={budget.id}>
                {budget.budgetYear}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {error && (
          <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
            Error: {error}
          </Typography>
        )}
      </Paper>
      <Paper elevation={2} sx={{ padding: 1, borderRadius: 1 }}>
        <DataGrid
          rows={preServiceTraining}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
          autoHeight
          sx={{ border: 'none' }}
        />
      </Paper>
      {/* <DeleteDialog
        open={openDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this course?"
      /> */}
    </LayoutForCourse>
  );
};

export default ListOfPreserviceTraining;
