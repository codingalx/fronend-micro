import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import { Box, useTheme, IconButton, Tooltip, TextField, Snackbar, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { useNavigate } from "react-router-dom";
import ToolbarComponent from "../common/ToolbarComponent";
import { canAccessResource } from "../../../configuration/SecurityService";
import { getAllbudgetYears, getAllstafPlan, listNeedRequest ,listDepartement } from "../../../configuration/PlanningApi";
import HrPlanningServiceResourceName from '../../../configuration/HrPlanningServiceResourceName '
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

const ListNeedRequest = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
    const [authState] = useAtom(authAtom); 
      const tenantId = authState.tenantId
      const userRoles = authState.roles

  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchNeedRequest();
    checkPermissions();
  }, []);

  const fetchNeedRequest = async () => {
    try {
      const [requestResponse, staffPlanResponse, departmentResponse, budgetYearResponse] = await Promise.all([
        listNeedRequest(tenantId),
        getAllstafPlan(tenantId),
        listDepartement(tenantId),
        getAllbudgetYears(tenantId),
      ]);

      const requestData = requestResponse.data;
      const staffPlanData = staffPlanResponse.data;
      const departmentData = departmentResponse.data;
      const budgetYearData = budgetYearResponse.data;

      const mappedData = requestData.map((request) => ({
        ...request,
        quantity: getStaffPlan(request.staffPlanId, staffPlanData),
        departmentName: getDepartmentName(request.departementId, departmentData),
        budgetYear: getBudgetYear(request.budgetYearId, budgetYearData),
      }));

      setRequests(mappedData);
      showNotification("Request planning fetched successfully!", "success");
    } catch (error) {
      setError(error.message);
      showNotification("Failed to fetch requests. Please try again.", "error");
    }
  };


  const getStaffPlan = (staffPlanId, staffPlans) => {
    const staff = staffPlans.find((plan) => plan.id === staffPlanId);
    return staff ? staff.quantity : "Unknown";
  };


  const getDepartmentName = (departmentId, departments) => {
    const department = departments.find((dept) => dept.id === departmentId);
    return department ? department.departmentName : "Unknown"; 
  };


  const getBudgetYear = (budgetYearId, budgetYears) => {
    const budgetYear = budgetYears.find((year) => year.id === budgetYearId);
    return budgetYear ? budgetYear.budgetYear : "Unknown";
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const handleEditRequest = (id) => {
    navigate("/planning/update", { state: { id } });
  };

  const handleAddHrAnalisis = (id) => {
    navigate("/planning/hranalyses", { state: { id } });
  };

  const handleAddPromotion = (id) => {
    navigate("/planning/requitment-promotion", { state: { id } });
  };

  const checkPermissions = async () => {
    setCanEdit(await canAccessResource(HrPlanningServiceResourceName.UPDATE_HR_NEED_REQUEST, userRoles));
    setCanDelete(await canAccessResource(HrPlanningServiceResourceName.DELETE_HR_NEED_REQUEST, userRoles));
  };


  const filteredRequests = searchTerm
    ? requests.filter((request) =>
      request.quantity.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
    : requests;


  const columns = [
    { field: "noOfPosition", headerName: "Number of Positions", flex: 1 },
    { field: "employmentType", headerName: "Employment Type", flex: 1 },
    { field: "departmentName", headerName: "Department Name", flex: 1 },
    { field: "budgetYear", headerName: "Budget Year", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    {
      field: "actions",
      headerName: "Actions ",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        
            <Tooltip title="Delete Request">
              <IconButton onClick={() => navigate("/planning/deleteRequest", { state: { id: params.row.id } })} color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
        
       
            <Tooltip title="Update Request Information">
              <IconButton onClick={() => handleEditRequest(params.row.id)} color="primary">
                <EditIcon />
              </IconButton>
            </Tooltip>
   
          <Tooltip title="Add Hr Analsisi">
            <IconButton onClick={() => handleAddHrAnalisis(params.row.id)}>
              <ReadMoreIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Add Hr Promotion">
            <IconButton onClick={() => handleAddPromotion(params.row.id)}>
              <ReadMoreIcon />
            </IconButton>
          </Tooltip>

        </Box>
      ),
    },
  ];

  return (
    <Box>
  
        <Box>
          <ToolbarComponent mainIconType="add" onMainIconClick={() => navigate("/planning/needRequest")} />
          <Box m="0 0 0 0" height="75vh">
            <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mb: 2 }}>
              <TextField
                label="Search by Staff Plan ID"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: "300px" }}
                placeholder="Enter Staff Plan ID"
                error={searchTerm && filteredRequests.length === 0}
              />
            </Box>
            <DataGrid
              rows={filteredRequests}
              columns={columns}
              getRowId={(row) => row.id}
              checkboxSelection={false}
              pageSize={20}
              pageSizeOptions={[10, 20, 50]}
            />
          </Box>
          {error && (
            <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError(null)}>
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            </Snackbar>
          )}
          <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
              {notification.message}
            </Alert>
          </Snackbar>
        </Box>
      
    </Box>
  );
};

export default ListNeedRequest;
