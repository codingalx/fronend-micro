import React, { useEffect, useState, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Box, Snackbar, Alert, Tooltip, TextField, InputAdornment } from '@mui/material';
import { Delete, CheckCircle, Add, Close, HourglassEmpty, Search } from '@mui/icons-material';
import { getAllTerminations, getEmployeeByEId, getAllTerminationTypes } from '../../Api/separationApi';
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import { useNavigate } from 'react-router-dom';
import Header from '../../common/Header';

const ListTermination = () => {
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const [terminations, setTerminations] = useState([]);
  const [filteredTerminations, setFilteredTerminations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [terminationTypes, setTerminationTypes] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTerminations = async () => {
    const response = await getAllTerminations(tenantId);
    return response.data;
  };

  const getEmployeeDetails = async (employeeId) => {
    const response = await getEmployeeByEId(tenantId, employeeId);
    return response.data;
  };

  const processTerminationData = async (terminationData, terminationTypesData) => {
    return await Promise.all(
      terminationData.map(async (termination) => {
        const employeeData = await getEmployeeDetails(termination.employeeId);
        const employeeName = `${employeeData.firstName} ${employeeData.middleName || ''} ${employeeData.lastName}`.trim();
        
        const terminationType = terminationTypesData.find(
          type => type.id === termination.terminationTypeId
        )?.name || 'Unknown';
        
        return {
          ...termination,
          employeeName,
          terminationType, 
        };
      })
    );
  };

  const filterTerminations = useCallback((data) => {
    return data.filter((termination) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        (termination.employeeName?.toLowerCase() || '').includes(searchLower) ||
        (termination.terminationType?.toLowerCase() || '').includes(searchLower) || 
        (termination.terminationDate?.toLowerCase() || '').includes(searchLower) ||
        (termination.status?.toLowerCase() || '').includes(searchLower) ||
        (termination.reason?.toLowerCase() || '').includes(searchLower) ||
        (termination.remark?.toLowerCase() || '').includes(searchLower)
      );
    });
  }, [searchQuery]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
   
      const terminationTypesResponse = await getAllTerminationTypes(tenantId);
      setTerminationTypes(terminationTypesResponse.data);
      
      const terminationData = await fetchTerminations();
      const updatedTerminations = await processTerminationData(terminationData, terminationTypesResponse.data);
      
      setTerminations(updatedTerminations);
      setFilteredTerminations(filterTerminations(updatedTerminations));
    } catch (error) {
      console.error('Error fetching termination records:', error);
      setNotification({
        open: true,
        message: 'Failed to fetch termination records.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [tenantId, filterTerminations]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = (id) => {
    const termination = terminations.find((t) => t.id === id);
    if (termination.status === 'APPROVED' || termination.status === 'REJECTED') {
      setNotification({
        open: true,
        message: `Cannot delete a termination request that is already ${termination.status.toLowerCase()}.`,
        severity: 'error',
      });
    } else {
      navigate('/separation/delete-termination', { state: { terminationId: id } });
    }
  };

  const handleApprove = (id) => {
    navigate('/separation/approve-termination', { state: { terminationId: id, tenantId } });
  };

  const handleClearance = (termination) => {
    navigate('/separation/create-clearance-termination', {
      state: {
        employeeId: termination.employeeId,
        employeeName: termination.employeeName,
      },
    });
  };

  const columns = [
    { field: 'employeeName', headerName: 'Employee Name', flex: 1 },
    { field: 'terminationType', headerName: 'Termination Type', flex: 1 }, 
    { field: 'terminationDate', headerName: 'Termination Date', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'reason', headerName: 'Reason', flex: 1 },
    { field: 'remark', headerName: 'Remark', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.5,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {params.row.status === 'PENDING' && (
            <Tooltip title="Delete Termination Request" arrow>
              <IconButton onClick={() => handleDelete(params.row.id)} color="error">
                <Delete />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip 
            title={
              params.row.status === 'APPROVED' ? 'Approved - Click to modify' :
              params.row.status === 'REJECTED' ? 'Rejected - Click to modify' : 
              'Pending Approval - Click to approve/reject'
            } 
            arrow
          >
            <IconButton onClick={() => handleApprove(params.row.id)} color="success">
              {params.row.status === 'APPROVED' ? (
                <CheckCircle />
              ) : params.row.status === 'REJECTED' ? (
                <Close color="error" /> 
              ) : (
                <HourglassEmpty />
              )}
            </IconButton>
          </Tooltip>
          
          {params.row.status === 'APPROVED' && (
            <Tooltip title="Initiate Clearance Process" arrow>
              <IconButton onClick={() => handleClearance(params.row)} color="success">
                <Add />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header subtitle="List Of Termination"/>
      <Box m="40px 0 0 0" height="75vh">
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ width: '300px' }}
          />
        </Box>
        <DataGrid
          rows={filteredTerminations}
          columns={columns}
          loading={loading}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
        />
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ListTermination;