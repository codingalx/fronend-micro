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
  CircularProgress,
} from "@mui/material";
import { deletePromotionCriteria } from "../../Api/ApiPromo";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import NotPageHandle from "../common/NotPageHandle";

const DeletePromotionCriteria = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom);
  const tenantId = authState?.tenantId;

  const {promotionCriteriaId,name} = location.state || {};

  const [isDeleting, setIsDeleting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  if (!promotionCriteriaId) {
    return (
      <NotPageHandle
        message="No criteria selected for deletion."
        navigateTo="/promotion/CreatePromotionCriteria"
      />
    );
  }

  const handleConfirmDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      await deletePromotionCriteria(tenantId, promotionCriteriaId);
      setNotification({
        open: true,
        message: "Criteria deleted successfully!",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/promotion/createPromotionCriteria");
      }, 1500);
    } catch (error) {
      console.error("Error deleting criteria:", error);
      setNotification({
        open: true,
        message:
          error?.response?.status === 500
            ? "Cannot delete criteria because it's in use."
            : "Server error occurred while deleting criteria.",
        severity: "error",
      });
    } finally {
      setIsDeleting(false);
      setOpenDialog(false);
    }
  };

  const handleCancel = () => {
    navigate("/promotion/CreatePromotionCriteria");
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleCloseSnackbar = () =>
    setNotification((prev) => ({ ...prev, open: false }));

  return (
    <Box sx={{ padding: 4, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Confirm Criteria Deletion
      </Typography>
     <Typography variant="body1" sx={{ marginBottom: 3 }}>
            Are you sure you want to delete the promotion with name: <strong>{name}</strong>?
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
                   Are you sure you want to permanently delete the promotion with name: {name}? This action cannot be undone.
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
        <Alert onClose={handleCloseSnackbar} severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DeletePromotionCriteria;
