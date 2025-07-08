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
  DialogActions,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import {
  getComplaintsByEmployee,
  getEmployeeByEmployeeId,
  getEmployeeById,
} from "../../Api/ComplaintApi";
import { getComplaintType } from "../../Api/ComplaintTypeApi";
import {
  getComplaintHandlingsByComplaint,
  updateComplaintHandling,
  listDepartments,
} from "../../Api/ComplaintHandlingApi";
import EditIcon from "@mui/icons-material/Edit";
import ReplayIcon from "@mui/icons-material/Replay";
import DomainDisabledIcon from "@mui/icons-material/DomainDisabled";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../common/Header";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import NotPageHandle from "../../common/NoPageHandle";
import CreateComplaintHandlingRejected from "../ComplaintHandling/CreateComplaintHandlingRejected";

const ListComplaintByEmployee = ({ refreshKey }) => {
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const username = authState.username;
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });

  // Dialog state for updating department
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedHandling, setSelectedHandling] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // Dialog state for rejected complaint handling
  const [rejectedDialogOpen, setRejectedDialogOpen] = useState(false);
  const [rejectedComplaintId, setRejectedComplaintId] = useState(null);
  const [rejectedExcludeDepartmentId, setRejectedExcludeDepartmentId] =
    useState(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchDepartments = async () => {
    try {
      const response = await listDepartments(tenantId);
      setDepartments(response.data);
    } catch (error) {
      setDepartments([]);
    }
  };

  const fetchComplaints = async () => {
    try {
      // Get the long employeeId using the username
      const employeeResponse = await getEmployeeByEmployeeId(
        tenantId,
        username
      );
      const longEmployeeId = employeeResponse.id;

      // Fetch complaints for this employee
      const response = await getComplaintsByEmployee(tenantId, longEmployeeId);

      // Enrich complaints with employee, complaint type, and decision/handling
      const enrichedComplaints = await Promise.all(
        response.map(async (complaint) => {
          const complaintTypeId = complaint.complaintTypeID;
          const employeeId = complaint.employeeId;

          try {
            // Fetch complaint type details
            const complaintTypeResponse = await getComplaintType(
              tenantId,
              complaintTypeId
            );
            const complaintTypeName =
              complaintTypeResponse.data.name || "Loading...";

            // Fetch employee details
            const employeeResponse = await getEmployeeById(
              tenantId,
              employeeId
            );
            const employeeName = `${employeeResponse.firstName} ${
              employeeResponse.middleName || ""
            } ${employeeResponse.lastName}`.trim();

            // Fetch complaint handling decision and handlingId
            let decision = "N/A";
            let handlingId = null;
            let departmentId = null;
            try {
              const handlings = await getComplaintHandlingsByComplaint(
                tenantId,
                complaint.id
              );
              if (Array.isArray(handlings) && handlings.length > 0) {
                decision = handlings[0].decision || "N/A";
                handlingId = handlings[0].id;
                departmentId = handlings[0].departmentId;
              }
            } catch (e) {}

            return {
              ...complaint,
              complaintTypeName,
              employeeName,
              decision,
              handlingId,
              handlingDepartmentId: departmentId,
            };
          } catch (error) {
            return {
              ...complaint,
              complaintTypeName: "Loading...",
              employeeName: "Loading...",
              decision: "N/A",
              handlingId: null,
              handlingDepartmentId: null,
            };
          }
        })
      );

      setComplaints(enrichedComplaints);
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to fetch complaints. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line
  }, [refreshKey]);

  // Open dialog to update department
  const handleOpenDialog = (row) => {
    setSelectedHandling(row);
    setSelectedDepartment(row.handlingDepartmentId || "");
    fetchDepartments();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedHandling(null);
    setSelectedDepartment("");
  };

  const handleUpdateDepartment = async () => {
    if (
      !selectedHandling ||
      !selectedHandling.handlingId ||
      !selectedDepartment
    )
      return;
    const data = {
      complaintId: selectedHandling.id,
      departmentId: selectedDepartment,
    };
    const requestUrl = `/complaint-handling/${tenantId}/update/${selectedHandling.handlingId}`;
    try {
      await updateComplaintHandling(
        tenantId,
        selectedHandling.handlingId,
        data
      );
      setNotification({
        open: true,
        message: "Department updated successfully!",
        severity: "success",
      });
      handleCloseDialog();
      fetchComplaints();
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to update department.",
        severity: "error",
      });
    }
  };

  // Handle open dialog for REJECTED
  const handleOpenRejectedDialog = (row) => {
    setRejectedComplaintId(row.id);
    setRejectedExcludeDepartmentId(row.handlingDepartmentId);
    setRejectedDialogOpen(true);
  };

  const handleCloseRejectedDialog = () => {
    setRejectedDialogOpen(false);
    setRejectedComplaintId(null);
    setRejectedExcludeDepartmentId(null);
    fetchComplaints();
  };

  if (!tenantId) {
    return <NotPageHandle message="No tenant selected" navigateTo="/login" />;
  }

  // Filter complaints by status
  const filteredComplaints =
    statusFilter === "ALL"
      ? complaints
      : complaints.filter(
          (c) => (c.decision || "").toUpperCase() === statusFilter
        );

  const columns = [
    { field: "employeeName", headerName: "Employee Name", flex: 1 },
    { field: "complaintTypeName", headerName: "Complaint Type Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "complaintDate", headerName: "Complaint Date", flex: 1 },
    { field: "remark", headerName: "Remark", flex: 1 },
    { field: "decision", headerName: "Decision", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 260,
      renderCell: (params) => {
        const decision = (params.row.decision || "").toUpperCase();
        if (decision === "APPROVED") {
          return null;
        }
        if (decision === "REJECTED") {
          return (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Tooltip title="Resend to Another Department">
                <IconButton
                  onClick={() => handleOpenRejectedDialog(params.row)}
                  color="success"
                >
                  <ReplayIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="View Attachments">
                <IconButton
                  onClick={() =>
                    navigate("/complaint/attachments-list", {
                      state: {
                        tenantId,
                        complaintId: params.row.id,
                      },
                    })
                  }
                  color="info"
                >
                  <AttachFileIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Complaint">
                <IconButton
                  onClick={() =>
                    navigate("/complaint/delete-complaint", {
                      state: {
                        tenantId,
                        complaintId: params.row.id,
                      },
                    })
                  }
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          );
        }
        // PENDING state (default: keep as is)
        return (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Tooltip title="Edit Complaint">
              <IconButton
                onClick={() =>
                  navigate("/complaint/update-complaint", {
                    state: {
                      tenantId,
                      complaintId: params.row.id,
                    },
                  })
                }
                color="primary"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            {params.row.handlingId && (
              <Tooltip title="Update Department">
                <IconButton
                  onClick={() => handleOpenDialog(params.row)}
                  color="secondary"
                >
                  <DomainDisabledIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="View Attachments">
              <IconButton
                onClick={() =>
                  navigate("/complaint/attachments-list", {
                    state: {
                      tenantId,
                      complaintId: params.row.id,
                    },
                  })
                }
                color="info"
              >
                <AttachFileIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Complaint">
              <IconButton
                onClick={() =>
                  navigate("/complaint/delete-complaint", {
                    state: {
                      tenantId,
                      complaintId: params.row.id,
                    },
                  })
                }
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box m="20px">
      <Header subtitle="Complaints for Current Employee" />
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
        <Typography sx={{ mr: 1 }}>Filter by Status:</Typography>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="APPROVED">Approved</MenuItem>
            <MenuItem value="REJECTED">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={filteredComplaints}
          columns={columns}
          loading={loading}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
          getRowId={(row) => row.id}
        />
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Department</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="department-select-label">Department</InputLabel>
            <Select
              labelId="department-select-label"
              value={selectedDepartment}
              label="Department"
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.departmentName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleUpdateDepartment}
            variant="contained"
            color="primary"
            disabled={!selectedDepartment}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={rejectedDialogOpen}
        onClose={handleCloseRejectedDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <CreateComplaintHandlingRejected
            complaintId={rejectedComplaintId}
            excludeDepartmentId={rejectedExcludeDepartmentId}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectedDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
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

export default ListComplaintByEmployee;
