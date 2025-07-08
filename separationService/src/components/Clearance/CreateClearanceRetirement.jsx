import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Snackbar,
    Alert,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import { useLocation } from 'react-router-dom';
import {
    createClearance,
    getAllClearanceDepartments,
    getAllDepartments,
} from '../../Api/separationApi';
import Header from '../../common/Header';

const CreateClearanceRetirement = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [authState] = useAtom(authAtom);
    const tenantId = authState.tenantId;

    const location = useLocation();
    const { employeeId, employeeName } = location.state || {};

    const [clearanceDepartments, setClearanceDepartments] = useState([]);
    const [notification, setNotification] = useState({ 
        open: false, 
        message: '', 
        severity: 'success' 
    });
    const [refreshKey, setRefreshKey] = useState(0);
  
    useEffect(() => {
        fetchClearanceDepartments();
        validateEmployeeSelection ();
    }, []);
  
    const validateEmployeeSelection = () => {
        if (!employeeId || !employeeName) {
            setNotification({
                open: true,
                message: 'No employee selected.',
                severity: 'warning',
            });
            return false;
        }
        return true;
    };
    const fetchClearanceDepartments = async () => {
        try {
            const clearanceResponse = await getAllClearanceDepartments(tenantId);
            const departmentsResponse = await getAllDepartments(tenantId);

            const departments = departmentsResponse.data;
            const clearanceData = clearanceResponse.data.map(clearance => {
                const department = departments.find(dept => dept.id === clearance.departmentId);
                return {
                    id: clearance.id,
                    name: department ? department.departmentName : 'Unknown Department',
                };
            });

            setClearanceDepartments(clearanceData);
        } catch (error) {
            console.error('Error fetching clearance departments:', error);
            setNotification({
                open: true,
                message: 'Failed to fetch clearance departments.',
                severity: 'error',
            });
        }
    };

    const handleFormSubmit = async (values, { resetForm }) => {
        try {
            await createClearance(tenantId, values);
            setNotification({
                open: true,
                message: 'Clearance created successfully!',
                severity: 'success',
            });
            resetForm();
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error('Error creating clearance:', error);
            setNotification({
                open: true,
                message: 'Failed to create clearance.',
                severity: 'error',
            });
        }
    };

    const handleCloseSnackbar = () => {
        setNotification({ ...notification, open: false });
    };

    const initialValues = {
        clearanceReason: 'RETIREMENT',
        employeeId: employeeId || '',
        clearanceDepartmentId: '',
        decision: 'CLEARED',
    };

    const validationSchema = Yup.object().shape({
        employeeId: Yup.string().required('Employee ID is required'),
        clearanceDepartmentId: Yup.string().required('Department is required'),
    });

    return (
        <Box m="20px">
            <Header subtitle="Create Clearance - Retirement" />
            
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Clearance Reason"
                                value={values.clearanceReason}
                                InputProps={{ readOnly: true }}
                                sx={{ gridColumn: "span 2" }}
                            />
                            
                            <TextField
                                fullWidth
                                label="Employee"
                                value={employeeName || 'No employee selected'}
                                InputProps={{ readOnly: true }}
                                sx={{ gridColumn: "span 2" }}
                            />
                            
                            <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                                <InputLabel id="department-select-label">Clearance Department</InputLabel>
                                <Select
                                    labelId="department-select-label"
                                    name="clearanceDepartmentId"
                                    value={values.clearanceDepartmentId}
                                    onChange={handleChange}
                                    error={touched.clearanceDepartmentId && Boolean(errors.clearanceDepartmentId)}
                                    required
                                >
                                    {clearanceDepartments.map(dept => (
                                        <MenuItem key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {touched.clearanceDepartmentId && errors.clearanceDepartmentId && (
                                    <Typography color="error" variant="caption">
                                        {errors.clearanceDepartmentId}
                                    </Typography>
                                )}
                            </FormControl>
                            
                            <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                                <InputLabel id="decision-select-label">Decision</InputLabel>
                                <Select
                                    labelId="decision-select-label"
                                    name="decision"
                                    value={values.decision}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="CLEARED">Cleared</MenuItem>
                                    <MenuItem value="UNCLEARED">Uncleared</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        
                        <Box display="flex" justifyContent="start" mt="20px">
                            <Button type="submit" color="secondary" variant="contained">
                                Submit
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CreateClearanceRetirement;