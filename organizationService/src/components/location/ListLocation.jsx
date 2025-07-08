import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { locationsEndpoint, locationsTypeEndpoint } from "../../../configuration/organizationApi";
import Header from "../common/Header";
import { canAccessResource } from "../../../configuration/SecurityService";
import OrganizationServiceResourceName from "../../../configuration/OrganizationServiceResourceName";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const ListLocation = ({refreshKey}) => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;
  const userRoles = authState.roles;

  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [departmentTypes, setDepartmentTypes] = useState([]);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Permissions
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canDetail, setCanDetail] = useState(false);



  const fetchPermissions = async () => {
    const editAccess = await canAccessResource(
      OrganizationServiceResourceName.UPDATE_LOCATION,
      userRoles
    );
    const deleteAccess = await canAccessResource(
      OrganizationServiceResourceName.DELETE_LOCATION,
      userRoles
    );
    const detailAccess = await canAccessResource(
      OrganizationServiceResourceName.GET_LOCATION_BY_ID,
      userRoles
    );
    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
    setCanDetail(detailAccess);

  };

  const displayTenants = async () => {
    const { url, headers } = locationsEndpoint(authState.accessToken);
    try {
      const response = await axios.get(`${url}/${tenantId}/get-all`, { headers });
     if (Array.isArray(response.data)) {
       
         setTenants(response.data);

      } else {
        setTenants([]);
        console.error("Expected an array but got:", response.data);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchDepartmentTypes = async () => {
    const { url, headers } = locationsTypeEndpoint(authState.accessToken);
    try {
      const response = await axios.get(`${url}/${tenantId}/get-all`, { headers });
      setDepartmentTypes(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteLocation = async () => {
    try {
      const { url, headers } = locationsEndpoint(authState.accessToken);
      await axios.delete(`${url}/${tenantId}/delete-location/${locationToDelete}`, { headers });
      setReloadTrigger((prev) => prev + 1);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete location:", error);
    }
  };

  useEffect(() => {
    displayTenants();
    fetchDepartmentTypes();
    fetchPermissions();
  }, [reloadTrigger,refreshKey]);

  const columns = [
    { field: "locationName", headerName: "Location Name", flex: 2 },
    { field: "departmentTypes", headerName: "Location Type", flex: 1 },
    canDelete && {
      field: "delete",
      headerName: "Delete",
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            setLocationToDelete(params.row.id);
            setDeleteDialogOpen(true);
          }}
          color="inherit"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
    canEdit && {
      field: "editAction",
      headerName: "Edit",
      renderCell: (params) => (
        <IconButton
          onClick={() => navigate("/edit_location", { state: { id: params.row.id } })}
          color="inherit"
        >
          <EditIcon />
        </IconButton>
      ),
    }, 
    canDetail &&
    {
     
      field: "detailsAction",
      headerName: "Details",
      renderCell: (params) => (
        <IconButton
          onClick={() => navigate("/details_location", { state: { id: params.row.id } })}
          color="inherit"
        >
          <ReadMoreIcon />
        </IconButton>
      ),
    },
  ].filter(Boolean); // Remove undefined columns when permissions are false

  return (
    <Box m="20px">
      <Header  subtitle="Managing the location list" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": { borderBottom: "none" },
        }}
      >
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <DataGrid
            rows={tenants.map((tenant) => ({
              ...tenant,
              id: tenant.id,
              departmentTypes: departmentTypes.find(
                (type) => type.id === tenant.locationTypeId
              )?.locationTypeName,
            }))}
            columns={columns}
          />
        )}
      </Box>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this location?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteLocation} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListLocation;
