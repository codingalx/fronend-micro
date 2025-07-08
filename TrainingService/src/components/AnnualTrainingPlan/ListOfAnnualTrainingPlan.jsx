import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton, Select, MenuItem, FormControl, InputLabel, Typography, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import LayoutForCourse from "../TrainingCourse/LayoutForCourse";
import {
  listCourseCategory,
  listOfdepartement,
  listTrainingInstution,
  listOfBudgetYears,
  listAnnualTrainingPlan,
  deleteAnnualTrainingPlan,
  getAnnualTrainingPlanByDepartement,
} from "../../../configuration/TrainingApi";
import TrainingServiceResourceName from "../../../configuration/TrainingServiceResourceName";
import { canAccessResource } from "../../../configuration/SecurityService";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';


const ListOfAnnualTrainingPlan = ({refreshKey}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [selectedDepartements, setselectedDepartements] = useState(''); 
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId
  const userRoles = authState.roles;

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(TrainingServiceResourceName.GET_ALL_ANNUAL_TRAINING_PLANS, userRoles);
    const deleteAccess = await canAccessResource(TrainingServiceResourceName.DELETE_ANNUAL_TRAINING_PLAN, userRoles);

    setCanEdit(!editAccess);
    setCanDelete(!deleteAccess);
  };

  

  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [annualTrainingPlanToDelete, setAnnualTrainingPlanToDelete] = useState(null);

  const [annualTrainingPlan, setAnnualTrainingPlan] = useState([]);
  const [department, setDepartment] = useState([]);
  const [courseCategory, setCourseCategory] = useState([]);
  const [institutionNames, setInstitutionNames] = useState([]);
  const [budgetYear, setBudgetYear] = useState([]);


  useEffect(() => {
    fetchData(selectedDepartements);
    checkPermissions();
  }, [selectedDepartements,refreshKey]);

  const fetchData = async (departmentId) => {
    try {
      const [
        trainingRequestResponse,
        categoryNamesResponse,
        departmentNameResponse,
        institutionNamesResponse,
        budgetResponse
      ] = await Promise.all([
        departmentId === '' 
          ? listAnnualTrainingPlan(tenantId)
          : getAnnualTrainingPlanByDepartement(tenantId,departmentId),
        listCourseCategory(tenantId),
        listOfdepartement(tenantId),
        listTrainingInstution(tenantId),
        listOfBudgetYears(tenantId),
      ]);

      const trainingRequestData = trainingRequestResponse.data;
      const categoryNamesData = categoryNamesResponse.data;
      const departmentNamesData = departmentNameResponse.data;
      const institutionNameData = institutionNamesResponse.data;
      const budgetYearData = budgetResponse.data;

      const mappedData = trainingRequestData.map((lang) => ({
        ...lang,
        categoryName: getCategoryName(lang.courseCategoryId, categoryNamesData),
        departmentName: getDepartmentName(lang.departmentId, departmentNamesData),
        institutionName: getInstitutionName(lang.trainingInstitutionId, institutionNameData),
        budgetYear: getBudgetYear(lang.budgetYearId, budgetYearData),
      }));

      setAnnualTrainingPlan(mappedData);
      setCourseCategory(categoryNamesData);
      setDepartment(departmentNamesData);
      setInstitutionNames(institutionNameData);
      setBudgetYear(budgetYearData);
    } catch (error) {
      setError(error.message);
    }
  };

  const getCategoryName = (courseCategoryId, categoryNames) => {
    const category = categoryNames.find((lang) => lang.id === courseCategoryId);
    return category ? category.categoryName : "Unknown";
  };

  const getDepartmentName = (departmentId, departmentNames) => {
    const department = departmentNames.find((dept) => dept.id === departmentId);
    return department ? department.departmentName : "Unknown";
  };

  const getInstitutionName = (institutionId, institutionNames) => {
    const institution = institutionNames.find((inst) => inst.id === institutionId);
    return institution ? institution.institutionName : "Unknown";
  };

  const getBudgetYear = (budgetYearId, budgetYears) => {
    const budget = budgetYears.find((budget) => budget.id === budgetYearId);
    return budget ? budget.budgetYear : "Unknown";
  };

  const handleDelete = (courseTraining) => {
    setAnnualTrainingPlanToDelete(courseTraining);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAnnualTrainingPlan(tenantId,annualTrainingPlanToDelete.id);
      const updateAnnualTrainingPlan = annualTrainingPlan.filter((plan) => plan.id !== annualTrainingPlanToDelete.id);
      setAnnualTrainingPlan(updateAnnualTrainingPlan);
    } catch (error) {
      setError(error.message);
    } finally {
      setOpenDialog(false);
    }
  };



  const handleEditAnnualTrainingPlan = (id) => {
    navigate('/training/updateAnnualTrainingPlan', { state: {id} });
  };
 

  const handleStatusChange = (event) => {
    setselectedDepartements(event.target.value);
  };

 

  const columns = [
    { field: "numberOfParticipants", headerName: "Number Of Participants", flex: 1 },
    { field: "categoryName", headerName: "Category Name", flex: 1 },
    { field: "institutionName", headerName: "Institution Name", flex: 1 },
    { field: "departmentName", headerName: "Department Name", flex: 1 },
    { field: "budgetYear", headerName: "Budget Year", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>

              {canDelete && (
                    <Tooltip title="Delete training request ">
                    <IconButton onClick={() => navigate("/training/delete_trainining", { state: { planId: params.row.id } })} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
          
      
          {canEdit &&
            <Tooltip title="Update recruitment Information">
            <IconButton onClick={() => handleEditAnnualTrainingPlan( params.row.id)} color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>

          }

        </Box>
      ),
    },
  ];

  return (
    <LayoutForCourse subtitle="List Of Annual Training Plans">
  
      <Paper elevation={3} sx={{ padding: 2,minHeight: 5, marginBottom: 1 }}>
        <FormControl variant="outlined" sx={{ minWidth: 200, marginBottom: 2 }}>
          <InputLabel id="status-select-label">Search Training by Status</InputLabel>
          <Select
            labelId="status-select-label"
            id="status-select"
            value={selectedDepartements}
            onChange={handleStatusChange}
            label="Status"
          >
           {department.map((department) => (
            <MenuItem key={department.id} value={department.id}>
              {department.departmentName}
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
          rows={annualTrainingPlan}
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

export default ListOfAnnualTrainingPlan;
