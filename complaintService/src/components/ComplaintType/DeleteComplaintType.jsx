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
import { deleteComplaintType } from "../../Api/ComplaintTypeApi";
import NotPageHandle from "../../common/NoPageHandle";

const DeleteComplaintType = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { complaintTypeId } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });

  if (!complaintTypeId) {
    return (
      <NotPageHandle
        message="No Complaint Type selected to delete"
        navigateTo="/complaint/create-complaint-type"
      />
    );
  }

  const handleDelete = async () => {
    setLoading(true);
    try {
      const tenantId = localStorage.getItem("tenantId"); // Assuming tenantId is stored in localStorage
      await deleteComplaintType(tenantId, complaintTypeId);
      setNotification({
        open: true,
        message: "Complaint type deleted successfully!",
        severity: "success",
      });
      setTimeout(() => navigate("/complaint/create-complaint-type"), 20); // Redirect after success
    } catch (error) {
      console.error("Error deleting complaint type:", error);
      setNotification({
        open: true,
        message: "Failed to delete complaint type. Please try again.",
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
    navigate("/complaint/create-complaint-type"); // Redirect back to the list
  };

  return (
    <>
      <Dialog open={true} onClose={handleCancel}>
        <DialogTitle>Delete Complaint Type</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this complaint type? This action
            cannot be undone.
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

export default DeleteComplaintType;
