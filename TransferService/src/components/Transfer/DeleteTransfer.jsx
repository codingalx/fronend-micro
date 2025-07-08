import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { deleteTransfer, getTransferById } from "../../Api/transferApi";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import NotPageHandle from "../common/NotPageHandle";
import Header from "../common/Header";

const DeleteTransfer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const transferId = location.state?.transferId;
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!transferId) {
      return;
    }
    fetchTransferDetails();
  }, [transferId]);

  const fetchTransferDetails = async () => {
    try {
      await getTransferById(tenantId, transferId);
    } catch (error) {
      console.error(
        "Error fetching transfer details:",
        error.response || error.message
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTransfer(tenantId, transferId);
      navigate("/transfer/list");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancel = () => {
    navigate("/transfer/list");
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  if (!transferId) {
    return (
      <NotPageHandle
        message="Transfer ID is missing. Redirecting to Create Transfer..."
        navigateTo="/transfer/list"
      />
    );
  }

  return (
    <Box
      sx={{ padding: 4, maxWidth: 500, margin: "0 auto", textAlign: "center" }}
    >
      <Header subtitle="Delete Transfer" />
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Are you sure you want to delete the transfer with ID:{" "}
        <strong>{String(transferId)}</strong>?
      </Typography>
      <Button
        variant="contained"
        color="error"
        onClick={handleOpenDialog}
        sx={{ marginRight: 2, minWidth: 120 }}
      >
        Delete
      </Button>
      <Button variant="outlined" onClick={handleCancel} sx={{ minWidth: 120 }}>
        Cancel
      </Button>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete the transfer with ID:{" "}
            {String(transferId)}? This action cannot be undone.
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
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default DeleteTransfer;
