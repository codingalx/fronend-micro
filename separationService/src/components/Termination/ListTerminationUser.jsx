import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton, Snackbar, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { getEmployeeTerminations, getEmployeeByEId, getAllTerminationTypes } from "../../Api/separationApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import Header from "../../common/Header";

const ListTerminationUser = ({ refreshKey }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [authState] = useAtom(authAtom);
    const tenantId = authState.tenantId;

    const [terminations, setTerminations] = useState([]);
    const [terminationTypes, setTerminationTypes] = useState([]);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success',
    });
    const [loading, setLoading] = useState(true);
    const fetchData = async () => {
        try {
            const terminationTypesResponse = await getAllTerminationTypes(tenantId);
            const terminationTypesData = terminationTypesResponse.data;
            setTerminationTypes(terminationTypesData);

            const response = await getEmployeeTerminations(tenantId);
            const terminationsData = response.data;

            const updatedTerminations = await Promise.all(
                terminationsData.map(async (termination) => {
                    const employeeResponse = await getEmployeeByEId(tenantId, termination.employeeId);
                    const employeeData = employeeResponse.data;
                    const employeeName = `${employeeData.firstName} ${employeeData.middleName || ''} ${employeeData.lastName}`.trim();

                    const terminationType = terminationTypesData.find(
                        (type) => type.id === termination.terminationTypeId
                    )?.name || 'Unknown';

                    return {
                        ...termination,
                        employeeName,
                        terminationType,
                    };
                })
            );

            setTerminations(updatedTerminations);
        } catch (error) {
            console.error('Error fetching termination records, employee details, or termination types:', error);
            setNotification({
                open: true,
                message: 'Failed to fetch termination records, employee details, or termination types.',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchData();
    }, [ refreshKey]);

   
    const handleDelete = (id) => {
        const termination = terminations.find((termination) => termination.id === id);

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

    const handleUpdate = (id) => {
        navigate('/separation/update-termination', { state: { terminationId: id } });
    };

    const columns = [
        { field: 'employeeName', headerName: 'Employee Name', flex: 1 },
        { field: 'terminationType', headerName: 'Termination Type', flex: 1 },
        { field: 'terminationDate', headerName: 'Termination Date', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1 },
        { field: 'reason', headerName: 'Reason', flex: 1.5 },  
        { field: 'remark', headerName: 'Remark', flex: 1.5 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1.5,
            renderCell: (params) => (
                <Box display="flex" gap={1}>
                    {params.row.status === 'PENDING' && (
                        <Tooltip title="Edit Termination" arrow>
                            <IconButton onClick={() => handleUpdate(params.row.id)} color="primary">
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    )}

                    {params.row.status === 'PENDING' && (
                        <Tooltip title="Delete Termination" arrow>
                            <IconButton onClick={() => handleDelete(params.row.id)} color="error">
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            ),
        },
    ];

    return (
        <Box m="20px">
            <Header subtitle="List " />
            <Box m="40px 0 0 0" height="75vh">
                <DataGrid
                    rows={terminations}
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

export default ListTerminationUser;