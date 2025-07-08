import { Box, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { educationalLevelEndpoint } from "../../../configuration/organizationApi";
import {canAccessResource } from '../../../configuration/SecurityService'
import OrganizationServiceResourceName from '../../../configuration/OrganizationServiceResourceName'
import Header from "../common/Header";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

const ListEducationLevel = ({refreshKey}) => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;
  const userRoles = authState.roles;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [educationLevelToDelete, setEducationLevelToDelete] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const navigate = useNavigate();

  const displayTenants = async () => {
    const { url, headers } = educationalLevelEndpoint(authState.accessToken);

    try {
      const response = await axios.get(`${url}/${tenantId}/get-all`, { headers });

            // Ensure the response data is an array
      if (Array.isArray(response.data)) {
       
         setTenants(response.data);

      } else {
        setTenants([]);
        console.error("Expected an array but got:", response.data);
      }

    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(
      OrganizationServiceResourceName.UPDATE_EDUCATION_LEVEL,
      userRoles
    );
    const deleteAccess = await canAccessResource(
      OrganizationServiceResourceName.DELETE_EDUCATION_LEVEL,
      userRoles
    );

    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
  };

  const handleDeleteRole = async () => {
    try {
      const { url, headers } = educationalLevelEndpoint(authState.accessToken);
      await axios.delete(`${url}/${tenantId}/delete/${educationLevelToDelete}`, { headers });
      setReloadTrigger((prev) => prev + 1);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete education level:", error);
    }
  };

  const handleEditEducationLevel = (id) => {
    navigate("/edit_education_level", { state: { id } });
  };

  useEffect(() => {
    displayTenants();
    checkPermissions();
  }, [reloadTrigger,refreshKey]);

  const columns = [
    {
      field: "educationLevelName",
      headerName: "Education Level Name",
      flex: 2,
    },
    {
      field: "description",
      headerName: "Education Level Description",
      flex: 1,
    },
  
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {canDelete && (
            <Tooltip title="Delete Education Level">
              <IconButton
                onClick={() => {
                  setEducationLevelToDelete(params.row.id);
                  setDeleteDialogOpen(true);
                }}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          {canEdit && (
            <Tooltip title="Edit Education Level">
              <IconButton
                onClick={() => handleEditEducationLevel(params.row.id)}
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
        subtitle="Managing the educational level list"
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
          Are you sure you want to delete this Education Level?
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

export default ListEducationLevel;
