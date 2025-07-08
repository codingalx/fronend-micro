import { Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { departmentTypesEndpoint } from "../../../configuration/organizationApi";
import { canAccessResource } from "../../../configuration/SecurityService";
import OrganizationServiceResourceName from "../../../configuration/OrganizationServiceResourceName";
import Header from "../common/Header";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

const ListDepartementType = ({refreshKey}) => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;
  const userRoles = authState.roles;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departementTypeToDelete, setDepartementTypeToDelete] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const navigate = useNavigate();

  const fetchTenants = async () => {
    const { url, headers } = departmentTypesEndpoint(authState.accessToken);
    try {
      const response = await axios.get(`${url}/${tenantId}/get-all`, { headers });
      if (Array.isArray(response.data)) {
       
         setTenants(response.data);

      } else {
        setTenants([]);
        console.error("Expected an array but got:", response.data);
      }
    } catch (err) {
      setError(err.message);
      console.error(err.message);
    }
  };

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(
      OrganizationServiceResourceName.UPDATE_DEPARTMENT_TYPE,
      userRoles
    );
    const deleteAccess = await canAccessResource(
      OrganizationServiceResourceName.DELETE_DEPARTMENT_TYPE,
      userRoles
    );

    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
  };

  const handleDeleteRole = async () => {
    try {
      const { url, headers } = departmentTypesEndpoint(authState.accessToken);
      await axios.delete(`${url}/${tenantId}/delete-departmentType/${departementTypeToDelete}`, { headers });
      setReloadTrigger((prev) => prev + 1);
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error("Failed to delete department type", err);
    }
  };

  const handleEditDepartmentType = (id) => {
    navigate("/edit_department_type", { state: { id } });
  };

  useEffect(() => {
    fetchTenants();
    checkPermissions();
  }, [reloadTrigger,refreshKey]);

  const columns = [
    {
      field: "departmentTypeName",
      headerName: "Department Type Name",
      flex: 2,
    },
    { field: "description", headerName: "Department Description", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {canDelete && (
            <Tooltip title="Delete Department Type">
              <IconButton
                onClick={() => {
                  setDepartementTypeToDelete(params.row.id);
                  setDeleteDialogOpen(true);
                }}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          {canEdit && (
            <Tooltip title="Edit Department Type">
              <IconButton
                onClick={() => handleEditDepartmentType(params.row.id)}
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
      <Header
        subtitle="Managing the department type list"
      />
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
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
          },
        }}
      >
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <DataGrid
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
          Are you sure you want to delete this department type?
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

export default ListDepartementType;
