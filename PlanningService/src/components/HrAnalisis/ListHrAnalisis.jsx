import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import { Box, useTheme, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { canAccessResource } from "../../../configuration/SecurityService";
import {  getAllbudgetYears , getAllWorkunits, listHrAnalisis ,listJobRegestration} from "../../../configuration/PlanningApi";
import HrPlanningServiceResourceName from "../../../configuration/HrPlanningServiceResourceName ";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const ListHrAnalisis = ({refreshKey}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
    const [authState] = useAtom(authAtom); 
        const tenantId = authState.tenantId
        const userRoles = authState.roles


  const [accessDenied, setAccessDenied] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [analisis, setAnalisis] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHrAnalsis();
    checkPermissions();
  }, [refreshKey]);

  const fetchHrAnalsis = async () => {
    try {
      const [hrAnalsisResponse, jobResponse, workUnitResposne, budgetYearResponse,needRequestResposne] = await Promise.all([
        listHrAnalisis(tenantId),
        listJobRegestration(tenantId),
        getAllWorkunits(tenantId),
        getAllbudgetYears(tenantId),
      ]);

      const hranalisisData = hrAnalsisResponse.data;
      const jobData = jobResponse.data;
      const workUnitData = workUnitResposne.data;
      const budgetYearData = budgetYearResponse.data;

      const mappedData = hranalisisData.map((request) => ({
        ...request,
        jobTitle: getgetJob(request.jobRegistrationId, jobData),
        workUnitName: getWorkUnitName(request.workUnitId, workUnitData),
        budgetYear: getBudgetYear(request.budgetYearId, budgetYearData),

      }));

      setAnalisis(mappedData);
      showNotification("analsisi  fetched successfully!", "success");
    } catch (error) {
      showNotification("Failed to fetch analisis. Please try again.", "error");
    }
  };


  const getgetJob = (jobRegistrationId, jobs) => {
    const job = jobs.find((job) => job.id === jobRegistrationId);
    return job ? job.jobTitle : "Unknown";
  };



  const getWorkUnitName = (workUnitId, workunits) => {
    const workunit = workunits.find((work) => work.id === workUnitId);
    return workunit ? workunit.workUnitName : "Unknown"; 
  };


  const getBudgetYear = (budgetYearId, budgetYears) => {
    const budgetYear = budgetYears.find((year) => year.id === budgetYearId);
    return budgetYear ? budgetYear.budgetYear : "Unknown";
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };



  const handleeditHrAnalsis = (id) => {
    navigate("/planning/update-analisis", { state: { id } });
  };

  
  const checkPermissions = async () => {
    setCanEdit(await canAccessResource(HrPlanningServiceResourceName.UPDATE_HR_ANALYSIS, userRoles));
    setCanDelete(await canAccessResource(HrPlanningServiceResourceName.DELETE_HR_ANALYSIS, userRoles));
  };



  const columns = [

    { field: "jobTitle", headerName: "Job Title", flex: 1 },
    { field: "budgetYear", headerName: "Budget Year", flex: 1 },
    { field: "workUnitName", headerName: "Work Unit", flex: 1 },
    {
      field: "actions",
      headerName: "Actions ",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
         
            <Tooltip title="Delete Request">
              <IconButton onClick={() => navigate("/planning/delete-analisis", { state: { id: params.row.id ,hrNeedRequestId:params.row.hrNeedRequestId} })} color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
 
         
            <Tooltip title="Update Request Information">
              <IconButton onClick={() => handleeditHrAnalsis(params.row.id)} color="primary">
                <EditIcon />
              </IconButton>
            </Tooltip>
       
    
        </Box>
      ),
    },
  ];


  return (
    <Box m="20px">
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={analisis}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>

    </Box>
  );
};

export default ListHrAnalisis;
