import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Typography, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import NotFoundHandle from "../common/NotFoundHandle";
import { deleteAllFamilyDetails } from "../../../Api/payrollApi";




const DeleteFamilyDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
 

  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteAllFamilyDetails(id);
         navigate('/payroll/create_family_detail'); 
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancel = () => {
       navigate('/payroll/create_family_detail'); 
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };
    if (!id) {
      return <NotFoundHandle message="No family details  selected for deletion."
       navigateTo="/payroll/create_family_detail" />;
    }

  return (
    <Box sx={{ padding: 4, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Confirm  court case deletion
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Are you sure you want to delete the these family details 
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
            Are you sure you want to permanently delete family detail selected This action cannot be undone.
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

export default DeleteFamilyDetail;