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
import { deleteComplaintHandling } from "../../Api/ComplaintHandlingApi";
import NotPageHandle from "../../common/NoPageHandle";

const DeleteComplaintHandling = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tenantId, handlingId } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });

  if (!tenantId || !handlingId) {
    return (
      <NotPageHandle
        message="No Complaint Handling selected to delete"
        navigateTo="/complaint/list-complaint-handlings-by-department"
      />
    );
  }

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteComplaintHandling(tenantId, handlingId);
      setNotification({
        open: true,
        message: "Complaint handling deleted successfully!",
        severity: "success",
      });
      setTimeout(() => navigate("/complaint/list-complaint-handlings-by-department"), 20);
    } catch (error) {
      console.error("Error deleting complaint handling:", error);
      setNotification({
        open: true,
        message: "Failed to delete complaint handling. Please try again.",
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
    navigate("/complaint/list-complaint-handlings-by-department");
  };

  return (
    <>
      <Dialog open={true} onClose={handleCancel}>
        <DialogTitle>Delete Complaint Handling</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this complaint handling? This action
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

export default DeleteComplaintHandling;
