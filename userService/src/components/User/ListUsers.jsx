import {
  Box,
  IconButton,
  Modal,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,  InputAdornment,
  Tooltip,


} from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import AddIcon from "@mui/icons-material/Add"; // For the "+" icon
import SearchIcon from "@mui/icons-material/Search"; // For search icon
import EditIcon from "@mui/icons-material/Edit"; // For the edit icon
import {
  getAllUsersEndpoint,
  deleteUserEndpoint,
  updateEmailEndpoint,
  addUserEndpoint,
} from "../../../configuration/authApi";
import { canAccessResource } from "../../../configuration/SecurityService";
import AuthServiceResourceName from "../../../configuration/AuthServiceResourceName";
import { useNavigate } from "react-router-dom";
import { DisableUser, EnableUser } from "../../../configuration/authApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ListUsers = () => {
  const [authState] = useAtom(authAtom); 

  const userRoles = authState.roles;
   const tenantId = authState.tenantId
  const navigate = useNavigate();

  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0); // State to trigger re-fetch

  const [open, setOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
   const [canDeleteUser, setCanDeleteUser] = useState(false);
   const [canEnableDisableUser, setCanEnableDisableUser] = useState(false);
   const [canUpdateEmail, setCanUpdateEmail] = useState(false);
   const [canadduser, setCanAddUser] = useState(false);

   const handleEnableDisableUser = async (userId, isEnabled) => {
    try {
      const apiCall = isEnabled ? DisableUser : EnableUser;
      await apiCall(tenantId,userId);
      setReloadTrigger((prev) => prev + 1); 
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };


  const displayTenants = async () => {
    const { url, headers } = getAllUsersEndpoint(authState.accessToken); // Get the URL and headers
    try {
      const response = await axios.get(`${url}/${tenantId}/get-all`, {
        headers,
      }); // Use the headers in the request
      setTenants(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  useEffect(() => {
    displayTenants();
    checkPermissions();
  }, [reloadTrigger]);

  const checkPermissions = async () => {
    const deleteAccess = await canAccessResource(
      AuthServiceResourceName.DELETE_USER,
      userRoles
    );

    const enableDisableAccess = await canAccessResource(
      AuthServiceResourceName.UPDATE_USER,
      userRoles
    );
    const updateEmailAccess = await canAccessResource(
      AuthServiceResourceName.UPDATE_USER,
      userRoles
    );
    const canAccessAdduser = await canAccessResource(
      AuthServiceResourceName.ADD_USER,
      userRoles
    );

    setCanDeleteUser(deleteAccess);
    setCanEnableDisableUser(enableDisableAccess);
    setCanUpdateEmail(updateEmailAccess);
    setCanAddUser(canAccessAdduser);
  };



  const handleCellClick = (params, event) => {
    if (params.field === "delete") {
      event.stopPropagation();
    }
  };

  // State for the dialog
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [roleToDelete, setRoleToDelete] = useState(null);

  const [filteredTenants, setFilteredTenants] = useState([]); // State to handle filtered tenants
  const [searchQuery, setSearchQuery] = useState(""); // State to hold the search query

// Function to handle deletion
const handleDeleteRole = async () => {
  console.log("Deleting role:", roleToDelete); // Debugging log
  try {
    const { url, headers } = deleteUserEndpoint(authState.accessToken);
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
const handleListOfRole = (id,username) => {
  navigate('/updateUser_role', { state: {  id ,username} });
};

const handleResetUserPassWord = (id,username) => {
  navigate('/reset_password', { state: {  id ,username} });
};



  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter tenants based on resource name
    const filtered = tenants.filter((tenant) =>
      tenant.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTenants(filtered);
  };


  const columns = [
    { field: "username", headerName: "User Name", flex: 1.5 },
    { field: "firstName", headerName: "First Name", flex: 1.5 },
    { field: "lastName", headerName: "Middle Name", flex: 1.5 },
    { field: "email", headerName: "Email", flex: 3.5 },

    
    {
      field: "delete",
      headerName: "Delete",
      renderCell: (params) => 
        canDeleteUser && (
        <IconButton
          onClick={() => {
            console.log("Delete button clicked for:", params.row.id);
            setRoleToDelete(params.row.id); // Set the role to delete
            setDeleteDialogOpen(true); // Open the delete dialog
          }}
          color="inherit"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },

    {
      field: "editRole",
      headerName: "RoleAssign",
      // flex: 1.5,
      renderCell: (params) =>
         (
          <IconButton color="primary"   onClick={() => handleListOfRole(params.row.id,params.row.username)}>
            <EditIcon />
          </IconButton>
        ),
    },


    {
      field: "ResetUserPS",
      headerName: "Reset User PassWord",
      renderCell: (params) =>
         (
          <IconButton color="primary"   onClick={() => handleResetUserPassWord(params.row.username)}>
            <EditIcon />
          </IconButton>
        ),
    },

  

    {
      field: "updateEmail",
      headerName: "Update Email",
      flex: 1.5,
      renderCell: (params) => {
        const [open, setOpen] = useState(false); // Control modal open/close state
        const [email, setEmail] = useState(""); // Store email input value

        // Open the modal
        const handleOpen = () => setOpen(true);

        // Close the modal
        const handleClose = () => setOpen(false);

        // Handle email input change
        const handleEmailChange = (e) => {
          setEmail(e.target.value);
        };

        // Handle email update when clicking "Update Email"
        const handleUpdateEmail = async () => {
          try {
            const { url, headers } = updateEmailEndpoint(authState.accessToken);
            await axios.put(
              `${url}/${tenantId}/update-email/${params.row.id}?email=${email}`,
              {}, // Empty body for the PUT request
              {
                headers,
              }
            );

            console.log("Email updated successfully");
            handleClose(); // Close the modal after successful update
            setReloadTrigger((prev) => prev + 1); // Trigger reload after email update
          } catch (error) {
            console.error("Error updating email:", error);
          }
        };

        return (
          <>
            {/* Update Email Icon Button */}
            
            <IconButton onClick={handleOpen} color="inherit">
              <EmailIcon />
            </IconButton>

            {/* Modal for updating email */}
            <Modal open={open} onClose={handleClose}>
              <Box sx={modalStyle}>
                <h2>Update Email</h2>

                {/* Email Input Field */}
                <TextField
                  fullWidth
                  label="Email"
                  value={email}
                  onChange={handleEmailChange}
                  margin="normal"
                />

                {/* Buttons */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateEmail}
                  sx={{ mt: 2 }}
                >
                  Update Email
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleClose}
                  sx={{ mt: 2, ml: 2 }}
                >
                  Cancel
                </Button>
              </Box>
            </Modal>
          </>
        );
      },
    },

       // Enable/Disable User Column
       {
        field: "enableDisable",
        headerName: "Enable/Disable",
        renderCell: (params) => {
          const roles = params.row?.roles || [];
          const username = params.row?.username || ""; 
          const isAdmin = roles.includes("admin") || username.toLowerCase().includes("admin");
          const isEnabled = params.row?.isEnabled;
              // if (isAdmin) return null;
      
          return (
            <Tooltip title="Enable or Disable User">

            <Button
              variant="contained"
              color={isEnabled ? "secondary" : "success"}
              onClick={() => handleEnableDisableUser(params.row?.id, isEnabled)}
              disabled={isAdmin ? true : false}              
            >
           {isAdmin ? "Unchange" : (isEnabled ? "Disable" : "Enable")}

            </Button>
            </Tooltip>

          );
        },
      },

   
 
  ];

  const handleClickOpen = () => {
      navigate(`/adduser`)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    const newUser = {
      employeeId,
    };

    try {
      const { url, headers } = addUserEndpoint(authState.accessToken);
      const response = await axios.post(
        `${url}/${tenantId}/add?employeeId=${employeeId}`,
        newUser,
        { headers }
      );

      console.log(response.data);
      setReloadTrigger(reloadTrigger + 1); // Trigger reload to fetch new data
      handleClose(); // Close dialog after submission
    } catch (error) {
      console.log("Error adding role:", error);
      handleClose();
    }
  };

  return (
    <Box m="20px">
      <Box
        m="10px 0 0 0"
        height="75vh"
        display="grid"
        gap="30px"
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
       


        <Box
  m="10px 0"
  display="flex"
  alignItems="center"
  justifyContent="space-between"
  gap="20px"
>
  {canadduser && (
    <Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      onClick={handleClickOpen}
    >
      Add User
    </Button>
  )}

  <TextField
    fullWidth
    label="Search by User Name"
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
       

        {error ? (
          <p>Error: {error}</p>
        ) : (
          <DataGrid
          onCellClick={handleCellClick}
          rows={(searchQuery ? filteredTenants : tenants).map((tenant) => ({
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
    Are you sure you want to delete the this user ?
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

      {/* Popup Dialog for Adding New Role */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Employee ID"
            fullWidth
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
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

    </Box>
  );
};

export default ListUsers;
