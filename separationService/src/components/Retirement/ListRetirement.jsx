import React, { useEffect, useState, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Box, Snackbar, Alert, Typography, Tooltip, TextField, InputAdornment } from '@mui/material';
import { Delete, CheckCircle, CheckCircleOutline, Add, Close, HourglassEmpty, Search } from '@mui/icons-material';
import { getAllRetirements, getEmployeeByEId } from '../../Api/separationApi';
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import { useNavigate } from 'react-router-dom';
import Header from '../../common/Header';

const ListRetirement = () => {
    const [authState] = useAtom(authAtom);
    const tenantId = authState.tenantId;

    const [retirements, setRetirements] = useState([]);
    const [filteredRetirements, setFilteredRetirements] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success',
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchRetirements = async () => {
        const response = await getAllRetirements(tenantId);
        return response.data;
    };

    const getEmployeeDetails = async (employeeId) => {
        const response = await getEmployeeByEId(tenantId, employeeId);
        return response.data;
    };

    const processRetirementData = async (retirementsData) => {
        return await Promise.all(
            retirementsData.map(async (retirement) => {
                const employeeData = await getEmployeeDetails(retirement.employeeId);
                const employeeName = `${employeeData.firstName} ${employeeData.middleName || ''} ${employeeData.lastName}`.trim();
                return {
                    ...retirement,
                    employeeName,
                };
            })
        );
    };

    const filterRetirements = useCallback(() => {
        const filtered = retirements.filter((retirement) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                (retirement.employeeName?.toLowerCase() || '').includes(searchLower) ||
                (retirement.retirementType?.toLowerCase() || '').includes(searchLower) ||
                (retirement.retirementDate?.toLowerCase() || '').includes(searchLower) ||
                (retirement.status?.toLowerCase() || '').includes(searchLower) ||
                (retirement.remark?.toLowerCase() || '').includes(searchLower)
            );
        });
        setFilteredRetirements(filtered);
    }, [searchQuery, retirements]);

    const fetchData = useCallback(async () => {
        try {
            const retirementsData = await fetchRetirements();
            const updatedRetirements = await processRetirementData(retirementsData);
            
            setRetirements(updatedRetirements);
            filterRetirements(); 
        } catch (error) {
            console.error('Error fetching retirement records or employee details:', error);
            setNotification({
                open: true,
                message: 'Failed to fetch retirement records or employee details.',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    }, [tenantId, filterRetirements]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = (id) => {
        const retirement = retirements.find((retirement) => retirement.id === id);

        if (retirement.status === 'APPROVED' || retirement.status === 'REJECTED') {
            setNotification({
                open: true,
                message: `Cannot delete a retirement request that is already ${retirement.status.toLowerCase()}.`,
                severity: 'error',
            });
        } else {
            navigate('/separarion/delete-retirement', { state: { retirementId: id } });
        }
    };

    const handleApprove = (id) => {
        navigate('/separation/approve-retirement', { state: { retirementId: id, tenantId } });
    };

    const handleClearance = (retirement) => {
        navigate('/separation/create-clearance-retirement', {
            state: {
                employeeId: retirement.employeeId,
                employeeName: retirement.employeeName,
            },
        });
    };

    const columns = [
        { field: 'employeeName', headerName: 'Employee Name', flex: 1 },
        { field: 'retirementType', headerName: 'Retirement Type', flex: 1 },
        { field: 'retirementDate', headerName: 'Retirement Date', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1 },
        { field: 'remark', headerName: 'Remark', flex: 1.5 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1.5,
            renderCell: (params) => (
                <Box display="flex" gap={1}>
                    {params.row.status === 'PENDING' && (
                        <Tooltip title="Delete Retirement Request" arrow>
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
            <Header subtitle="List Of Retirement"/>
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
                    rows={filteredRetirements}
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

export default ListRetirement;