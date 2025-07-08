import React, { useEffect, useState } from "react";
import {
  Box,
  useTheme,
  Tooltip,
  IconButton,
  TextField,
  Typography,
  Paper
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import LayoutForCourse from "../TrainingCourse/LayoutForCourse";
import TrainingServiceResourceName from "../../../configuration/TrainingServiceResourceName";
import {
  listOfBudgetYears,
  listEducationOpportunity,
  getAllQualification,
  listEducationLevels,listEmployeeData
} from "../../../configuration/TrainingApi";
import { canAccessResource } from "../../../configuration/SecurityService";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';



const ListEducationOpportunity = ({refreshKey}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [searchEmployeeId, setSearchEmployeeId] = useState('');
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [educationOpportunityToDelete, setEducationOpportunityToDelete] = useState(null);
  const [educationOpportunity, setEducationOpportunity] = useState([]);
  const [filteredEducationOpportunity, setFilteredEducationOpportunity] = useState([]);
  const [budgetYear, setBudgetYear] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [employee, setEmployee] = useState([]);
       const [authState] = useAtom(authAtom);
          const tenantId = authState.tenantId
          const userRoles = authState.roles;


  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  useEffect(() => {
    if (searchEmployeeId) {
      const filteredData = educationOpportunity.filter((item) => item.employeeId.includes(searchEmployeeId));
      setFilteredEducationOpportunity(filteredData);
    } else {
      setFilteredEducationOpportunity(educationOpportunity);
    }
  }, [searchEmployeeId, educationOpportunity]);

  const fetchData = async () => {
    try {
      const [
        eucationOpportubityRequestResponse,
        qualificationNamesResponse,
        employeeNameResponse,
        educationLevelNamesResponse,
        budgetResponse
      ] = await Promise.all([
        listEducationOpportunity(tenantId),
        getAllQualification(tenantId),
        listEmployeeData(tenantId),
        listEducationLevels(tenantId),
        listOfBudgetYears(tenantId),
        checkPermissions()
      ]);

      const eucationOpportubityRequestData = eucationOpportubityRequestResponse.data;
      const educationLevelNamesData = educationLevelNamesResponse.data;
      const employeeNameData = employeeNameResponse.data;
      const qualificationNamesData = qualificationNamesResponse.data;
      const budgetYearData = budgetResponse.data;

      const mappedData = eucationOpportubityRequestData.map((lang) => ({
        ...lang,
        educationLevelName: getEducationLevel(lang.educationLevelId, educationLevelNamesData),
        employeeId: getEmployee(lang.employeeId, employeeNameData),
        qualification: getQualificationName(lang.qualificationId, qualificationNamesData),
        budgetYear: getBudgetYear(lang.budgetYearId, budgetYearData),
      }));

      setEducationOpportunity(mappedData);
      setFilteredEducationOpportunity(mappedData);
      setEducationLevels(educationLevelNamesData);
      setEmployee(employeeNameData);
      setQualifications(qualificationNamesData);
      setBudgetYear(budgetYearData);

    } catch (error) {
      setError(error.message);
    }
  };

  const getBudgetYear = (budgetYearId, budgetYears) => {
    const budget = budgetYears.find((budget) => budget.id === budgetYearId);
    return budget ? budget.budgetYear : "Unknown";
  };

  const getQualificationName = (qualificationId, qualificationNamesData) => {
    const qualification = qualificationNamesData.find((qualification) => qualification.id === qualificationId);
    return qualification ? qualification.qualification : "Unknown";
  };

  const getEducationLevel = (educationLevelId, educationLevels) => {
    const education = educationLevels.find((lang) => lang.id === educationLevelId);
    return education ? education.educationLevelName : "Unknown";
  };

  const getEmployee = (employeeId, employeeNames) => {
    const employee = employeeNames.find((lang) => lang.id === employeeId);
    return employee ? employee.employeeId : "Unknown";
  };



 
  const handleEditEducationOpportunity = (id) => {
    navigate('/training/updateeducationOpportunity', { state: { id } });
  };

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const checkPermissions = async () => {
    // Check permissions for actions
    const editAccess = await canAccessResource(TrainingServiceResourceName.UPDATE_EDUCATION_OPPORTUNITY &&
      TrainingServiceResourceName.GET_EDUCATION_OPPORTUNITY_BY_ID,
      userRoles);

    const deleteAccess = await canAccessResource(TrainingServiceResourceName.DELETE_EDUCATION_OPPORTUNITY 
      , userRoles);
  
    setCanEdit(!editAccess);
    setCanDelete(!deleteAccess);
  };

  const columns = [
    { field: "budgetYear", headerName: "Budget Year", flex: 1 },
    { field: "employeeId", headerName: "EmployeeId", flex: 1 },
    { field: "qualification", headerName: "Qualification", flex: 1, cellClassName: "name-column--cell" },
    { field: "educationLevelName", headerName: "Education Level", flex: 1, cellClassName: "name-column--cell" },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>

            {canDelete && (
                <Tooltip title="Delete Education Opportunity">
                <IconButton onClick={() => navigate("/training/deleteEducationOpportunity", { state: { educationOpportunityId: params.row.id } })} color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}

            {canEdit && (
                    <Tooltip title="Update">
                    <IconButton onClick={() => handleEditEducationOpportunity(params.row.id)} color="primary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
            )}

        </Box>
      ),
    },
  ];

  return (
    <LayoutForCourse subtitle="List Of Annual Training Requests">

      <Paper elevation={3} sx={{ padding: 2, minHeight: 5, marginBottom: 1 }}>
        <TextField

          label="Search By Employee ID"
          variant="outlined"
          value={searchEmployeeId}
          onChange={(e) => setSearchEmployeeId(e.target.value)}
          
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
            Error: {error}
          </Typography>
        )}
      </Paper>
      <Paper elevation={2} sx={{ padding: 1, borderRadius: 1 }}>
        <DataGrid
          rows={filteredEducationOpportunity}
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

export default ListEducationOpportunity;
