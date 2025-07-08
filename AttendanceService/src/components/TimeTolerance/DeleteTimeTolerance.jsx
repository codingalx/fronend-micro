import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import { deleteTimeTolerance } from "../../Api/Attendance-Api";
import NotPageHandle from "../common/NoPageHandel";

const DeleteTimeTolerance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toleranceId, name,shiftId } = location.state || {};
  
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const [openDialog, setOpenDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteTimeTolerance(toleranceId);
      setNotification({
        open: true,
        message: "Time tolerance deleted successfully!",
        severity: "success"
      });
      setOpenDialog(false);
        navigate("/attendance/set_up", { state: { activeTab: 3 } }); 
      
    } catch (error) {
      let errorMessage = "Error deleting time tolerance!";
      
      if (error.response) {
        errorMessage = error.response.data?.message || 
          (error.response.status === 500 
            ? "Cannot delete tolerance because it's already in use." 
            : "Server error occurred while deleting tolerance.");
      }
      
      setNotification({
        open: true,
        message: errorMessage,
        severity: "error"
      });
    }
  };

  const handleCancel = () => {
      navigate("/attendance/set_up", { state: { activeTab: 3 } }); 
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

   if (!toleranceId)
    {
  return (
    <NotPageHandle
      message="No Tolerance selected to Delete  ."
       navigateTo="/attendance/set_up" state={{ activeTab: 3 }} />

  );
}

  return (
    <Box sx={{ padding: 4, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Confirm Time Tolerance Deletion
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Are you sure you want to delete the time tolerance for shift: <strong>{name}</strong>?
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
            Are you sure you want to permanently delete the time tolerance for shift: <strong>{name}</strong>? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            autoFocus
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DeleteTimeTolerance;