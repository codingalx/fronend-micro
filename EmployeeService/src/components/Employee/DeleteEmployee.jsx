import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { deleteEmployee } from "../../Api/employeeApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; // Adjust the import based on your structure
import NotFoundHandle from "../common/NotFoundHandle";

const DeleteEmployee = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { employeeId, userId } = location.state || {};
  const [openDialog, setOpenDialog] = useState(false);
  
     const [authState] = useAtom(authAtom); // Access the shared authentication state
    const tenantId = authState.tenantId;


 

  const handleDelete = async () => {
    try {
      await deleteEmployee(tenantId,employeeId);
      navigate("/employee/list");
    } catch (error) {
      console.error("Error deleting employee:", error.message);
    }
  };

  const handleCancel = () => {
    navigate("/employee/list");
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (!employeeId) {
    return <NotFoundHandle message="No Employee selected for deletion." navigateTo="/employee/list" />;
  }

  return (
    <Box sx={{ padding: 4, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Confirm Employee Deletion
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Are you sure you want to delete employee with ID: <strong>{userId}</strong>?
      </Typography>
      <Button
        variant="contained"
        color="error"
        onClick={handleOpenDialog}
        sx={{ marginRight: 2, minWidth: 120 }}
      >
        Delete
      </Button>
      <Button
        variant="outlined"
        onClick={handleCancel}
        sx={{ minWidth: 120 }}
      >
        Cancel
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete employee with ID: {userId}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default DeleteEmployee;
