import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jobGradeEndpoint } from "../../../configuration/organizationApi";
import { canAccessResource } from "../../../configuration/SecurityService";
import Header from "../common/Header";
import OrganizationServiceResourceName from "../../../configuration/OrganizationServiceResourceName";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';

const ListJobGrade = ({refreshKey}) => {
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const userRoles = authState.roles;
  const navigate = useNavigate();

  const [jobGrades, setJobGrades] = useState([]);
  const [error, setError] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [loading, setLoading] = useState(true);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobGradeToDelete, setJobGradeToDelete] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const fetchJobGrades = async () => {
    try {
      setLoading(true);
      const { url, headers } = jobGradeEndpoint(authState.accessToken);
      const response = await axios.get(`${url}/${tenantId}/get-all`, { headers });
      
      // Ensure the response data is an array
      if (Array.isArray(response.data)) {
        setJobGrades(response.data);
      } else {
        setJobGrades([]);
        console.error("Expected an array but got:", response.data);
      }
    } catch (err) {
      setError(err.message);
      console.error(err.message);
      setJobGrades([]); // Ensure jobGrades is always an array
    } finally {
      setLoading(false);
    }
  };

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(
      OrganizationServiceResourceName.UPDATE_JOB_GRADE,
      userRoles
    );
    const deleteAccess = await canAccessResource(
      OrganizationServiceResourceName.DELETE_JOB_GRADE,
      userRoles
    );

    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
  };

  const handleDeleteJobGrade = async () => {
    try {
      const { url, headers } = jobGradeEndpoint(authState.accessToken);
      await axios.delete(`${url}/${tenantId}/delete/${jobGradeToDelete}`, { headers });
      setReloadTrigger((prev) => prev + 1);
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error("Failed to delete job grade:", err);
    }
  };

  const handleEditJobGrade = (id) => {
    navigate("/edit_job_grade", { state: { id } });
  };

  useEffect(() => {
    fetchJobGrades();
    checkPermissions();
  }, [reloadTrigger, refreshKey]);

  const columns = [
    { field: "jobGradeName", headerName: "Job Grade Name", flex: 2 },
    { field: "description", headerName: "Job Grade Description", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {canDelete && (
            <Tooltip title="Delete Job Grade">
              <IconButton
                onClick={() => {
                  setJobGradeToDelete(params.row.id);
                  setDeleteDialogOpen(true);
                }}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          {canEdit && (
            <Tooltip title="Edit Job Grade">
              <IconButton
                onClick={() => handleEditJobGrade(params.row.id)}
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
      <Header subtitle="Managing the job grade list" />
      <Box m="40px 0 0 0" height="75vh">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <DataGrid
            rows={jobGrades.map((jobGrade) => ({ ...jobGrade, id: jobGrade.id }))}
            columns={columns}
            getRowId={(row) => row.id}
            checkboxSelection={false}
          />
        )}
      </Box>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this job grade?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteJobGrade} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListJobGrade;