import { Box, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { workUnitEndpoint } from "../../../configuration/organizationApi";
import  { canAccessResource } from '../../../configuration/SecurityService'
import OrganizationServiceResourceName from "../../../configuration/OrganizationServiceResourceName";
import Header from "../common/Header";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

const ListWorkUnit = ({refreshKey}) => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;
  const userRoles = authState.roles;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workUnitToDelete, setWorkUnitToDelete] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [workUnits, setWorkUnits] = useState([]);
  const [error, setError] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const navigate = useNavigate();

  const fetchWorkUnits = async () => {
    const { url, headers } = workUnitEndpoint(authState.accessToken);
    try {
      const response = await axios.get(`${url}/${tenantId}/get-all`, { headers });

       // Ensure the response data is an array
      if (Array.isArray(response.data)) {
        setWorkUnits(response.data);
      } else {
        setWorkUnits([]);
        console.error("Expected an array but got:", response.data);
      }
    } catch (err) {
      setError(err.message);
      console.error(err.message);
    }
  };

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(
      OrganizationServiceResourceName.UPDATE_WORK_UNIT,
      userRoles
    );
    const deleteAccess = await canAccessResource(
      OrganizationServiceResourceName.DELETE_WORK_UNIT,
      userRoles
    );

    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
  };

  const handleDeleteWorkUnit = async () => {
    try {
      const { url, headers } = workUnitEndpoint(authState.accessToken);
      await axios.delete(`${url}/${tenantId}/delete/${workUnitToDelete}`, { headers });
      setReloadTrigger((prev) => prev + 1);
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error("Failed to delete work unit:", err);
    }
  };

  const handleEditWorkUnit = (id) => {
    navigate("/edit_work_unit", { state: { id } });
  };

  useEffect(() => {
    fetchWorkUnits();
    checkPermissions();
  }, [reloadTrigger,refreshKey]);

  const columns = [
    { field: "workUnitName", headerName: "Work Unit Name", flex: 2 },
    { field: "description", headerName: "Work Unit Description", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {canDelete && (
            <Tooltip title="Delete Work Unit">
              <IconButton
                onClick={() => {
                  setWorkUnitToDelete(params.row.id);
                  setDeleteDialogOpen(true);
                }}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          {canEdit && (
            <Tooltip title="Edit Work Unit">
              <IconButton
                onClick={() => handleEditWorkUnit(params.row.id)}
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
      <Header  subtitle="Managing the work unit list" />
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
            rows={workUnits.map((workUnit) => ({ ...workUnit, id: workUnit.id }))}
            columns={columns}
          />
        )}
      </Box>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this work unit?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteWorkUnit} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListWorkUnit;
