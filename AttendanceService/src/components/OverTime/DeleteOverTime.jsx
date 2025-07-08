import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  DialogTitle,
} from "@mui/material";
import { deleteOverTime } from "../../Api/Attendance-Api";
import NoPageHandle from "../common/NoPageHandel";

const DeleteOverTime = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { overTimeId, name } = location.state || {};

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [open, setOpen] = useState(false);

  const handleCloseSnackbar = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleDelete = async () => {
    try {
      await deleteOverTime(overTimeId);
      setNotification({
        open: true,
        message: "Overtime deleted successfully!",
        severity: "success",
      });
      setTimeout(() => {
        navigate('/attendance/set_up', { state: { activeTab: 2 } }); 
      }, 1000);
    } catch (error) {
      console.error("Error deleting overtime:", error);
      setNotification({
        open: true,
        message: "Error deleting overtime!",
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate('/attendance/set_up', { state: { activeTab: 2 } }); 

  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  if (!overTimeId) {
    return <NoPageHandle message="No overtime selected for deletion."navigateTo="/attendance/set_up" state={{ activeTab: 2 }}  />;
  }

  return (
    <Box sx={{ padding: 4, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Confirm Overtime Deletion
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Are you sure you want to delete the overtime{name ? `: ` + name : ""}? This action cannot be undone.
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
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete this overtime{name ? `: ` + name : ""}? This action cannot be undone.
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

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DeleteOverTime;
