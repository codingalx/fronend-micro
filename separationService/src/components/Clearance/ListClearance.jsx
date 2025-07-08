import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Box, Snackbar, Alert, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { getAllClearances, getEmployeeByEId, getAllDepartments } from '../../Api/separationApi';
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import { useNavigate } from 'react-router-dom';
import Header from '../../common/Header';

const ListClearance = ({ refreshKey }) => {
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const navigate = useNavigate();

  const [clearances, setClearances] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchClearanceData();
  }, [refreshKey]);

  const fetchClearanceData = async () => {
    try {
      const [clearanceResponse, departmentResponse] = await Promise.all([
        getAllClearances(tenantId),
        getAllDepartments(tenantId),
      ]);

      setDepartments(departmentResponse.data);

      const clearancesWithEmployeeNames = await Promise.all(
        clearanceResponse.data.map(async (clearance) => {
          try {
            const employeeResponse = await getEmployeeByEId(tenantId, clearance.employeeId);
            const employeeData = employeeResponse.data;
            const employeeName = `${employeeData.firstName} ${employeeData.middleName || ''} ${employeeData.lastName}`.trim();

            return {
              ...clearance,
              employeeName,
            };
          } catch (error) {
            console.error(`Error fetching employee ${clearance.employeeId}:`, error);
            return {
              ...clearance,
              employeeName: 'Unknown Employee',
            };
          }
        })
      );

      setClearances(clearancesWithEmployeeNames);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
      setNotification({
        open: true,
        message: 'Failed to fetch clearance records.',
        severity: 'error',
      });
    }
  };

  const handleUpdate = (id) => {
    navigate('/separation/update-clearance', { state: { clearanceId: id } });
  };

  const handleDelete = (id, employeeName) => {
    navigate('/separation/delete-clearance', { state: { clearanceId: id, employeeName } });
  };

  const departmentMap = departments.reduce((acc, department) => {
    acc[department.id] = department.departmentName;
    return acc;
  }, {});

  const rows = clearances.map(clearance => ({
    ...clearance,
    departmentName: departmentMap[clearance.clearanceDepartmentId] || 'Unknown Department',
  }));

  const columns = [
    { field: 'employeeName', headerName: 'Employee Name', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'departmentName', headerName: 'Department Name', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="Edit Clearance">
            <IconButton
              onClick={() => handleUpdate(params.row.id)}
              color="primary"
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Clearance">
            <IconButton
              onClick={() => handleDelete(params.row.id, params.row.employeeName)}
              color="error"
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header subtitle="List Of Clearances" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          checkboxSelection={false}
        />
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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

export default ListClearance;