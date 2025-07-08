import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Typography, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { deleteAnnualTrainingPlan } from "../../../configuration/TrainingApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';

const DeleteAnnualTrainingPlan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {planId } = location.state || {};
    const [authState] = useAtom(authAtom);
    const tenantId = authState.tenantId
  

  const [openDialog, setOpenDialog] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const handleDelete = async () => {
    try {
      await deleteAnnualTrainingPlan(tenantId,planId);
      setNotification({ open: true, message: "annual training plan deleted successfully!", severity: "success" });
      navigate('/training/annualPlan');
    } catch (error) {
      setNotification({ open: true, message: "Failed to delete annual training delete. Please try again.", severity: "error" });
      console.error("Error deleting employee:", error.message);
    }
  };

  const handleCancel = () => {
    navigate('/training/annualPlan');
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
        Confirm Annual training plan  Deletion
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Are you sure you want to delete annual training deletion with ID: <strong>{planId}</strong>?
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
            Are you sure you want to permanently delete annula training paln with ID: {planId}? This action cannot be undone.
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

export default DeleteAnnualTrainingPlan;
