import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Snackbar,
  Alert,
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { deleteWeekend } from "../../Api/Attendance-Api";

const DeleteWeekend = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { weekendId, shiftId } = location.state || {};

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCloseSnackbar = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleConfirmDelete = async () => {
    if (isDeleting || !weekendId) return;
    setIsDeleting(true);
    try {
      await deleteWeekend(weekendId);
      setNotification({
        open: true,
        message: "Weekend deleted successfully!",
        severity: "success",
      });
      setTimeout(() => {
            navigate('/attendance/set_up', { state: { activeTab: 1 } }); 

      }, 1000);
    } catch (error) {
      console.error("Error deleting weekend:", error);
      setNotification({
        open: true,
        message: "Error deleting weekend!",
        severity: "error",
      });
    } finally {
      setIsDeleting(false);
      setDialogOpen(false);
    }
  };

  const handleCancel = () => {
        navigate('/attendance/set_up', { state: { activeTab: 1 } }); 

  };

  // 👉 Render fallback UI if no weekendId
  if (!weekendId) {
    return (
      <Box sx={{ padding: 4, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          No Weekend Selected
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 3 }}>
          Please select a weekend to delete.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Confirm Weekend Deletion
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Are you sure you want to delete this weekend? This action cannot be undone.
      </Typography>
      <Button
        variant="contained"
        color="error"
        onClick={() => setDialogOpen(true)}
        sx={{ marginRight: 2, minWidth: 120 }}
      >
        Delete
      </Button>
      <Button variant="outlined" onClick={handleCancel} sx={{ minWidth: 120 }}>
        Cancel
      </Button>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete this weekend? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogActions>
      </Dialog>

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

export default DeleteWeekend;
