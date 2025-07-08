import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import { deleteAttachment } from "../../Api/AttachmentsApi";
import NotPageHandle from "../../common/NoPageHandle";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";

const DeleteAttachment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    tenantId: navTenantId,
    attachmentId,
    fileName,
    complaintId, // <-- get complaintId from state
  } = location.state || {};
  const [authState] = useAtom(authAtom);
  const tenantId = navTenantId || authState.tenantId;
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });

  if (!tenantId || !attachmentId || !complaintId) {
    return (
      <NotPageHandle
        message="No Attachment selected to delete"
        navigateTo="/complaint/create-complaint"
      />
    );
  }

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteAttachment(tenantId, attachmentId);
      setNotification({
        open: true,
        message: "Attachment deleted successfully!",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/complaint/create-complaint", {
          state: { tenantId, complaintId },
          replace: true,
        });
      }, 20);
    } catch (error) {
      console.error("Error deleting attachment:", error);
      setNotification({
        open: true,
        message: "Failed to delete attachment. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/complaint/attachments-list", {
      state: { tenantId, complaintId },
      replace: true,
    });
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <>
      <Dialog open={true} onClose={handleCancel}>
        <DialogTitle>Delete Attachment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete
            {fileName ? ` the attachment "${fileName}"` : " this attachment"}?
            This action cannot be undone.
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

export default DeleteAttachment;
