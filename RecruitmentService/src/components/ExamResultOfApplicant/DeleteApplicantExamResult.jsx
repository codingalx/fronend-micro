import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Typography, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { deleteExamResult } from "../../../configuration/RecruitmentApp";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';



const DeleteApplicantExamResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { examresultId,applicantId,recruitmentId} = location.state || {};

  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
      const [authState] = useAtom(authAtom); 
      const tenantId = authState.tenantId

  const handleDelete = async () => {
    try {
      await deleteExamResult(tenantId,recruitmentId, applicantId, examresultId);
      const id =applicantId 
      navigate('/recruitment/examResult', { state: { id,recruitmentId  } });
       } catch (error) {
      setError(error.message);
    }
  };

  const handleCancel = () => {
    const id =applicantId 
    navigate('/recruitment/examResult', { state: { id,recruitmentId  } }); 
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
        Confirm Applicant Exam Result Deletion
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Are you sure you want to delete Applicant Exam Result  with Applicant Id: <strong>{applicantId}</strong>?
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
            Are you sure you want to permanently delete Applicant Exam Resuklt with ApplicantId: {applicantId}? This action cannot be undone.
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

export default DeleteApplicantExamResult;
