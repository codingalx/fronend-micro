import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Typography, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { deleteEducationOpportunity } from "../../../configuration/TrainingApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';


const DeleteEducationOpportunity = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {educationOpportunityId } = location.state || {};
     const [authState] = useAtom(authAtom);
        const tenantId = authState.tenantId

  const [openDialog, setOpenDialog] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const handleDelete = async () => {
    try {
      await deleteEducationOpportunity(tenantId,educationOpportunityId);
      setNotification({ open: true, message: "Education Opportunity deleted successfully!", severity: "success" });
      navigate('/training/educationOpportunity');
    } catch (error) {
      setNotification({ open: true, message: "Failed to delete employee. Please try again.", severity: "error" });
      console.error("Error deleting employee:", error.message);
    }
  };

  const handleCancel = () => {
    navigate('/training/educationOpportunity');
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Confirm Education Opportunity Deletion
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Are you sure you want to delete Education Opportunity with ID: <strong>{educationOpportunityId}</strong>?
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
            Are you sure you want to permanently delete Education Opportunity with ID: {educationOpportunityId}? This action cannot be undone.
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

      {/* Snackbar for Notifications */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Positioned at top-right
      >
        <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DeleteEducationOpportunity;
