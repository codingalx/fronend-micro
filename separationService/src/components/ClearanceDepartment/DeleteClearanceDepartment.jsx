import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import { deleteClearanceDepartment } from "../../Api/separationApi";
import NotPageHandle from "../../common/NoPageHandle";

const DeleteClearanceDepartment = () => {
  const location = useLocation();
  const clearanceDepartmentId = location.state?.clearanceDepartmentId;
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  const [open, setOpen] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    navigate(-1);
  };

  const handleDelete = async () => {
    try {
      const response = await deleteClearanceDepartment(tenantId, clearanceDepartmentId);
      if (response.status === 200) {
        setNotification({
          open: true,
          message: "Clearance department deleted successfully!",
          severity: "success",
        });
        handleClose();
      } else {
        setNotification({
          open: true,
          message: "Error deleting clearance department.",
          severity: "error",
        });
      }
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      
      if (error.response && error.response.status === 500) {
        errorMessage = "Cannot delete department. It is already in use.";
      }
      
      setNotification({
        open: true,
        message: errorMessage,
        severity: "error",
      });
      console.error("Error deleting clearance department:", error);
    }
  };

  if (!clearanceDepartmentId) {
    return <NotPageHandle message="No Clearance Department is selected to Delete " navigateTo="/separation/create-clearance-department" />;
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this clearance department? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DeleteClearanceDepartment;