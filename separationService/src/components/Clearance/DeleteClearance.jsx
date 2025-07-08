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
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import { deleteClearance } from '../../Api/separationApi';
import NotPageHandle from "../../common/NoPageHandle";

const DeleteClearance = () => {
    const location = useLocation();
    const { clearanceId } = location.state || {};
    const [authState] = useAtom(authAtom);
    const tenantId = authState.tenantId;

    const [open, setOpen] = useState(true);
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
        try {
            const response = await deleteClearance(tenantId, clearanceId);
            if (response.status === 200) {
                setNotification({
                    open: true,
                    message: 'Clearance deleted successfully!',
                    severity: 'success',
                });
            
                setTimeout(() => {
                    handleClose();
                }, 2000); 
            } else {
                setNotification({
                    open: true,
                    message: 'Error deleting clearance.',
                    severity: 'error',
                });
            }
        } catch (error) {
            setNotification({
                open: true,
                message: 'An error occurred. Please try again.',
                severity: 'error',
            });
            console.error('Error deleting clearance:', error);
        }
    };

    if (!clearanceId) {
        return <NotPageHandle message="No Clearance selected to Delete " navigateTo="/separation/list-clearance" />;
    }

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this clearance? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={() => setNotification(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setNotification(prev => ({ ...prev, open: false }))} 
                    severity={notification.severity}
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default DeleteClearance;