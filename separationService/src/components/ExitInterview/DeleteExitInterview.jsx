import React, { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Snackbar,
    Alert,
    CircularProgress,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import { deleteExitInterview } from '../../Api/separationApi';
import NotPageHandle from "../../common/NoPageHandle";

const DeleteExitInterview = () => {
    const location = useLocation();
    const { interviewId, employeeName } = location.state || {}; 
    const [authState] = useAtom(authAtom);
    const tenantId = authState.tenantId;

    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const navigate = useNavigate();

    const handleClose = () => {
        setOpen(false);
        navigate(-1);
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteExitInterview(tenantId, interviewId);
            setNotification({
                open: true,
                message: employeeName 
                    ? `Exit interview for ${employeeName} deleted successfully!`
                    : 'Exit interview deleted successfully!',
                severity: 'success',
            });
            handleClose();
        } catch (error) {
            console.error('Error deleting exit interview:', error);
            setNotification({
                open: true,
                message: 'Failed to delete exit interview. Please try again.',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    if (!interviewId) {
        return <NotPageHandle message="No Exit Interview selected to Delete" navigateTo="/create-exit-interview" />;
    }

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {employeeName 
                            ? `Are you sure you want to delete the exit interview for ${employeeName}? This action cannot be undone.`
                            : 'Are you sure you want to delete this exit interview? This action cannot be undone.'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" disabled={loading}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDelete} 
                        color="error" 
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

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
        </>
    );
};

export default DeleteExitInterview;