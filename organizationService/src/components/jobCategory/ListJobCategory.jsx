import { Box, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { jobCategoriesEndpoint } from "../../../configuration/organizationApi";
import { canAccessResource } from "../../../configuration/SecurityService";
import OrganizationServiceResourceName from "../../../configuration/OrganizationServiceResourceName";
import Header from "../common/Header";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

const ListJobCategory = ({refreshKey}) => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;
  const userRoles = authState.roles;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobCategoryToDelete, setJobCategoryToDelete] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [jobCategories, setJobCategories] = useState([]);
  const [error, setError] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const navigate = useNavigate();

  const fetchJobCategories = async () => {
    const { url, headers } = jobCategoriesEndpoint(authState.accessToken);
    try {
      const response = await axios.get(`${url}/${tenantId}/get-all`, { headers });


      // Ensure the response data is an array
      if (Array.isArray(response.data)) {
        setJobCategories(response.data);
      } else {
        setJobCategories([]);
        console.error("Expected an array but got:", response.data);
      }
      
    } catch (err) {
      setError(err.message);
      console.error(err.message);
    }
  };

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(
      OrganizationServiceResourceName.UPDATE_JOB_CATEGORY,
      userRoles
    );
    const deleteAccess = await canAccessResource(
      OrganizationServiceResourceName.DELETE_JOB_CATEGORY,
      userRoles
    );

    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
  };

  const handleDeleteJobCategory = async () => {
    try {
      const { url, headers } = jobCategoriesEndpoint(authState.accessToken);
      await axios.delete(`${url}/${tenantId}/delete/${jobCategoryToDelete}`, { headers });
      setReloadTrigger((prev) => prev + 1);
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error("Failed to delete job category:", err);
    }
  };

  const handleEditJobCategory = (id) => {
    navigate("/edit_job_category", { state: { id } });
  };

  useEffect(() => {
    fetchJobCategories();
    checkPermissions();
  }, [reloadTrigger,refreshKey]);

  const columns = [
    { field: "jobCategoryName", headerName: "Job Category Name", flex: 2 },
    { field: "description", headerName: "Job Category Description", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {canDelete && (
            <Tooltip title="Delete Job Category">
              <IconButton
                onClick={() => {
                  setJobCategoryToDelete(params.row.id);
                  setDeleteDialogOpen(true);
                }}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          {canEdit && (
            <Tooltip title="Edit Job Category">
              <IconButton
                onClick={() => handleEditJobCategory(params.row.id)}
                color="primary"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header  subtitle="Managing the job category list" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": { borderBottom: "none" },
          "& .MuiDataGrid-footerContainer": { borderTop: "none" },
        }}
      >
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <DataGrid
            rows={jobCategories.map((jobCategory) => ({ ...jobCategory, id: jobCategory.id }))}
            columns={columns}
          />
        )}
      </Box>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this job category?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteJobCategory} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListJobCategory;
