import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton, CircularProgress, Snackbar, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { getAllExitInterviews, getEmployeeByEId } from "../../Api/separationApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import Header from "../../common/Header";

const ListExitInterview = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  const [exitInterviews, setExitInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchExitInterviews();
  }, [refreshKey]);

  const fetchExitInterviews = async () => {
    try {
      setLoading(true);
      const interviewResponse = await getAllExitInterviews(tenantId);
      const interviews = interviewResponse.data;

      const interviewsWithEmployeeNames = await Promise.all(
        interviews.map(async (interview) => {
          const employeeResponse = await getEmployeeByEId(tenantId, interview.employeeId);
          const employeeData = employeeResponse.data;
          const employeeName = `${employeeData.firstName} ${employeeData.middleName || ''} ${employeeData.lastName}`.trim();

          return {
            ...interview,
            employeeName, 
          };
        })
      );

      setExitInterviews(interviewsWithEmployeeNames);
    } catch (error) {
      setError(error.message);
      setNotification({
        open: true,
        message: 'Failed to fetch exit interviews or employee details.',
        severity: 'error',
      });
      console.error('Error fetching exit interviews or employee details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (id) => {
    navigate('/update-exit-interview', { state: { exitInterviewId: id } });
  };

  const handleDelete = (id) => {
    navigate('/delete-exit-interview', { state: { interviewId: id } });
  };

  const columns = [
    { field: "employeeName", headerName: "Employee Name", flex: 1 },
    { field: "leaveReason", headerName: "Leave Reason", flex: 1.3 },
    { field: "remark", headerName: "Remark", flex: 1.3 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="Edit Exit Interview">
            <IconButton
              onClick={() => handleUpdate(params.row.id)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Exit Interview">
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
      <Header subtitle="List Of Exit Interviews" />
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : (
        <Box m="40px 0 0 0" height="75vh">
          <DataGrid
            rows={exitInterviews}
            columns={columns}
            loading={loading}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            autoHeight
          />
        </Box>
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ListExitInterview;