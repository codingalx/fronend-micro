import {
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
} from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { jobRegistrationsEndpoint } from "../../../configuration/organizationApi";
import Header from "../../components/common/Header";
import { canAccessResource } from "../../../configuration/SecurityService";
import OrganizationServiceResourceName from "../../../configuration/OrganizationServiceResourceName";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const ListJobRegistration = ({refreshKey}) => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobregistrationToDelete, setJobregistrationToDelete] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0); // State to trigger re-fetch

  // Permissions
  const [canDelete, setCanDelete] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [canViewDetails, setCanViewDetails] = useState(false);
  const userRoles = authState.roles;

  // Function to handle deletion
  const handleDeleteRole = async () => {
    console.log("Deleting job registration:", jobregistrationToDelete); // Debugging log
    try {
      const { url, headers } = jobRegistrationsEndpoint(authState.accessToken);
      await axios.delete(`${url}/${tenantId}/delete-job/${jobregistrationToDelete}`, {
        headers,
      });

      console.log("Job registration deleted successfully:", jobregistrationToDelete);
      setReloadTrigger((prev) => prev + 1); // Trigger reload after successful delete
      setDeleteDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error("Failed to delete job registration", error);
    }
  };

  const handleCellClick = (params, event) => {
    if (params.field === "delete") {
      event.stopPropagation();
    }
  };

  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState(null);

  const displayTenants = async () => {
    const { url, headers } = jobRegistrationsEndpoint(authState.accessToken);
    try {
      const response = await axios.get(`${url}/${tenantId}/get-all`, {
        headers,
      });
      setTenants(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  const checkPermissions = async () => {
    const deleteAccess = await canAccessResource(
      OrganizationServiceResourceName.DELETE_JOB,
      userRoles
    );
    const editAccess = await canAccessResource(
      OrganizationServiceResourceName.UPDATE_JOB,
      userRoles
    );
    const viewDetailsAccess = await canAccessResource(
      OrganizationServiceResourceName.GET_JOB_BY_ID,
      userRoles
    );

    setCanDelete(deleteAccess);
    setCanEdit(editAccess);
    setCanViewDetails(viewDetailsAccess);
  };

  useEffect(() => {
    displayTenants();
    checkPermissions();
  }, [reloadTrigger,refreshKey]);

  const columns = [
    { field: "jobTitle", headerName: "Job Title", flex: 2 },
    { field: "jobCode", headerName: "Job Code", flex: 1 },
    { field: "jobType", headerName: "Job Type", flex: 1 },
    { field: "minExperience", headerName: "Minimum Experience", flex: 1 },
    { field: "id", headerName: "Job ID", flex: 1 },
    {
      field: "delete",
      headerName: "Delete",
      renderCell: (params) =>
        canDelete && (
          <Tooltip title="Delete Job Registration">
            <IconButton
              onClick={() => {
                console.log("Delete button clicked for:", params.row.id);
                setJobregistrationToDelete(params.row.id); // Set the job registration to delete
                setDeleteDialogOpen(true); // Open the delete dialog
              }}
              color="inherit"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ),
    },
    {
      field: "editAction",
      headerName: "Edit",
      flex: 1,
      renderCell: (params) =>
        canEdit && (
          <Tooltip title="Edit Job Registration">
            <IconButton
              onClick={() =>
                navigate("/edit_job_registration", { state: { id: params.row.id } })
              }
              color="inherit"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        ),
    },
    {
      field: "detailsAction",
      headerName: "Details",
      flex: 1,
      renderCell: (params) =>
        canViewDetails && (
          <Tooltip title="View Job Details">
            <IconButton
              onClick={() => navigate("/details_job", { state: { id: params.row.id } })}
              color="inherit"
            >
              <ReadMoreIcon />
            </IconButton>
          </Tooltip>
        ),
    },
  ];

  return (
    <Box m="20px">
      <Header  subtitle="Managing the job list" />
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
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <DataGrid
            onCellClick={handleCellClick}
            rows={tenants.map((tenant) => ({
              ...tenant,
              id: tenant.id,
            }))}
            columns={columns}
          />
        )}
      </Box>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this job registration?
        </DialogContent>
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

export default ListJobRegistration;