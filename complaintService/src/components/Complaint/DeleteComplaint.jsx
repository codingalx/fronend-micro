import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import { deleteComplaint } from "../../Api/ComplaintApi";
import NotPageHandle from "../../common/NoPageHandle";

const DeleteComplaint = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tenantId, complaintId } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });

  if (!tenantId || !complaintId) {
    return (
      <NotPageHandle
        message="No Complaint selected to delete"
        navigateTo="/complaint/create-complaint"
      />
    );
  }

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteComplaint(tenantId, complaintId);
      setNotification({
        open: true,
        message: "Complaint deleted successfully!",
        severity: "success",
      });
      setTimeout(() => navigate("/complaint/create-complaint"), 20); // Redirect after success
    } catch (error) {
      console.error("Error deleting complaint:", error);
      setNotification({
        open: true,
        message: "Failed to delete complaint. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const handleCancel = () => {
    navigate("/complaint/create-complaint"); // Redirect back to the list
  };

  return (
    <>
      <Dialog open={true} onClose={handleCancel}>
        <DialogTitle>Delete Complaint</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this complaint? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
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
    </>
  );
};

export default DeleteComplaint;
