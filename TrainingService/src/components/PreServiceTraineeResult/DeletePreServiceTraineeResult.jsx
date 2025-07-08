import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Typography,  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import { deletePreServiceTraineeResult } from "../../../configuration/TrainingApi";



const DeletePreServiceTraineeResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {  traineeId,courseId } = location.state || {};
      const [authState] = useAtom(authAtom);
      const tenantId = authState.tenantId;

  const [openDialog, setOpenDialog] = useState(false);

 

  const handleDelete = async () => {
    try {
      await deletePreServiceTraineeResult(tenantId,traineeId);
      navigate('/training/listPreCourseTraineeResult', { state: { courseId} });

    } catch (error) {
      console.error("Error deleting course category:", error.message);
    }
  };

  const handleCancel = () => {
    navigate('/training/listPreCourseTraineeResult', { state: { courseId} });
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
        Confirm pre service trainee result Deletion
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Are you sure you want to pre service trainee result Deletion with course Type: <strong>{traineeId}</strong>?
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
            Are you sure you want to permanently pre service trainee result Deletione with {traineeId}? This action cannot be undone.
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

export default DeletePreServiceTraineeResult;
