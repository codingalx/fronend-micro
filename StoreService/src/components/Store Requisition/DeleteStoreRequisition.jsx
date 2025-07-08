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
    Box,
    Typography
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import { deleteStoreRequisition } from '../../Api/storeApi';
import NotPageHandle from "../../common/NoPageHandle";

const DeleteStoreRequisition = () => {
    const location = useLocation();
    const { requisitionId, srNo } = location.state || {};
    const [authState] = useAtom(authAtom);
    const tenantId = authState.tenantId;

    const [openDialog, setOpenDialog] = useState(false);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const navigate = useNavigate();

    const handleClose = () => {
        // navigate(-1); 
          navigate('/store/create-store-requisition');
    };

    const handleDelete = async () => {
        try {
            const response = await deleteStoreRequisition(tenantId, requisitionId);
            if (response.status >= 200 && response.status < 300) {
                setNotification({
                    open: true,
                    message: `Requisition #${srNo} deleted successfully!`,
                    severity: 'success',
                });
                setTimeout(() => handleClose(), 1000);
            } else {
                setNotification({
                    open: true,
                    message: 'Error deleting requisition.',
                    severity: 'error',
                });
            }
                      navigate('/store/create-store-requisition');

        } catch (error) {
            let errorMessage = 'An error occurred. Please try again.';
            
            if (error.response && error.response.status === 500) {
                errorMessage = `Cannot delete requisition #${srNo} as it is currently in use.`;
            }
           
            setNotification({
                open: true,
                message: errorMessage,
                severity: 'error',
            });
            console.error('Error deleting requisition:', error);
        }
    };

    const handleOpenConfirmation = () => {
        setOpenDialog(true);
    };

    const handleCloseConfirmation = () => {
        setOpenDialog(false);
    };

            const handleNavigate = () => {
        navigate('/store/create-store-requisition');
    }

    if (!requisitionId) {
        return <NotPageHandle message="No Requisition selected to Delete" 
        navigateTo={handleNavigate} />;
    }

    return (
        <>
            <Box sx={{ padding: 4, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
                <Typography variant="h5" gutterBottom>
                    Confirm Requisition Deletion
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 3 }}>
                    Are you sure you want to delete requisition: <strong>#{srNo}</strong>?
                </Typography>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleOpenConfirmation}
                    sx={{ marginRight: 2, minWidth: 120 }}
                >
                    Delete
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleClose}
                    sx={{ minWidth: 120 }}
                >
                    Cancel
                </Button>
            </Box>

            {/* Final Confirmation Dialog */}
            <Dialog open={openDialog} onClose={handleCloseConfirmation}>
                <DialogTitle>Final Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You are about to permanently delete requisition #{srNo}. This action cannot be undone. Are you absolutely sure?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmation} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Confirm Delete
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
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default DeleteStoreRequisition;