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
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { deletePromotionCandidate } from "../../Api/ApiPromo";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import NotPageHandle from "../common/NotPageHandle";

const DeletePromotionCandidate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authState] = useAtom(authAtom);
  const tenantId = authState?.tenantId;
  const {id,name} = location.state || {};

  const [isDeleting, setIsDeleting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  if (!id) {
    return (
      <NotPageHandle
        message="No candidate selected for deletion."
        navigateTo="/promotion/createPromotionCandidate"
      />
    );
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePromotionCandidate(tenantId, id);
      setNotification({
        open: true,
        message: "Candidate deleted successfully!",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/promotion/createPromotionCandidate");
      }, 1500);
    } catch (error) {
      console.error("Error deleting candidate:", error);
      let errorMessage = "Error deleting candidate!";
      if (error.response && error.response.status === 500) {
        errorMessage = "Cannot delete candidate because it's already in use.";
      } else {
        errorMessage = "Server error occurred while deleting candidate.";
      }
      setNotification({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setIsDeleting(false);
      setOpenDialog(false);
    }
  };

  const handleCancel = () => {
    navigate("/promotion/createPromotionCandidate");
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleCloseSnackbar = () =>
    setNotification((prev) => ({ ...prev, open: false }));

  return (
    <Box sx={{ padding: 4, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Confirm Candidate Deletion
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
             Are you sure you want to delete this candidate: <strong>{name}</strong>?
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
                     Are you sure you want to permanently delete  candidate with a name: {name}? This action cannot be undone.
                   </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting && <CircularProgress size={20} />}
          >
            {isDeleting ? "Deleting..." : "Confirm Delete"}
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
        <Alert
          onClose={handleCloseSnackbar}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DeletePromotionCandidate;
