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
import { deleteTerminationType } from '../../Api/separationApi';
import NotPageHandle from "../../common/NoPageHandle";

const DeleteTerminationType = () => {
    const location = useLocation();
    const { terminationTypeId, name } = location.state || {};
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
            const response = await deleteTerminationType(tenantId, terminationTypeId);
            if (response.status === 200) {
                setNotification({
                    open: true,
                    message: `Termination type "${name}" deleted successfully!`,
                    severity: 'success',
                });
                handleClose();
            } else {
                setNotification({
                    open: true,
                    message: 'Error deleting termination type.',
                    severity: 'error',
                });
            }
        } catch (error) {
            let errorMessage = 'An error occurred. Please try again.';
            
          
            if (error.response && error.response.status === 500) {
                errorMessage = `Cannot delete termination type "${name}" as it is currently in use.`;
            }
           
            setNotification({
                open: true,
                message: errorMessage,
                severity: 'error',
            });
            console.error('Error deleting termination type:', error);
        }
    };

    if (!terminationTypeId) {
        return <NotPageHandle message="No Termination Type selected to Delete" navigateTo="/create-termination-type" />;
    }

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the termination type "{name}"? This action cannot be undone.
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
                onClose={() => setNotification({ ...notification, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default DeleteTerminationType;