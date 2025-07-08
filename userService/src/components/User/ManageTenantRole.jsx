import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  useMediaQuery,
  Button,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

import {
  getAllRolesEndpoint,
  addRoleEndpoint,
  updateRoleEndpoint,
  deleteRoleEndpoint,
  getRoleUsersEndpoint,
  getAllUsersEndpoint,
  unassignUserRoleEndpoint,
  assignUserRoleEndpoint,
} from "../../../configuration/authApi";
import SearchIcon from "@mui/icons-material/Search"; // For search icon
import AddIcon from "@mui/icons-material/Add"; // For the "+" icon
import EditIcon from "@mui/icons-material/Edit"; // For the edit icon
import DeleteIcon from "@mui/icons-material/Delete";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import AuthServiceResourceName from "../../../configuration/AuthServiceResourceName";
import { canAccessResource } from "../../../configuration/SecurityService";
import { useNavigate } from "react-router-dom";
import AddCircleIcon from '@mui/icons-material/AddCircle';



const ManageTenantRole = () => {
  const [canAdd, setCanAdd] = useState(false);
  const [canAssignOrUnassign, setCanAssignOrUnassign] = useState(false);

    const [authState] = useAtom(authAtom); 

  const tenantId = authState.tenantId; // Access tenantId from AuthContext
  const userRoles = authState.roles;
  const navigate = useNavigate()

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const editAccess = await canAccessResource(
          AuthServiceResourceName.UPDATE_ROLE,
          userRoles
        );
        const deleteAccess = await canAccessResource(
          AuthServiceResourceName.DELETE_ROLE,
          userRoles
        );
        const addAccess = await canAccessResource(
          AuthServiceResourceName.ADD_ROLE,
          userRoles
        );
        const assignAccess = await canAccessResource(
          AuthServiceResourceName.ASSIGN_ROLE_TO_USER,
          userRoles
        );

        setCanEdit(editAccess || false);
        setCanDelete(deleteAccess || false);
        setCanAdd(addAccess || false);
        setCanAssignOrUnassign(assignAccess || false);
      } catch (err) {
        console.error("Error checking permissions:", err.message);
        // Fallback to false if there's an error
        setCanEdit(false);
        setCanDelete(false);
        setCanAdd(false);
        setCanAssignOrUnassign(false);
      }
    };

    fetchPermissions();
  }, [userRoles]); // Re-run if user roles change

  const [tenants, setTenants] = useState([]);
 
  const [error, setError] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0); // State to trigger re-fetch
  const [filteredTenants, setFilteredTenants] = useState([]); // State to handle filtered tenants
  const [searchQuery, setSearchQuery] = useState(""); // State to hold the search query

  const [open, setOpen] = useState(false); // State to handle dialog open/close
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");

  const [editOpen, setEditOpen] = useState(false); // State to handle edit dialog open/close
  const [editRoleName, setEditRoleName] = useState(null); // To store the original roleName for the update request

  // For Assign or Remove Role
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [assignedList, setAssignedList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  // Fetch all tenants/resources initially
  const displayTenants = async () => {
    const { url, headers } = getAllRolesEndpoint(authState.accessToken);
    // Get the URL and headers
    try {
      const response = await axios.get(`${url}/${tenantId}/get-all`, {
        headers,
      });
      setTenants(response.data);
      setFilteredTenants(response.data); // Initially, display all tenants
      console.log(response.data);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  // Fetch assigned users by role
  const fetchAssignedList = async (roleName) => {
    try {
      const { url, headers } = getRoleUsersEndpoint(authState.accessToken);
      const response = await axios.get(
        `${url}/${tenantId}/get-users/role-name?roleName=${roleName}`,
        {
          headers,
        }
      );

      setAssignedList(response.data);
    } catch (error) {
      console.error("Error fetching assigned list:", error);
    }
  };

  // Fetch all users for dropdown
  const fetchUserList = async () => {
    try {
      const { url, headers } = getAllUsersEndpoint(authState.accessToken);
      const response = await axios.get(`${url}/${tenantId}/get-all`, {
        headers,
      });

      setUserList(response.data);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  // // Handle opening Assign or Remove role dialog
  // const handleAssignOrRemoveOpen = (roleName) => {
  //   setSelectedRoleName(roleName);
  //   setOpenAssignDialog(true);
  //   fetchAssignedList(roleName);
  //   fetchUserList();
  // };

  // Handle closing the dialog
  const handleAssignOrRemoveClose = () => {
    setOpenAssignDialog(false);
    setSelectedUser("");
  };
  // console.log("selectedUser", handleAssignOrRemoveClose);

  // Handle assigning role
  const handleAssignRole = async () => {
    try {
      const { url, headers } = assignUserRoleEndpoint(authState.accessToken);
      await axios.put(
        `${url}/${tenantId}/${selectedUser}/assign-role/${selectedRoleName}`,
        {},
        { headers }
      );

      setReloadTrigger(reloadTrigger + 1);
      fetchAssignedList(selectedRoleName); // Refresh the assigned list
      setOpenAssignDialog(false);
      // console.log("Assigned role:", selectedRoleName, "to user:", selectedUser);
    } catch (error) {
      console.error("Error assigning role:", error);
    }
  };

  // Handle unassigning role
  const handleUnassignRole = async (userId) => {
    try {
      const { url, headers } = unassignUserRoleEndpoint(authState.accessToken);
      await axios.delete(
        `${url}/${tenantId}/${userId}/unassign-role/${selectedRoleName}`,
        { headers }
      );

      setReloadTrigger(reloadTrigger + 1);
      fetchAssignedList(selectedRoleName); // Refresh the assigned list
      setOpenAssignDialog(false);
    } catch (error) {
      console.error("Error unassigning role:", error);
    }
  };

  useEffect(() => {
    displayTenants();
  }, [reloadTrigger]);

  // Handle search input change
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter tenants based on resource name
    const filtered = tenants.filter((tenant) =>
      tenant.roleName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTenants(filtered);
  };

  const handleCellClick = (params, event) => {
    if (params.field === "delete") {
      event.stopPropagation();
    }
  };

  // State for the dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  // Function to handle deletion
  const handleDeleteRole = async () => {
    console.log("Deleting role:", roleToDelete); // Debugging log
    try {
      const { url, headers } = deleteRoleEndpoint(authState.accessToken);
      await axios.delete(`${url}/${tenantId}/delete/${roleToDelete}`, {
        headers,
      });

      console.log("Role deleted successfully:", roleToDelete);
      setReloadTrigger((prev) => prev + 1); // Trigger reload after successful delete
      setDeleteDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error("Failed to delete role", error);
    }
  };

  
const handleResourseManagement = (roleName) => {
  navigate('/manage_resourse_assign', { state: {  roleName } });
};

  
 

  const columns = [
    { field: "roleName", headerName: "Role Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1.5 },
    // { field: "tenantName", headerName: "Users Assigned", flex: 1 },

    


    {
      field: "editRole",
      headerName: "ResourseAssign",
      // flex: 1.5,
      renderCell: (params) =>
        canEdit && (
          <IconButton color="primary"   onClick={() => handleResourseManagement(params.row.roleName)}>
            <AddCircleIcon />
          </IconButton>
        ),
    },


    {
      field: "Rosourse",
      headerName: "Edit",
      // flex: 1.5,
      renderCell: (params) =>
        canEdit && (
          <IconButton color="primary" onClick={() => handleEditOpen(params.row)}>
            <EditIcon />
          </IconButton>
        ),
    },





    {
      field: "delete",
      headerName: "Delete",
      renderCell: (params) =>

        canDelete && (
          <IconButton
            onClick={() => {
              console.log("Delete button clicked for:", params.row.roleName);
              setRoleToDelete(params.row.roleName); // Set the role to delete
              setDeleteDialogOpen(true); // Open the delete dialog
            }}
            color="inherit"
          >
            <DeleteIcon />
          </IconButton>
        ),
    },

    // {
    //   field: "assignOrRemoveRole",
    //   headerName: "Assign or Remove",
    //   flex: 1,
    //   renderCell: (params) => (
    //     canAssignOrUnassign &&
    //     <Button
    //       variant="outlined"
    //       onClick={() => handleAssignOrRemoveOpen(params.row.roleName)}
    //     >
    //       Assign || Remove
    //     </Button>
    //   ),
    // },
  ];

  const isNonMobile = useMediaQuery("(min-width:600px)");

  // Handle dialog open/close
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle edit dialog open/close and store the original roleName as editRoleName
  const handleEditOpen = (role) => {
    setRoleName(role.roleName);
    setDescription(role.description);
    // setEditRoleId(role.id); // Save the role ID for editing
    setEditRoleName(role.roleName); // Save the original roleName for the update request
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  // Handle form submission
  const handleSubmit = async () => {
    const newRole = {
      roleName,
      description,
    };

    try {
      const { url, headers } = addRoleEndpoint(authState.accessToken);
      const response = await axios.post(`${url}/${tenantId}/add`, newRole, {
        headers,
      });

      console.log(response.data);
      setReloadTrigger(reloadTrigger + 1); // Trigger reload to fetch new data
      handleClose(); // Close dialog after submission
    } catch (error) {
      console.log("Error adding role:", error);
    }
  };

  // Handle edit form submission
  const handleEditSubmit = async () => {
    const updatedRole = {
      roleName,
      description,
    };

    try {
      const { url, headers } = updateRoleEndpoint(authState.accessToken);

      const response = await axios.put(
        `${url}/${tenantId}/update/${editRoleName}`,
        updatedRole,
        {
          headers,
        }
      );

      console.log(response.data);
      setReloadTrigger(reloadTrigger + 1); // Trigger reload to fetch updated data
      handleEditClose(); // Close dialog after editing
    } catch (error) {
      console.log("Error updating role:", error);
    }
  };

  return (
    <Box m="10px">
      <Box
  m="10px 0"
  display="flex"
  alignItems="center"
  justifyContent="space-between"
  gap="20px"
>
  {canAdd && (
    <Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      onClick={handleClickOpen}
    >
      Add Role
    </Button>
  )}

  <TextField
    fullWidth
    label="Search by Role Name"
    value={searchQuery}
    onChange={handleSearchChange}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
    }}
    sx={{ maxWidth: "400px", ml: "auto" }}
  />
</Box>



      {/* Popup Dialog for Adding New Role */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Role</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Role Name"
            fullWidth
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Role</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Role Name"
            fullWidth
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      {/*  the added Dialog for Deleting Role */}


      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the role "{roleToDelete}"?
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


      {/* Assign or Remove Dialog */}
      <Dialog open={openAssignDialog} onClose={handleAssignOrRemoveClose}>
        <DialogTitle>Role Assign and Remove</DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <strong>Role Name:</strong> {selectedRoleName}
          </Box>

          <Box mb={2}>
            <strong>Assigned List:</strong>
            <ul>
              {assignedList.length ? (
                assignedList.map((user) => (
                  <li key={user.id}>
                    {user.firstName} {user.lastName} - {user.username}
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleUnassignRole(user.id)}
                      style={{ marginLeft: "100px" }}
                    >
                      Unassign
                    </Button>
                  </li>
                ))
              ) : (
                <p>No users assigned to this role.</p>
              )}
            </ul>
          </Box>

          <Box mb={2}>
            <TextField
              select
              fullWidth
              label="User List"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              {userList.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAssignRole}
            disabled={assignedList.some((user) => user.id === selectedUser)}
            color="primary"
            variant="contained"
          >
            Assign Role
          </Button>
          <Button
            onClick={handleAssignOrRemoveClose}
            color="secondary"
            variant="outlined"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

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
          "& .MuiDataGrid-virtualScroller": {},
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
          },
        }}
      >
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <DataGrid
            onCellClick={handleCellClick}
            rows={filteredTenants.map((tenant) => ({
              ...tenant,
              id: tenant.id,
            }))}
            columns={columns}
          />
        )}
      </Box>
    </Box>
  );
};

export default ManageTenantRole;
