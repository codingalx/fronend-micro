import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Typography, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { deleteItem } from "../../Api/ItemServiceApi"; 
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

const DeleteItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemId, name } = location.state || {};  

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
      await deleteItem(tenantId, itemId);

      setNotification({
        open: true,
        message: 'Item deleted successfully!',
        severity: 'success',
      });

      setTimeout(() => {
        navigate('/item/create-item');
      }, 2000); 
    } catch (error) {
      let errorMessage = "Error deleting item!";

      if (error.response && error.response.status === 500) {
        errorMessage = "Cannot delete Item because it's already in use.";
      } else {
        errorMessage = "Server error occurred while deleting Item.";
      }

      setError(errorMessage);
    }
  };

  const handleCancel = () => {
    navigate("/item/create-item");
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };
  if (!itemId) {
    return <NotPageHandle message="No Item ID provided"  navigateTo="/item/create-item"/>;
  }


  return (
    <Box sx={{ padding: 4, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Confirm Item Deletion
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Are you sure you want to delete the item with name: <strong>{name}</strong>?
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
            Are you sure you want to permanently delete the item with name: {name}? This action cannot be undone.
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

export default DeleteItem;
