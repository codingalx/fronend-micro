import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Typography, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { deleteAnnualRequirementPromotion } from "../../../configuration/PlanningApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import NotFoundHandle from "../common/NotFoundHandle";


const DeleteAnnualRecruitmentPromotion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hrNeedRequestId } = location.state || {};
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const promotionId =location?.state?.id
     const [authState] = useAtom(authAtom); 
            const tenantId = authState.tenantId



  const handleDelete = async () => {
    try {
      await deleteAnnualRequirementPromotion(tenantId,promotionId);
      const id = hrNeedRequestId
      navigate("/planning/requitment-promotion", { state: { id } });

    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancel = () => {
    const id = hrNeedRequestId
    navigate("/planning/requitment-promotion", { state: { id } });
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  if (!id) {
    return <NotFoundHandle message="No need request selected for hr annul recruitment deltion ." navigateTo="/planning/listRequest" />;
  }

  return (
    <Box sx={{ padding: 4, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Confirm Requirtement promotion Deletion
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Are you sure you want to delete the Requirtement promotion with Id: <strong>{promotionId}</strong>?
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
            Are you sure you want to permanently delete the Requirtement promotion  with ID: {promotionId}? This action cannot be undone.
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

export default DeleteAnnualRecruitmentPromotion;
