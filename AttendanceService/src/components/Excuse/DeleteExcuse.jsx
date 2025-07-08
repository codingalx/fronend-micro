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
import { deleteExcuse } from "../../Api/Attendance-Api";

const DeleteExcuse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { ExcuseId ,name} = location.state || {};
  
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const [openDialog, setOpenDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteExcuse(ExcuseId);
      setNotification({
        open: true,
        message: "Excuse deleted successfully!",
        severity: "success"
      });
      setOpenDialog(false);
        navigate('/attendance/set_up', { state: { activeTab: 4 } }); 
    } catch (error) {
      let errorMessage = "Error deleting excuse!";
      
      if (error.response) {
        errorMessage = error.response.data?.message || 
          (error.response.status === 500 
            ? "Cannot delete Excuse because it's already in use." 
            : "Server error occurred while deleting excuse.");
      }
      
      setNotification({
        open: true,
        message: errorMessage,
        severity: "error"
      });
    }
  };

  const handleCancel = () => {
      navigate('/attendance/set_up', { state: { activeTab: 4 } }); 
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

  if (!ExcuseId) {
    return (
      <Box sx={{ padding: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          No excuse selected for deletion
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate("/create-excuse")}
          sx={{ mt: 2 }}
        >
          Back to Excuses
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Confirm Excuse Deletion
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Are you sure you want to delete excuse with a name: <strong>{name}</strong>?
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
            Are you sure you want to permanently delete excuse with a name: <strong>{name}</strong>? 
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

export default DeleteExcuse;