import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Typography, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { deleteCandidateEvaluation } from "../../Api/ApiPromo";
import NotPageHandle from "../common/NotPageHandle";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";

const DeleteCandidateEvaluation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authState] = useAtom(authAtom);
  const tenantId = authState?.tenantId;

  const { evaluationId, candidateId, candidateName } = location.state || {};
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  if (!evaluationId || !candidateId) {
    return (
      <NotPageHandle
        message="No evaluation selected to delete."
        navigateTo="/promotion/createPromotionCandidate"
      />
    );
  }

  const handleDelete = async () => {
    try {
      await deleteCandidateEvaluation(tenantId, candidateId, evaluationId, {});
      navigate("/promotion/CreateCandidateEvaluation", {
        state: { id: candidateId, name: candidateName },
      });
    } catch (error) {
      let errorMessage = "Error deleting evaluation!";
      
      if (error.response && error.response.status === 500) {
        errorMessage = "Cannot delete evaluation because it's already in use.";
      } else {
        errorMessage = "Server error occurred while deleting evaluation.";
      }

      setError(errorMessage);
    }
  };

  const handleCancel = () => {
    navigate("/promotion/CreateCandidateEvaluation", {
      state: { id: candidateId, name: candidateName },
    });
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Confirm Evaluation Deletion
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Are you sure you want to delete the evaluation for candidate: <strong>{candidateName}</strong>?
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
            Are you sure you want to permanently delete the evaluation for candidate: {candidateName}? This action cannot be undone.
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

export default DeleteCandidateEvaluation;
