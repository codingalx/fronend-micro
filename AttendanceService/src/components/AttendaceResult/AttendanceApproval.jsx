import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import Header from "../Header";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Autocomplete,
} from "@mui/material";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Refresh as RefreshIcon,
  AttachFile as AttachFileIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import {
  getAttendanceByStatus,
  departemntApprove,
  getEmployeeByEmployeId,
  getFile,
  getResultForEmployee,
  getLongId,
  getEmployeeName,
} from "../../Api/Attendance-Api";

const statusOptions = [
  { value: 'PENDING', label: 'Pending', color: 'warning' },
  { value: 'APPROVED', label: 'Approved', color: 'success' },
  { value: 'REJECTED', label: 'Rejected', color: 'error' },
];

const statusMapping = {
  MISSING_IN: { label: "Missing In", color: "error" },
  MISSING_OUT: { label: "Missing Out", color: "error" },
  ABSENT: { label: "Absent", color: "error" },
  PRESENT: { label: "Present", color: "success" },
  LATE: { label: "Late", color: "warning" },
};

const AttendanceApproval = () => {
  const [selectedStatus, setSelectedStatus] = useState("PENDING");
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentResultId, setCurrentResultId] = useState(null);
  const [reason, setReason] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const fileInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchError, setSearchError] = useState(null);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedStatus]);
  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      setSearchError(null);
      const response = await getAttendanceByStatus(selectedStatus);
      if (!response?.data || response.data.length === 0) {
        setAttendanceData([]);
        setFilteredData([]);
        setSearchError("No attendance records found");
        return;
      }

      const attendanceList = response.data;
      const enrichedData = await Promise.all(
        attendanceList.map(async (record) => {
          try {
            const empResponse = await getEmployeeByEmployeId(
              tenantId,
              record.employeeId
            );
            const emp = empResponse?.data;
            const fullName = emp
              ? `${emp.firstName} ${emp.middleName || ""} ${emp.lastName}`.trim()
              : "Unknown";
            return {
              ...record,
              employeeName: fullName,
              employeeId: emp?.employeeId,
            };
          } catch (error) {
            console.error(
              `Failed to fetch employee for ID ${record.employeeId}`,
              error
            );
            return {
              ...record,
              employeeName: "Unknown",
              employeeId: "Unknown",
            };
          }
        })
      );

      setAttendanceData(enrichedData);
      setFilteredData(enrichedData);

      const uniqueEmployees = enrichedData.reduce((acc, record) => {
        if (!acc.some((e) => e.id === record.employeeId)) {
          acc.push({
            id: record.employeeId,
            name: record.employeeName,
            employeeId: record.employeeId,
          });
        }
        return acc;
      }, []);

      setEmployeeOptions(uniqueEmployees);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setAttendanceData([]);
      setFilteredData([]);
      setSearchError("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSelect = (event, value) => {
    if (!value) {
      setFilteredData(attendanceData);
      setSearchTerm("");
      return;
    }

    setSearchTerm(value.name);
    const filtered = attendanceData.filter(
      (record) => record.employeeId === value.id
    );
    setFilteredData(filtered);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredData(attendanceData);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };
  const handleActionClick = (action, resultId) => {
    setCurrentAction(action);
    setCurrentResultId(resultId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setReason("");
    setSelectedFile(null);
    setFileError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileError("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError("File is too large. Maximum size is 10MB.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmitDecision = async () => {
    if (!currentResultId || !reason) return;
    try {
      setActionLoading(true);
      const decisionPayload = {
        decision: currentAction,
        reason: reason,
      };
      const formData = new FormData();
      formData.append(
        "request",
        new Blob([JSON.stringify(decisionPayload)], {
          type: "application/json",
        })
      );
      if (selectedFile) formData.append("file", selectedFile);

      await departemntApprove(currentResultId, {
        request: decisionPayload,
        file: selectedFile,
      });
      setNotification({
        open: true,
        message: `Attendance ${currentAction.toLowerCase()} successfully!`,
        severity: "success",
      });
    



      handleCloseDialog();
      fetchAttendanceData();
    } catch (error) {
      console.error("Error submitting decision:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (time) => time || "--:--";
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  const handleDownloadFile = async (
    resultId,
    employeeName,
    defaultFileName = "file"
  ) => {
    try {
      const response = await getFile(resultId);
      const blob = response.data;

      let filename = `${employeeName}_${defaultFileName}`;
      const contentDisposition = response.headers?.["content-disposition"];

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      }

      if (filename === `${employeeName}_${defaultFileName}`) {
        const fileSignatures = {
          "%PDF": "pdf", 
          "\xD0\xCF\x11\xE0": "doc", 
          "PK\x03\x04": "docx", 
        };

        const buffer = await blob.slice(0, 8).arrayBuffer();
        const uint8Array = new Uint8Array(buffer);
        const firstBytes = Array.from(uint8Array)
          .map((byte) => String.fromCharCode(byte))
          .join("");

        for (const [signature, ext] of Object.entries(fileSignatures)) {
          if (firstBytes.startsWith(signature)) {
            filename = `${filename}.${ext}`;
            break;
          }
        }
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        link.remove();
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error("Download error:", err);
      try {
        if (err.response?.data instanceof Blob) {
          const errorText = await err.response.data.text();
          const errorJson = JSON.parse(errorText);
          setSearchError(
            `Failed to download file: ${errorJson.message || "Unknown error"}`
          );
          return;
        }
      } catch (e) {
      }
      setSearchError(
        `Failed to download file: ${err.message || "Unknown error"}`
      );
    }
  };

  return (
    <Box m={3}>
      <Header subtitle="Department Approval" />

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        gap={2}
      >
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={selectedStatus}
            label="Filter by Status"
            onChange={handleStatusChange}
            sx={{ backgroundColor: "white" }}
          >
            {statusOptions.map((option) => (
                         <MenuItem key={option.value} value={option.value}>
                           {option.label}
                         </MenuItem>
                       ))}
          </Select>
        </FormControl>

        <Autocomplete
          sx={{ width: 400 }}
          options={employeeOptions}
          getOptionLabel={(option) => `${option.name} (${option.employeeId})`}
          value={
            searchTerm
              ? employeeOptions.find((opt) => opt.name === searchTerm) || null
              : null
          }
          onChange={handleEmployeeSelect}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Employee"
              placeholder="Type to search..."
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {searchTerm && (
                      <IconButton
                        onClick={handleClearSearch}
                        edge="end"
                        size="small"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    )}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          noOptionsText="No employees found"
          clearOnEscape
          clearOnBlur={false}
        />

        <Tooltip title="Refresh Data">
          <IconButton
            onClick={fetchAttendanceData}
            color="primary"
            sx={{
              backgroundColor: "white",
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {searchError && (
        <Box mb={2}>
          <Alert severity="error">{searchError}</Alert>
        </Box>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Employee Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Employee Id</TableCell>

                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Check In</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Check Out</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Morning Status
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Afternoon Status
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Total Hours</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Final Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>HR Decision</TableCell>
                {selectedStatus === "PENDING" && (
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                )}
                {(selectedStatus === "APPROVED" ||
                  selectedStatus === "REJECTED") && (
                  <TableCell sx={{ fontWeight: "bold" }}>File</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.employeeName}</TableCell>
                    <TableCell>{row.employeeId}</TableCell>{" "}
                    {/* Now correctly referencing employeeId */}
                    <TableCell>{formatDate(row.date)}</TableCell>
                    <TableCell>{formatTime(row.checkInTime)}</TableCell>
                    <TableCell>{formatTime(row.checkOutTime)}</TableCell>
                     <TableCell>
                                     <Chip
                                       label={statusMapping[row.beforeMidpointStatus]?.label || row.beforeMidpointStatus}
                                       color={statusMapping[row.beforeMidpointStatus]?.color || 'default'}
                                       size="small"
                                     />
                                   </TableCell>
                    <TableCell>
                       <Chip
                                       label={statusMapping[row.afterMidpointStatus]?.label || row.afterMidpointStatus}
                                       color={statusMapping[row.afterMidpointStatus]?.color || 'default'}
                                       size="small"
                                     />
                    </TableCell>
                    <TableCell>{row.totalHour}h</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          statusMapping[row.finalStatus]?.label ||
                          row.finalStatus
                        }
                        color={
                          statusMapping[row.finalStatus]?.color || "default"
                        }
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                                       label={statusMapping[row.hrDecision]?.label || row.hrDecision}
                                       color={statusMapping[row.hrDecision]?.color || 'default'}
                                       size="small"
                                     />
                    </TableCell>
                    {row.departmentDecision === "PENDING" && (
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="Approve with file">
                            <IconButton
                              onClick={() =>
                                handleActionClick("APPROVED", row.id)
                              }
                              color="success"
                              disabled={actionLoading}
                              size="small"
                            >
                              <ApproveIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject with file">
                            <IconButton
                              onClick={() =>
                                handleActionClick("REJECTED", row.id)
                              }
                              color="error"
                              disabled={actionLoading}
                              size="small"
                            >
                              <RejectIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    )}
                    {(selectedStatus === "APPROVED" ||
                      selectedStatus === "REJECTED") && (
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            handleDownloadFile(row.id, row.employeeName)
                          }
                          startIcon={<AttachFileIcon fontSize="small" />}
                        >
                          File
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      {searchError
                        ? searchError
                        : "No attendance records found"}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {currentAction === "APPROVED"
            ? "Approve Attendance"
            : "Reject Attendance"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Reason"
            fullWidth
            multiline
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={`Enter reason for ${currentAction === "APPROVED" ? "approval" : "rejection"}`}
            sx={{ mt: 2 }}
            required
          />
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AttachFileIcon />}
            >
              Attach Supporting Document
              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </Button>
            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected: {selectedFile.name}
              </Typography>
            )}
            {fileError && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {fileError}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitDecision}
            variant="contained"
            color={currentAction === "APPROVED" ? "success" : "error"}
            disabled={actionLoading || !reason}
          >
            {actionLoading ? (
              <CircularProgress size={24} />
            ) : currentAction === "APPROVED" ? (
              "Approve"
            ) : (
              "Reject"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AttendanceApproval;
