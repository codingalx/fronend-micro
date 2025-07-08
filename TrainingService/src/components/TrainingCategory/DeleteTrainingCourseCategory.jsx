import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Typography,  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { deleteTrainingCourseCategory } from "../../../configuration/TrainingApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';

const DeleteTrainingCourseCategory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {  id,categoryName } = location.state || {};
  const [openDialog, setOpenDialog] = useState(false);
    const [authState] = useAtom(authAtom);
    const tenantId = authState.tenantId

 

  const handleDelete = async () => {
    try {
      await deleteTrainingCourseCategory(tenantId,id);
      navigate("/training/coursecategory");
    } catch (error) {
      console.error("Error deleting course category:", error.message);
    }
  };

  const handleCancel = () => {
    navigate("/training/coursecategory");
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
        Confirm Course Category Deletion
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Are you sure you want to delete Course Category with Category Name: <strong>{categoryName}</strong>?
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
            Are you sure you want to permanently delete course Category with {categoryName}? This action cannot be undone.
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

export default DeleteTrainingCourseCategory;
