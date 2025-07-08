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
import {
  deleteDirectAssignment,
  getDirectAssignmentById,
} from "../../Api/directAssignmentApi";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import NotPageHandle from "../common/NotPageHandle";
import Header from "../common/Header";

const DeleteDirectAssignment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const directAssignmentId = location.state?.directAssignmentId;
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!directAssignmentId) {
      return;
    }
    fetchDirectAssignmentDetails();
  }, [directAssignmentId]);

  const fetchDirectAssignmentDetails = async () => {
    try {
      await getDirectAssignmentById(tenantId, directAssignmentId);
    } catch (error) {
      console.error(
        "Error fetching direct assignment details:",
        error.response || error.message
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDirectAssignment(tenantId, directAssignmentId);
      navigate("/transfer/direct_assigment");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancel = () => {
    navigate("/transfer/direct_assigment");
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  if (!directAssignmentId) {
    return (
      <NotPageHandle
        message="Direct Assignment ID is missing. Redirecting to Create Direct Assignment..."
        navigateTo="/transfer/direct_assigment"
      />
    );
  }

  return (
    <Box
      sx={{ padding: 4, maxWidth: 500, margin: "0 auto", textAlign: "center" }}
    >
      <Header subtitle="Delete Direct Assignment" />
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Are you sure you want to delete the direct assignment with ID:{" "}
        <strong>{String(directAssignmentId)}</strong>?
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
            Are you sure you want to permanently delete the direct assignment
            with ID: {String(directAssignmentId)}? This action cannot be undone.
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

export default DeleteDirectAssignment;
