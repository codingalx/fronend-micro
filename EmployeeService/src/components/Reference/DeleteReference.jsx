import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Typography, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { deleteReference } from "../../Api/employeeApi";
import NotFoundHandle from "../common/NotFoundHandle";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const DeleteReference = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { employerId  } = location.state || {}
  const referenceId =location?.state?.id || {}
  const [authState] = useAtom(authAtom); // Access the shared authentication state
  const tenantId = authState.tenantId

  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteReference( tenantId,employerId, referenceId);
      const id =employerId ;
      navigate('/employee/editDetails', { state: { id, isEditable: true,activeTab: 5 } }); //
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancel = () => {
    const id =employerId ;
    navigate('/employee/editDetails', { state: { id, isEditable: true,activeTab: 5 } }); //
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  if (!(referenceId && employerId)) {
    return <NotFoundHandle message="No employee Reference  selected for deletion" navigateTo="/employee/list" />;
  }

  return (
    <Box sx={{ padding: 4, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Confirm Reference Deletion
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Are you sure you want to delete the Reference with ID: <strong>{referenceId}</strong>?
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
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete the Reference with ID: {referenceId}? This action cannot be undone.
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

      {/* Error Snackbar */}
      {error && (
        <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default DeleteReference;
