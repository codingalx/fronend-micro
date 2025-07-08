import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import {
  getAllComplaintTypes,
  deleteComplaintType,
} from "../../Api/ComplaintTypeApi";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../common/Header";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";

const ListComplaintType = ({ refreshKey }) => {
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const navigate = useNavigate();

  const [complaintTypes, setComplaintTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });

  // Dialog state for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchComplaintTypes = async () => {
    try {
    
      const response = await getAllComplaintTypes(tenantId);
      setComplaintTypes(response);
    } catch (error) {
      console.error("Error fetching complaint types:", error);
      setNotification({
        open: true,
        message: "Failed to fetch complaint types. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaintTypes();
  }, [refreshKey]);

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteComplaintType(tenantId, deleteId);
      setComplaintTypes((prev) => prev.filter((type) => type.id !== deleteId));
      setNotification({
        open: true,
        message: "Complaint type deleted successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting complaint type:", error);
      setNotification({
        open: true,
        message: "Failed to delete complaint type.",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Tooltip title="Edit Complaint Type">
            <IconButton
              onClick={() =>
                navigate("/complaint/update-complaint-type", {
                  state: { complaintTypeId: params.row.id },
                })
              }
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Complaint Type">
            <IconButton
              onClick={() => handleDelete(params.row.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header subtitle="List of Complaint Types" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={complaintTypes}
          columns={columns}
          loading={loading}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
          getRowId={(row) => row.id}
        />
      </Box>
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Complaint Type</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this complaint type? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ListComplaintType;
