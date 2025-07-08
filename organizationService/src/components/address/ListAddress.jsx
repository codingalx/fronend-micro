import { Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

import {  
  addressEndpoint,
  locationsEndpoint,
  departmentEndpoint, } from "../../../configuration/organizationApi";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import Header from "../common/Header";
import OrganizationServiceResourceName from '../../../configuration/OrganizationServiceResourceName'
import {canAccessResource } from '../../../configuration/SecurityService'
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';



const ListAddress = ({refreshKey}) => {
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0); 
  const handleDeleteRole = async () => {
    console.log("Deleting address:", addressToDelete); 
    try {
      const { url, headers } = addressEndpoint(authState.accessToken);
      await axios.delete(`${url}/${tenantId}/remove-address/${addressToDelete}`, {
        headers,
      });

      console.log("address deleted successfully:", addressToDelete);
      setReloadTrigger((prev) => prev + 1); // Trigger reload after successful delete
      setDeleteDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error("Failed to delete address", error);
    }
  };

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canDetail, setCanDetail] = useState(false);
  const userRoles = authState.roles;

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(OrganizationServiceResourceName.UPDATE_ADDRESS, userRoles);
    const deleteAccess = await canAccessResource(OrganizationServiceResourceName.DELETE_ADDRESS, userRoles);
    const canDetail = await canAccessResource(OrganizationServiceResourceName.GET_ADDRESSES_BY_ID, userRoles);

    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
    setCanDetail(canDetail);
  };

  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [addressTypes, setAddressTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);

  const displayTenants = async () => {
    const { url, headers } = addressEndpoint(authState.accessToken);
    try {
      const response = await axios.get(`${url}/${tenantId}/get-all`, {
        headers,
      });
      setTenants(response.data);
      console.log("address", response.data);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  const fetchLocations = async () => {
    const { url, headers } = locationsEndpoint(authState.accessToken);
    try {
      const response = await axios.get(`${url}/${tenantId}/get-all`, {
        headers,
      });
      setAddressTypes(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchDepartments = async () => {
    const { url, headers } = departmentEndpoint(authState.accessToken);
    try {
      const response = await axios.get(`${url}/${tenantId}/get-all`, {
        headers,
      });
      setDepartments(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    displayTenants();
    fetchLocations();
    fetchDepartments();
    checkPermissions();
  }, [reloadTrigger,refreshKey]);

  const columns = [
    { field: "departments", headerName: "Department Name", flex: 1 },
    { field: "addressTypes", headerName: "Address Name", flex: 1 },
    { field: "blockNo", headerName: "Block Number", flex: 1 },
    { field: "floor", headerName: "Floor Number", flex: 1 },
    { field: "officeNumber", headerName: "Office Number", flex: 1 },
    { field: "mobileNumber", headerName: "Mobile Number", flex: 1 },
    { field: "email", headerName: "Email Address", flex: 1.5 },
    { field: "website", headerName: "Website Address", flex: 1.5 },
    {
      field: "delete",
      headerName: "Delete",
      renderCell: (params) => (
        canDelete && (
          <IconButton
            onClick={() => {
              console.log("Delete button clicked for:", params.row.id);
              setAddressToDelete(params.row.id); // Set the role to delete
              setDeleteDialogOpen(true); // Open the delete dialog
            }}
            color="inherit"
          >
            <DeleteIcon />
          </IconButton>
        )
      ),
    },
    {
      field: "editAction",
      headerName: "Edit",
      flex: 1,
      renderCell: (params) => (
        canEdit && (
          <IconButton
            onClick={() => {
              const addressId = params.row.id;
              if (!addressId) {
                return;
              }
              navigate("/edit_address", { state: { id: addressId } });
            }}
            color="inherit"
          >
            <EditIcon />
          </IconButton>
        )
      ),
    },
    {
      field: "detailsAction",
      headerName: "Details",
      flex: 1,
      renderCell: (params) => (
        canDetail && (
          <IconButton
            onClick={() => {
              const addressId = params.row.id;
              if (!addressId) {
                return;
              }
              navigate("/details_address", { state: { id: addressId } });
            }}
            color="inherit"
          >
            <ReadMoreIcon />
          </IconButton>
        )
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header  subtitle="Managing the address list" />
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
              addressTypes: addressTypes.find(
                (type) => type.id === tenant.locationId
              )?.locationName,
              departments: departments.find(
                (type) => type.id === tenant.departmentId
              )?.departmentName,
            }))}
            columns={columns}
          />
        )}
      </Box>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this address?
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

export default ListAddress;
