import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Snackbar,
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from "@mui/material";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom"; 
import { deleteTermination } from "../../Api/separationApi"; 
import NotPageHandle from "../../common/NoPageHandle";

const DeleteTermination = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { terminationId } = location.state || {}; 
    const [authState] = useAtom(authAtom); 
    const tenantId = authState.tenantId; 

    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success',
    });
    const [open, setOpen] = useState(true); 

    const handleClose = () => {
        setOpen(false);
        navigate(-1); 
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteTermination(tenantId, terminationId); 
            setNotification({
                open: true,
                message: 'Termination record deleted successfully.',
                severity: 'success',
            });
            setTimeout(() => {
                navigate(-1); 
            }, 2000);
        } catch (error) {
            console.error('Error deleting termination record:', error);
            setNotification({
                open: true,
                message: 'Failed to delete termination record.',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    if (!terminationId) {
        return <NotPageHandle message="No Termination selected to Delete" navigateTo="/create-termination" />;
    }

    return (
        <>
            
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this termination record? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                        disabled={loading}
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
                <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default DeleteTermination;