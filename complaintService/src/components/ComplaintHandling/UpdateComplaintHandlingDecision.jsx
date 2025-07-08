import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Snackbar,
  Alert,
  Typography,
  Paper,
} from "@mui/material";
import { updateComplaintHandlingDecision } from "../../Api/ComplaintHandlingApi";
import NotPageHandle from "../../common/NoPageHandle";
import Header from "../../common/Header";

const decisionOptions = [
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "PENDING", label: "Pending" },
];

const UpdateComplaintHandlingDecision = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Accept both direct state and params.row.id from DataGrid action
  const { tenantId, handlingId } = location.state || {};
  const [decision, setDecision] = useState("PENDING");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });

  if (!tenantId || !handlingId) {
    return (
      <NotPageHandle
        message="No Complaint Handling selected to update decision"
        navigateTo="/complaint/list-complaint-handlings-by-department"
      />
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateComplaintHandlingDecision(tenantId, handlingId, {
        decision,
        description,
      });
      setNotification({
        open: true,
        message: "Decision updated successfully!",
        severity: "success",
      });
      setTimeout(
        () => navigate("/complaint/list-complaint-handlings-by-department"),
        1000
      );
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to update decision. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box m="20px">
      <Header subtitle="Update Complaint Handling Decision" />
      <Paper sx={{ p: 3, maxWidth: 500, margin: "0 auto" }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Update Decision
          </Typography>
          <TextField
            select
            label="Decision"
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            fullWidth
            required
            margin="normal"
          >
            {decisionOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            margin="normal"
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Decision"}
            </Button>
          </Box>
        </form>
      </Paper>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateComplaintHandlingDecision;
