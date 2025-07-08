import { Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import {
  staffPlanEndpoint,
  jobGradeEndpoint,
  jobRegistrationsEndpoint,
  departmentEndpoint,
} from "../../../configuration/organizationApi";
import Header from "../common/Header";
import OrganizationServiceResourceName from "../../../configuration/OrganizationServiceResourceName";
import { canAccessResource } from "../../../configuration/SecurityService";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

const ListStaffPlan = ({refreshKey}) => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffPlanToDelete, setStaffPlanToDelete] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canDetail, setCanDetail] = useState(false);

  const userRoles = authState.roles;

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(OrganizationServiceResourceName.UPDATE_STAFF_PLAN, userRoles);
    const deleteAccess = await canAccessResource(OrganizationServiceResourceName.DELETE_STAFF_PLAN, userRoles);
    const detailAccess = await canAccessResource(OrganizationServiceResourceName.GET_STAFF_PLANS_BY_ID, userRoles);

    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
    setCanDetail(detailAccess);
  };

  useEffect(() => {
    checkPermissions();
  }, [authState]);

  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);

  const handleDeleteRole = async () => {
    console.log("Deleting staff Plan:", staffPlanToDelete);
    try {
      const { url, headers } = staffPlanEndpoint(authState.accessToken);
      await axios.delete(`${url}/${tenantId}/delete-staff-plan/${staffPlanToDelete}`, { headers });

      console.log("staff-plan deleted successfully:", staffPlanToDelete);
      setReloadTrigger((prev) => prev + 1);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete staff plan ", error);
    }
  };

  const handleCellClick = (params, event) => {
    if (params.field === "delete") {
      event.stopPropagation();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { url: SPURL, headers } = staffPlanEndpoint(authState.accessToken);
      try {
        const staffPlansResponse = await axios.get(`${SPURL}/${tenantId}/get-all`, { headers });
        const staffPlans = staffPlansResponse.data;

        const rowsData = await Promise.all(
          staffPlans.map(async (plan) => {
            const { url: JRURL } = jobRegistrationsEndpoint(authState.accessToken);
            const jobRegistrationResponse = await axios.get(`${JRURL}/${tenantId}/get/${plan.jobRegistrationId}`, { headers });
            const jobRegistration = jobRegistrationResponse.data;

            const { url: JGURL } = jobGradeEndpoint(authState.accessToken);
            const jobGradeResponse = await axios.get(`${JGURL}/${tenantId}/get/${jobRegistration.jobGradeId}`, { headers });
            const jobGrade = jobGradeResponse.data;

            const { url: DURL } = departmentEndpoint(authState.accessToken);
            const departmentResponse = await axios.get(`${DURL}/${tenantId}/get/${plan.departmentId}`, { headers });
            const department = departmentResponse.data;

            return {
              id: plan.id,
              ...plan,
              jobTitle: jobRegistration.jobTitle,
              jobCode: jobRegistration.jobCode,
              jobGradeName: jobGrade.jobGradeName,
              departmentName: department.departmentName,
            };
          })
        );

        setRows(rowsData);
      } catch (error) {
        setError(error.message);
        console.log(error.message);
      }
    };

    fetchData();
  }, [reloadTrigger,refreshKey]);

  const columns = [
    { field: "departmentName", headerName: "Department Name", flex: 1 },
    { field: "jobTitle", headerName: "Job Title", flex: 2 },
    { field: "quantity", headerName: "No. of Emp. Needs", flex: 1 },
    { field: "jobCode", headerName: "Job Code", flex: 1 },
    { field: "jobGradeName", headerName: "Job Grade", flex: 1 },
    {
      field: "delete",
      headerName: "Delete",
      renderCell: (params) =>
        canDelete ? (
          <IconButton
            onClick={() => {
              console.log("Delete button clicked for:", params.row.id);
              setStaffPlanToDelete(params.row.id);
              setDeleteDialogOpen(true);
            }}
            color="inherit"
          >
            <DeleteIcon />
          </IconButton>
        ) : null,
    },
    {
      field: "editAction",
      headerName: "Edit",
      flex: 1,
      renderCell: (params) =>
        canEdit ? (
          <IconButton onClick={() => navigate("/edit_staff_plan", { state: { id: params.row.id } })} color="inherit">
            <EditIcon />
          </IconButton>
        ) : null,
    },
    {
      field: "detailsAction",
      headerName: "Details",
      flex: 1,
      renderCell: (params) =>
        canDetail ? (
          <IconButton onClick={() => navigate("/details_staff_plan", { state: { id: params.row.id } })} color="inherit">
            <ReadMoreIcon />
          </IconButton>
        ) : null,
    },
  ];

  return (
    <Box m="20px">
      <Header  subtitle="Managing the staff plan list" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {},
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {},
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
          },
          "& .MuiCheckbox-root": {},
        }}
      >
        {error ? <p>Error: {error}</p> : <DataGrid onCellClick={handleCellClick} rows={rows} columns={columns} pageSize={5} />}
      </Box>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this staff plan?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteRole} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListStaffPlan;
