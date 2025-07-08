import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Typography,  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { deleteDocumentChecked } from "../../../configuration/TrainingApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';

const DeleteTraineeDocument = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const {  id,documentName } = location.state || {};
      const [authState] = useAtom(authAtom);
        const tenantId = authState.tenantId

  const [openDialog, setOpenDialog] = useState(false);

 

  const handleDelete = async () => {
    try {
      await deleteDocumentChecked(tenantId,id);
      navigate("/training/createdocument");
    } catch (error) {
      console.error("Error deleting document:", error.message);
    }
  };

  const handleCancel = () => {
    navigate("/training/createdocument");
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Confirm Trainee document Deletion
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Are you sure you want to delete documentnae : <strong>{documentName}</strong>?
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
            Are you sure you want to permanently delete document with {documentName}? This action cannot be undone.
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

    </Box>
  );
};

export default DeleteTraineeDocument;
