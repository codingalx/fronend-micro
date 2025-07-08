import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress
} from '@mui/material';
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import Header from '../Header';
import { getLongId, getResultForEmployee } from '../../Api/Attendance-Api';

const statusMapping = {
  MISSING_IN: { label: 'Missing In', color: 'error' },
  MISSING_OUT: { label: 'Missing Out', color: 'error' },
  ABSENT: { label: 'Absent', color: 'error' },
  PRESENT: { label: 'Present', color: 'success' },
  LATE: { label: 'Late', color: 'warning' },
};

const EmployeeAttendanceView = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const employeeId = authState.username; // Get employee ID from auth token

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      
      // First get the long employee ID
      const longIdResponse = await getLongId(tenantId, employeeId);
      const longEmployeeId = longIdResponse.data.id;
      
      // Then fetch attendance records
      const response = await getResultForEmployee(longEmployeeId);
      
      if (!response?.data || response.data.length === 0) {
        setAttendanceData([]);
        return;
      }

      setAttendanceData(response.data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const formatTime = (time) => time || '--:--';
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  return (
    <Box m="20px">
      <Header subtitle="My Attendance Records" />

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
                <TableCell>Morning Status</TableCell>
                <TableCell>Afternoon Status</TableCell>
                <TableCell>Total Hours</TableCell>
                <TableCell>Final Status</TableCell>
                <TableCell>Department Decision</TableCell>
                <TableCell>HR Decision</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{formatDate(row.date)}</TableCell>
                  <TableCell>{formatTime(row.checkInTime)}</TableCell>
                  <TableCell>{formatTime(row.checkOutTime)}</TableCell>
                  <TableCell>
                    {statusMapping[row.beforeMidpointStatus]?.label || row.beforeMidpointStatus}
                  </TableCell>
                  <TableCell>
                    {statusMapping[row.afterMidpointStatus]?.label || row.afterMidpointStatus}
                  </TableCell>
                  <TableCell>{row.totalHour}h</TableCell>
                  <TableCell>
                    {statusMapping[row.finalStatus]?.label || row.finalStatus}
                  </TableCell>
                  <TableCell>{row.departmentDecision}</TableCell>
                  <TableCell>{row.hrDecision}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default EmployeeAttendanceView;