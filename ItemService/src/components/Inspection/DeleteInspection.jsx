import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Typography, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { deleteInspection } from "../../Api/ItemServiceApi"; 
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

const DeleteInspection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { inspectionId, name } = location.state || {}; 

  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteInspection(tenantId, inspectionId);

      setNotification({
        open: true,
        message: 'Inspection deleted successfully!',
        severity: 'success',
      });

      setTimeout(() => {
        navigate('/item/create-inspection'); 
      }, 2000); 
    } catch (error) {
      let errorMessage = "Error deleting inspection!";

      if (error.response && error.response.status === 500) {
        errorMessage = "Cannot delete Inspection because it's already in use.";
      } else {
        errorMessage = "Server error occurred while deleting Inspection.";
      }

      setError(errorMessage);
    }
  };

  const handleCancel = () => {
    navigate("/item/create-inspection"); 
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };
    if (!inspectionId) {
      return <NotPageHandle message="No Inspection ID provided"  navigateTo="/item/create-inspection"/>;
    }
  

  return (
    <Box sx={{ padding: 4, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Confirm Inspection Deletion
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Are you sure you want to delete the inspection with name: <strong>{name}</strong>?
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

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete the inspection with name: {name}? This action cannot be undone.
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

export default DeleteInspection;