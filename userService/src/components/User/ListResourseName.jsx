import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Snackbar,
  Alert,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useLocation, useNavigate } from "react-router-dom";
import {
  assignAuthResourseForRole,
  getAuthResourse,
  UnassignAuthResourseForRole,
  getOrganizationResourse,
  assignOrganizationResourseForRole,
  UnassignOrganizationResourseForRole,
  getRecruitmentResourse,
  assignRecruitmentResourseForRole,
  UnassignRecruitmentResourseForRole,
  getEmployeeResourse,
  assignEmployeeResourseForRole,
  UnassignEmployeeResourseForRole,
  getPlanningResourse,
  assignPlanningResourseForRole,
  UnassignPlanningResourseForRole,
  getLeaveResourse,
  assignLeaveResourseForRole,
  UnassignLeaveResourseForRole,
  getTrainingResourse,
  assignTrainingResourseForRole,
  UnassignTrainingResourseForRole,
  getEvaluationResourse,
  assignEvaluationResourseForRole,
  UnassignEvaluationResourseForRole,
  getDelegationResourse,
  assignDelegationResourseForRole,
  UnassignDelegationResourseForRole,

  getDocumentResourse,
  assignDocumentResourseForRole,
  UnassignDocumentResourseForRole,

  getTransferResourse,
  assignTransferResourseForRole,
  UnassignTransferResourseForRole,

  getSeparationResourse,
  assignSeparationResourseForRole,
  UnassignSeparationResourseForRole,

  getPromotionResourse,
  assignPromotionResourseForRole,
  UnassignPromotionResourseForRole,

  getComplaintResourse,
  assignComplaintResourseForRole,
  UnassignComplaintResourseForRole,

  getDisciplineResourse,
  assignDisciplineResourseForRole,
  UnassignDisciplineResourseForRole,
} from "../../../configuration/authApi";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";

