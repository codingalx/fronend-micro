import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Select, MenuItem, FormControl, InputLabel,
  IconButton, Tooltip, CircularProgress, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, TextField, Autocomplete, Alert
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { getAttendanceByStatusHr, hrApproval, getEmployeeByEmployeId } from '../../Api/Attendance-Api';
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import Header from '../Header';


const statusOptions = [
  { value: 'PENDING', label: 'Pending', color: 'warning' },
  { value: 'APPROVED', label: 'Approved', color: 'success' },
  { value: 'REJECTED', label: 'Rejected', color: 'error' },
];

const statusMapping = {
  MISSING_IN: { label: 'Missing In', color: 'error' },
  MISSING_OUT: { label: 'Missing Out', color: 'error' },
  ABSENT: { label: 'Absent', color: 'error' },
  PRESENT: { label: 'Present', color: 'success' },
  LATE: { label: 'Late', color: 'warning' },
};


const HrApproval = () => {
  const [selectedStatus, setSelectedStatus] = useState('PENDING');
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentResultId, setCurrentResultId] = useState(null);
  const [reason, setReason] = useState('');
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState(null);
  const [employeeOptions, setEmployeeOptions] = useState([]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      setSearchError(null);
      const response = await getAttendanceByStatusHr(selectedStatus);
  
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
            const empResponse = await getEmployeeByEmployeId(tenantId, record.employeeId);
            const emp = empResponse?.data;
            const fullName = emp ? `${emp.firstName} ${emp.middleName || ''} ${emp.lastName}`.trim() : 'Unknown';
            return {
              ...record,
              employeeName: fullName,
              employeeId: emp?.employeeId,
            };
          } catch (error) {
            console.error(`Failed to fetch employee for ID ${record.employeeId}`, error);
            return {
              ...record,
              employeeName: 'Unknown',
              employeeId: 'Unknown',
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
      console.error('Error fetching attendance data:', error);
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
 
  useEffect(() => {
    fetchAttendanceData();
  }, [selectedStatus]);

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
    setReason('');
  };

  const handleSubmitDecision = async () => {
    if (!currentResultId || !currentAction || !reason) return;

    try {
      setActionLoading(true);

      const payload = {
        decision: currentAction,  // Ensure decision is being set correctly
        reason: reason,
      };

      console.log("Payload being sent:", payload);  // Log the payload for debugging
          console.log(currentResultId)
      await hrApproval(currentResultId, payload);
      console.log(currentResultId)


      handleCloseDialog();
      fetchAttendanceData(); // Refresh the data
    } catch (error) {
      console.error('Error updating decision:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (time) => time || '--:--';
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  return (
    <Box m={3}>
      <Header subtitle="Hr Approval" />
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} gap={2}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select value={selectedStatus} label="Filter by Status" onChange={handleStatusChange}>
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
          <IconButton onClick={fetchAttendanceData} color="primary">
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
        <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Check In</TableCell>
              <TableCell>Check Out</TableCell>
              <TableCell>Morning Status</TableCell>
              <TableCell>Afternoon Status</TableCell>
              <TableCell>Total Hours</TableCell>
              <TableCell>Final Status</TableCell>
              <TableCell>Department Decision</TableCell>
              {selectedStatus === 'PENDING' && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
           {filteredData.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.employeeName}</TableCell>
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
                    label={statusMapping[row.finalStatus]?.label || row.finalStatus}
                    color={statusMapping[row.finalStatus]?.color || 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={statusOptions.find(s => s.value === row.departmentDecision)?.label || row.departmentDecision}
                    color={statusOptions.find(s => s.value === row.departmentDecision)?.color || 'default'}
                    size="small"
                  />
                </TableCell>
                {selectedStatus === 'PENDING' && row.hrDecision === 'PENDING' && (
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Approve">
                        <IconButton
                          onClick={() => handleActionClick('APPROVED', row.id)}
                          color="success"
                          disabled={actionLoading}
                        >
                          <ApproveIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton
                          onClick={() => handleActionClick('REJECTED', row.id)}
                          color="error"
                          disabled={actionLoading}
                        >
                          <RejectIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentAction === 'APPROVED' ? 'Approve Attendance' : 'Reject Attendance'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Reason"
            fullWidth
            multiline
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={`Enter reason for ${currentAction === 'APPROVED' ? 'approval' : 'rejection'}`}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitDecision}
            variant="contained"
            color={currentAction === 'APPROVED' ? 'success' : 'error'}
            disabled={actionLoading || !reason}
          >
            {actionLoading ? <CircularProgress size={24} /> : (currentAction === 'APPROVED' ? 'Approve' : 'Reject')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HrApproval;





