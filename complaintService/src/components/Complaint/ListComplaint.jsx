import { useState, useEffect } from "react";
import {
  Box,
  Snackbar,
  Alert,
  FormControl,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getAllComplaints, getEmployeeById } from "../../Api/ComplaintApi";
import { getComplaintType } from "../../Api/ComplaintTypeApi";
import { getComplaintHandlingsByComplaint } from "../../Api/ComplaintHandlingApi";
import Header from "../../common/Header";

const ListComplaint = ({ refreshKey }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchComplaints = async () => {
    try {
      const tenantId = localStorage.getItem("tenantId");
      const response = await getAllComplaints(tenantId);

      // Fetch employee, complaint type, and decision for each complaint
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

            // Fetch complaint handling decision
            let decision = "N/A";
            try {
              const handlings = await getComplaintHandlingsByComplaint(
                tenantId,
                complaint.id
              );
              if (Array.isArray(handlings) && handlings.length > 0) {
                decision = handlings[0].decision || "N/A";
              }
            } catch (e) {}

            return {
              ...complaint,
              complaintTypeName,
              employeeName,
              decision,
            };
          } catch (error) {
            return {
              ...complaint,
              complaintTypeName: "Loading...",
              employeeName: "Loading...",
              decision: "N/A",
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
  }, [refreshKey]);

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
  ];

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box m="20px">
      <Header subtitle="List of Complaints" />
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

export default ListComplaint;