const ListResourseName = () => {
  const location = useLocation();
  const { roleName } = location.state; // Role name passed via state
  const [resourses, setResourses] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [assignedResources, setAssignedResources] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [apiCategory, setApiCategory] = useState("Auth"); // Default category
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  useEffect(() => {
    fetchAllResourse();
  }, [apiCategory]); // Fetch resources whenever the API category changes

  useEffect(() => {
    setFilteredTenants(resourses); // Initialize filteredTenants with all resources
    fetchAssignedResources();
  }, [resourses]);

  const fetchAllResourse = async () => {
    try {
      let response;
      switch (apiCategory) {
        case "Auth":
          response = await getAuthResourse(tenantId);
          break;
        case "Recruitment":
          response = await getRecruitmentResourse(tenantId);
          break;
        case "Organization":
          response = await getOrganizationResourse(tenantId);
          break;
        case "Employee":
          response = await getEmployeeResourse(tenantId);
          break;
        case "Planning":
          response = await getPlanningResourse(tenantId);
          break;
        case "Leave":
          response = await getLeaveResourse(tenantId);
          break;
        case "Training":
          response = await getTrainingResourse(tenantId);
          break;
        case "Evaluation":
          response = await getEvaluationResourse(tenantId);
          break;
        case "Document":
          response = await getDocumentResourse(tenantId);
          break;
        case "Delegation":
          response = await getDelegationResourse(tenantId);
          break;
          case "Transfer":
            response = await getTransferResourse(tenantId);
            break;
            case "Separation":
              response = await getSeparationResourse(tenantId);
              break;
              case "Promotion":
                response = await getPromotionResourse(tenantId);
                break;
            case "Discipline":
               response = await getDisciplineResourse(tenantId);
                break;
             case "Complaint":
                  response = await getComplaintResourse(tenantId);
                   break;


        default:
          response = await getAuthResourse(tenantId);
      }
      setResourses(response.data);
    } catch (error) {
      console.error("Error fetching resources:", error.message);
    }
  };

  const fetchAssignedResources = () => {
    const assignedIds = resourses
      .filter((resource) => resource.requiredRoles.includes(roleName))
      .map((resource) => resource.id);
    setAssignedResources(assignedIds);
  };

  const handleAssignResource = async (resourceId) => {
    try {
      const payload = { roles: [roleName] };
      let apiCall;
      switch (apiCategory) {
        case "Auth":
          apiCall = assignAuthResourseForRole;
          break;
        case "Recruitment":
          apiCall = assignRecruitmentResourseForRole;
          break;
        case "Organization":
          apiCall = assignOrganizationResourseForRole;
          break;
        case "Employee":
          apiCall = assignEmployeeResourseForRole;
          break;

        case "Planning":
          apiCall = assignPlanningResourseForRole;
          break;

        case "Leave":
          apiCall = assignLeaveResourseForRole;
          break;

        case "Training":
          apiCall = assignTrainingResourseForRole;
          break;
        case "Evaluation":
          apiCall = assignEvaluationResourseForRole;
          break;
        case "Document":
          apiCall = assignDocumentResourseForRole;
          break;
        case "Delegation":
          apiCall = assignDelegationResourseForRole;
          break;

          case "Transfer":
            apiCall = assignTransferResourseForRole;
            break;

            case "Separation":
              apiCall = assignSeparationResourseForRole;
              break;

              case "Promotion":
                apiCall = assignPromotionResourseForRole;
                break;
             case "Discipline":
               apiCall = assignDisciplineResourseForRole;
                break;
            case "Complaint":
                  apiCall = assignComplaintResourseForRole;
                   break;

        default:
          apiCall = assignAuthResourseForRole;
      }
      await apiCall(tenantId, resourceId, roleName, payload);
      setAssignedResources((prev) => [...prev, resourceId]);
      setResourses((prev) =>
        prev.map((resource) =>
          resource.id === resourceId
            ? {
                ...resource,
                requiredRoles: [...resource.requiredRoles, roleName],
              }
            : resource
        )
      );
      setNotification({
        open: true,
        message: "Resource assigned successfully!",
        severity: "success",
      });
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to assign resource.",
        severity: "error",
      });
      console.error("Error assigning resource:", error.message);
    }
  };

  const handleUnassignResource = async (resourceId) => {
    if (roleName === "admin") {
      setNotification({
        open: true,
        message: "Unassign action is not allowed for the admin role.",
        severity: "warning",
      });
      return;
    }

    try {
      let apiCall;
      switch (apiCategory) {
        case "Auth":
          apiCall = UnassignAuthResourseForRole;
          break;
        case "Recruitment":
          apiCall = UnassignRecruitmentResourseForRole;
          break;
        case "Organization":
          apiCall = UnassignOrganizationResourseForRole;
          break;
        case "Employee":
          apiCall = UnassignEmployeeResourseForRole;
          break;

        case "Planning":
          apiCall = UnassignPlanningResourseForRole;
          break;

        case "Leave":
          apiCall = UnassignLeaveResourseForRole;
          break;

        case "Training":
          apiCall = UnassignTrainingResourseForRole;
          break;
        case "Evaluation":
          apiCall = UnassignEvaluationResourseForRole;
          break;
        case "Document":
          apiCall = UnassignDocumentResourseForRole;
          break;
        case "Delegation":
          apiCall = UnassignDelegationResourseForRole;
          break;

          case "Transfer":
            apiCall = UnassignTransferResourseForRole;
            break;

            case "Separation":
              apiCall = UnassignSeparationResourseForRole;
              break;

              case "Promotion":
                apiCall = UnassignPromotionResourseForRole;
                break;
            case "Discipline":
                  apiCall = UnassignDisciplineResourseForRole;
                  break;
            case "Complaint":
                    apiCall = UnassignComplaintResourseForRole;
                    break;

        default:
          apiCall = UnassignAuthResourseForRole;
      }
      await apiCall(tenantId, resourceId, roleName);
      setAssignedResources((prev) => prev.filter((id) => id !== resourceId));
      setResourses((prev) =>
        prev.map((resource) =>
          resource.id === resourceId
            ? {
                ...resource,
                requiredRoles: resource.requiredRoles.filter(
                  (role) => role !== roleName
                ),
              }
            : resource
        )
      );
      setNotification({
        open: true,
        message: "Resource unassigned successfully!",
        severity: "success",
      });
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to unassign resource.",
        severity: "error",
      });
      console.error("Error unassigning resource:", error.message);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredTenants(resourses); // Show all resources when search is cleared
    } else {
      const filtered = resourses.filter((resource) =>
        resource.resourceName.toLowerCase().includes(query)
      );
      setFilteredTenants(filtered);
    }
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const columns = [
    { field: "resourceName", headerName: "Resource Name", flex: 1 },
    { field: "requiredRoles", headerName: "Required Roles", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => {
        const resourceId = params.row.id;
        const assigned = assignedResources.includes(resourceId);

        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              disabled={assigned}
              onClick={() => handleAssignResource(resourceId)}
            >
              Assign
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={roleName === "admin" || !assigned}
              onClick={() => handleUnassignResource(resourceId)}
            >
              Unassign
            </Button>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt="20px"
      >
        <Button
          variant="contained"
          sx={{ mr: 2 }}
          onClick={() => navigate(`/role_manage`)}
        >
          Back To List
        </Button>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FormControl sx={{ minWidth: 200, mr: 2 }}>
            <InputLabel>Choose Resourse</InputLabel>
            <Select
              value={apiCategory}
              onChange={(e) => setApiCategory(e.target.value)}
            >
              <MenuItem value="Auth">Auth</MenuItem>
              <MenuItem value="Organization">Organization</MenuItem>
              <MenuItem value="Recruitment">Recruitment</MenuItem>
              <MenuItem value="Employee">Employee</MenuItem>
              <MenuItem value="Leave">Leave</MenuItem>
              <MenuItem value="Planning">Planning</MenuItem>
              <MenuItem value="Training">Training</MenuItem>
              <MenuItem value="Evaluation">Evaluation</MenuItem>
              <MenuItem value="Delegation">Delegation</MenuItem>
              <MenuItem value="Document">Document</MenuItem>
              <MenuItem value="Transfer">Transfer</MenuItem>
              <MenuItem value="Separation">Separation</MenuItem>
              <MenuItem value="Promotion">Promotion</MenuItem>

            </Select>
          </FormControl>

          <TextField
            label="Search Resource"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearch}
            sx={{ width: "200px" }}
          />
        </Box>
      </Box>

      <Box m="10px 0 0 0" height="75vh">
        <DataGrid
          rows={searchQuery ? filteredTenants : resourses} // Use filteredTenants when searching
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ListResourseName;


