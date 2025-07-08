import { useEffect, useState } from "react";
import {
  Box,
  Snackbar,
  Alert,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getEmployeeByEmployeeId,
  getComplaintHandlingsByDepartment,
  getDepartmentById,
} from "../../Api/ComplaintHandlingApi";
import { getComplaint } from "../../Api/ComplaintApi";
import { getComplaintType } from "../../Api/ComplaintTypeApi";
import NotPageHandle from "../../common/NoPageHandle";
import Header from "../../common/Header";
import { useNavigate } from "react-router-dom";

const ListComplaintHandlingsByDepartment = () => {
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const username = authState.username;
  const [departmentId, setDepartmentId] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [statusFilter, setStatusFilter] = useState("ALL");
  const navigate = useNavigate();

  // Fetch default department for user on mount
  useEffect(() => {
    const fetchDefaultDepartment = async () => {
      try {
        const employee = await getEmployeeByEmployeeId(tenantId, username);
        const deptId = employee.departmentId;
        setDepartmentId(deptId);
      } catch (error) {
        setDepartmentId("");
      }
    };
    if (tenantId && username) fetchDefaultDepartment();
  }, [tenantId, username]);

  // Fetch department name and complaint handlings when departmentId changes
  useEffect(() => {
    const fetchData = async () => {
      if (!departmentId) {
        setRows([]);
        setDepartmentName("");
        return;
      }
      setLoading(true);
      try {
        // Get department details to extract departmentName
        const deptResponse = await getDepartmentById(tenantId, departmentId);
        setDepartmentName(deptResponse.data.departmentName);

        // Fetch complaint handlings for this department
        const handlings = await getComplaintHandlingsByDepartment(
          tenantId,
          departmentId
        );

        // Enrich each handling with complaint type name
        const enrichedRows = await Promise.all(
          handlings.map(async (handling) => {
            let complaintTypeName = "Loading...";
            try {
              const complaintResp = await getComplaint(
                tenantId,
                handling.complaintId
              );
              const complaintTypeId =
                complaintResp.data.complaintTypeID ||
                complaintResp.data.complaintTypeId;
              if (complaintTypeId) {
                const complaintTypeResp = await getComplaintType(
                  tenantId,
                  complaintTypeId
                );
                complaintTypeName =
                  complaintTypeResp.data.name || "Unknown Complaint Type";
              }
            } catch (err) {
              complaintTypeName = "Unknown Complaint Type";
            }
            return {
              ...handling,
              complaintTypeName,
            };
          })
        );

        setRows(enrichedRows);
      } catch (error) {
        setNotification({
          open: true,
          message: "Failed to fetch complaint handlings.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (tenantId && departmentId) {
      fetchData();
    }
  }, [tenantId, departmentId]);

  if (!tenantId || !username) {
    return (
      <NotPageHandle message="No tenant or user found" navigateTo="/login" />
    );
  }

  const handleUpdateDecision = (handlingId) => {
    navigate("/complaint/update-complaint-handling-decision", {
      state: { tenantId, handlingId },
    });
  };

  const handleDeleteNavigate = (handlingId) => {
    navigate("/complaint/delete-complaint-handling", {
      state: { tenantId, handlingId },
    });
  };

  // Filter rows by status
  const filteredRows =
    statusFilter === "ALL"
      ? rows
      : rows.filter(
          (row) => (row.decision || "").toUpperCase() === statusFilter
        );

  const columns = [
    { field: "complaintTypeName", headerName: "Complaint Name", flex: 1 },
    { field: "decision", headerName: "Decision", flex: 1 },
    { field: "decidedBy", headerName: "Decided By", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => {
        const decision = (params.row.decision || "").toUpperCase();
        if (decision === "PENDING") {
          return (
            <Box sx={{ display: "flex" }}>
              <Tooltip title="Update Decision">
                <IconButton
                  color="primary"
                  onClick={() => handleUpdateDecision(params.row.id)}
                >
                  <EditNoteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Handling">
                <IconButton
                  color="error"
                  onClick={() => handleDeleteNavigate(params.row.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          );
        }
        // No update decision for REJECTED or APPROVED
        return null;
      },
    },
  ];

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box m="20px">
      <Header subtitle="Complaint Handlings By Department" />
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="subtitle1" sx={{ mr: 2 }}>
          Department:
        </Typography>
        <TextField
          value={departmentName}
          InputProps={{ readOnly: true }}
          sx={{ minWidth: 220 }}
        />
        <Box flex={1} />
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
          rows={filteredRows}
          columns={columns}
          loading={loading}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
          getRowId={(row) => row.id}
        />
      </Box>
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

export default ListComplaintHandlingsByDepartment;
