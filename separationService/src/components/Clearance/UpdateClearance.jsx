import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Snackbar,
    Alert,
    CircularProgress,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import { useLocation, useNavigate } from 'react-router-dom';
import { getClearance, updateClearance } from '../../Api/separationApi';
import Header from '../../common/Header';
import NotPageHandle from "../../common/NoPageHandle";

const UpdateClearance = () => {
    const [authState] = useAtom(authAtom);
    const tenantId = authState.tenantId;
    const location = useLocation();
    const navigate = useNavigate();
    const { clearanceId } = location.state || {};

    const [clearanceData, setClearanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {  
        if (clearanceId) {
            fetchClearanceData();
        }
    }, [clearanceId]);

    const fetchClearanceData = async () => {
        try {
            setLoading(true);
            const response = await getClearance(tenantId, clearanceId);
            setClearanceData(response.data);
        } catch (error) {
            console.error('Error fetching clearance data:', error);
            setNotification({
                open: true,
                message: 'Failed to fetch clearance data.',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        try {
            await updateClearance(tenantId, clearanceId, values.status, values);
            setNotification({
                open: true,
                message: 'Clearance updated successfully!',
                severity: 'success',
            });
            setTimeout(() => {
                navigate('/separation/list-clearance'); 
            }, 2000); 
        } catch (error) {
            console.error('Error updating clearance:', error);
            setNotification({
                open: true,
                message: 'Failed to update clearance.',
                severity: 'error',
            });
        }
    };

    if (!clearanceId) {
        return <NotPageHandle message="No Clearance is selected to Update" navigateTo="/separation/list-clearance" />;
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (!clearanceData) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                <Typography>Failed to load clearance data</Typography>
            </Box>
        );
    }

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="center">
                <Header subtitle="Update Clearance" />
            </Box>
            
            <Box display="flex" justifyContent="center">
                <Formik
                    initialValues={{
                        status: clearanceData?.status || '',
                    }}
                    validationSchema={Yup.object({
                        status: Yup.string().required('Status is required'),
                    })}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleSubmit,
                    }) => (
                        <Form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="status-select-label">Status</InputLabel>
                                <Select
                                    labelId="status-select-label"
                                    name="status"
                                    value={values.status}
                                    onChange={handleChange}
                                    error={touched.status && Boolean(errors.status)}
                                    required
                                >
                                    <MenuItem value="CLEARED">Cleared</MenuItem>
                                    <MenuItem value="UNCLEARED">Uncleared</MenuItem>
                                </Select>
                            </FormControl>
                            <Box display="flex" justifyContent="start" mt="20px">
                                <Button type="submit" variant="contained" color="secondary">
                                    Update
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
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

export default UpdateClearance;