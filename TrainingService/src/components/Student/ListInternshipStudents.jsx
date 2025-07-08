import React, { useEffect, useState } from "react";
import {
  Box,
  Tooltip,
  useTheme,
  IconButton,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import { deleteInternshipStudents, listInternshipStudents, listLocation, listOfBudgetYears, listOfUniversity } from "../../../configuration/TrainingApi";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import ToolbarComponent from "../TrainingCourse/ToolbarComponent";
import LayoutForCourse from "../TrainingCourse/LayoutForCourse";
import { Assignment } from '@mui/icons-material';
import { HourglassEmpty, CheckCircle, ErrorOutline } from "@mui/icons-material";
import TrainingServiceResourceName from "../../../configuration/TrainingServiceResourceName";
import { canAccessResource } from "../../../configuration/SecurityService";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';




const ListInternshipStudents = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [internStudents, setInternStudents] = useState([]);
  const [selectedBudgetTypeId, setSelectedBudgetTypeId] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [locations, setLocations] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [budgetYears, setBudgetYears] = useState([]);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [internStudentToDelete, setInternStudentToDelete] = useState(null);
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId
  const userRoles = authState.roles;

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedBudgetTypeId, selectedSemester]);

  const fetchInitialData = async () => {
    try {
      const [locationResponse, universityResponse, budgetYearResponse] = await Promise.all([
        listLocation(tenantId),
        listOfUniversity(tenantId),
        listOfBudgetYears(tenantId),
        checkPermissions()
      ]);

      setLocations(locationResponse.data);
      setUniversities(universityResponse.data);
      setBudgetYears(budgetYearResponse.data);
      fetchData(); // Fetch all internship students on initial load
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchData = async () => {
    try {
      // Call listInternshipStudents with the appropriate parameters
      const studentResponse = await listInternshipStudents(tenantId,selectedBudgetTypeId, selectedSemester);
      const studentData = studentResponse.data;
  
      // Process the data
      const mappedData = Array.isArray(studentData) ? studentData.map(student => ({
        ...student,
        locationName: getLocationName(student.locationId),
        universityName: getUniversityName(student.universityId),
        budgetYear: getBudgetYearName(student.budgetYearId),
      })) : [];
  
      setInternStudents(mappedData);
    } catch (error) {
      setError(error.message);
    }
  };
  

  const getLocationName = (locationId) => {
    const location = locations.find((loc) => loc.id === locationId);
    return location ? location.locationName : "Unknown";
  };

  const getUniversityName = (universityId) => {
    const university = universities.find((uni) => uni.id === universityId);
    return university ? university.universityName : "Unknown";
  };

  const getBudgetYearName = (budgetYearId) => {
    const budgetYear = budgetYears.find((year) => year.id === budgetYearId);
    return budgetYear ? budgetYear.budgetYear : "Unknown";
  };

  const handleCourseChange = (event) => {
    setSelectedBudgetTypeId(event.target.value);
  };

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };

  const handleDelete = (internStudent) => {
    setInternStudentToDelete(internStudent);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteInternshipStudents(tenantId,internStudentToDelete.id);
      const updatedInternStudents = internStudents.filter((student) => student.id !== internStudentToDelete.id);
      setInternStudents(updatedInternStudents);
    } catch (error) {
      setError(error.message);
    } finally {
      setOpenDialog(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
  };

  const handleInterStudentEdit = (id) => {
    navigate('/training/updateInternstudent', { state: { id } });
  };

  const handleAssignDepartement = (id) => {
    navigate('/training/assigndepartement', { state: { id } });
  };
  
  const handleStatusDepartement = (id) => {
    navigate('/training/internstudentStatus', { state: { id } });
  };

  const handleCompleteStatus = (id) => {  
    navigate('/training/createInternPayment', { state: { id } });
  };

  const handleInCompleteStatus = () => {
    console.log('the status for inter is incomplete')
  };

  const handleIconClick = () => {
    navigate('/training/internstudent');
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canDepartement, setCanDepartement] = useState(false);
  const [canStatus, setCanStatus] = useState(false);


 

  const checkPermissions = async () => {
    // Check permissions for actions
    const editAccess = await canAccessResource(TrainingServiceResourceName.UPDATE_INTERNSHIP_STUDENT &&
      TrainingServiceResourceName.GET_INTERNSHIP_STUDENT_BY_ID,
      userRoles);
    
    console.log('Edit Access:', editAccess); // Log the edit access result
  
    const deleteAccess = await canAccessResource(TrainingServiceResourceName.DELETE_INTERNSHIP_STUDENT, userRoles);
    console.log('Delete Access:', deleteAccess); // Log the delete access result
  
    const departmentAccess = await canAccessResource(TrainingServiceResourceName.ASSIGN_DEPARTMENT_TO_INTERNSHIP_STUDENT, userRoles);
    console.log('Department Access:', departmentAccess); // Log the department access result
  
    const statusAccess = await canAccessResource(TrainingServiceResourceName.ASSIGN_STATUS_TO_INTERNSHIP_STUDENT, userRoles);
    console.log('Status Access:', statusAccess); // Log the status access result
    
    setCanEdit(!editAccess);
    setCanDelete(!deleteAccess);
    setCanDepartement(!departmentAccess);
    setCanStatus(!statusAccess);
  };

  const columns = [
    { field: "universityName", headerName: "University Name", flex: 1, cellClassName: "name-column--cell" },
    { field: "budgetYear", headerName: "Budget Year", flex: 1, cellClassName: "name-column--cell" },
    { field: "firstName", headerName: "First Name", flex: 1, cellClassName: "name-column--cell" },
    { field: "middleName", headerName: "Middle Name", flex: 1, cellClassName: "name-column--cell" },
    { field: "startDate", headerName: "Start Date", flex: 1, cellClassName: "name-column--cell" },
    { field: "endDate", headerName: "End Date", flex: 1, cellClassName: "name-column--cell" },
    { field: "locationName", headerName: "Location Name", flex: 1, cellClassName: "name-column--cell" },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>

      {canDelete && (
          <Tooltip title="Delete Intern Student ">
          <IconButton onClick={() => navigate("/training/deleteInternstudent", { state: { studentId: params.row.id } })} color="error">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
      

      {canEdit && (
              <Tooltip title="Update">
              <IconButton onClick={() => handleInterStudentEdit(params.row.id)} color="primary">
                <EditIcon />
              </IconButton>
            </Tooltip>
      )}
          {canDepartement && 
          
          params.row.placedDepartmentId === null && (
            <Tooltip title="Assign Departement">
              <IconButton onClick={() => handleAssignDepartement(params.row.id)}>
                <Assignment />
              </IconButton>
            </Tooltip>
          )}

           {  params.row.placedDepartmentId && params.row.internshipStatus === 'IN_PROGRESS' && 
           (
            <Tooltip title="In Progress">
              <IconButton onClick={() => handleStatusDepartement(params.row.id)}>
                <HourglassEmpty />
              </IconButton>
            </Tooltip>
          )}



          {  (params.row.placedDepartmentId && params.row.internshipStatus === 'COMPLETED') && (
            <Tooltip title="Completed">
              <IconButton onClick={() => handleCompleteStatus(params.row.id)}>
                <CheckCircle />
              </IconButton>
            </Tooltip>
          )}

         
          { (params.row.placedDepartmentId && params.row.internshipStatus === 'INCOMPLETE') && (
            <Tooltip title="InComplete">
              <IconButton onClick={() => handleInCompleteStatus(params.row.id)}>
                <ErrorOutline />
              </IconButton>
            </Tooltip>
          )}



        </Box>
      ),
    },
  ];

  return (
    <LayoutForCourse subtitle="List of Internship Students">
      <ToolbarComponent mainIconType="add" onMainIconClick={handleIconClick} refreshPage={refreshPage} />
      <Paper elevation={3} sx={{ padding: 2, minHeight: 5, marginBottom: 1 }}>
        <FormControl variant="outlined" sx={{ minWidth: 200, marginBottom: 2 }}>
          <InputLabel id="budget-select-label">Search by Budget Year</InputLabel>
          <Select
            labelId="budget-select-label"
            id="budget-select"
            value={selectedBudgetTypeId}
            onChange={handleCourseChange}
            label="Budget Year"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {budgetYears.map((budget) => (
              <MenuItem key={budget.id} value={budget.id}>
                {budget.budgetYear}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ minWidth: 200, marginBottom: 2, marginLeft: 2 }}>
          <InputLabel id="semester-select-label">Search by Semester</InputLabel>
          <Select
            labelId="semester-select-label"
            id="semester-select"
            value={selectedSemester}
            onChange={handleSemesterChange}
            label="Semester"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="I">I</MenuItem>
            <MenuItem value="II">II</MenuItem>
            <MenuItem value="III">III</MenuItem>
            <MenuItem value="IV">IV</MenuItem>
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
          rows={internStudents}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
          autoHeight
          sx={{ border: 'none' }}
        />
      </Paper>
    
    </LayoutForCourse>
  );
};

export default ListInternshipStudents;

