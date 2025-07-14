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
import { deleteShelf } from '../../Api/storeApi'; // Adjust the import path as needed
import NotPageHandle from "../../common/NoPageHandle";

const DeleteShelf = () => {
    const location = useLocation();
    const { shelfId, name } = location.state || {};
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
         navigate('/store/store_setup', { state: {  activeTab: 2 } });
    };

    const handleDelete = async () => {
        try {
            const response = await deleteShelf(tenantId, shelfId);
            if (response.status >= 200 && response.status < 300) {
                setNotification({
                    open: true,
                    message: `Shelf "${name}" deleted successfully!`,
                    severity: 'success',
                });
                setTimeout(() => handleClose(), 1000);
                 navigate('/store/store_setup', { state: {  activeTab: 2 } });
            } else {
                setNotification({
                    open: true,
                    message: 'Error deleting shelf.',
                    severity: 'error',
                });
            }
        } catch (error) {
            let errorMessage = 'An error occurred. Please try again.';
            
            if (error.response && error.response.status === 500) {
                errorMessage = `Cannot delete shelf "${name}" as it is currently in use.`;
            }
           
            setNotification({
                open: true,
                message: errorMessage,
                severity: 'error',
            });
            console.error('Error deleting shelf:', error);
        }
    };

    const handleOpenConfirmation = () => {
        setOpenDialog(true);
    };

    const handleCloseConfirmation = () => {
        setOpenDialog(false);
    };

        const handleNavigate = () => {
        navigate('/store/store_setup', { state: { activeTab: 2} });
    }

    if (!shelfId) {
        return <NotPageHandle message="No Shelf selected to Delete" 
         onNavigate={handleNavigate}
        />;
    }

    return (
        <>
            <Box sx={{ padding: 4, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
                <Typography variant="h5" gutterBottom>
                    Confirm Shelf Deletion
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 3 }}>
                    Are you sure you want to delete the shelf with code: <strong>{name}</strong>?
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
                        You are about to permanently delete the shelf "{name}". This action cannot be undone. Are you absolutely sure?
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
                    elevation={6}
                   
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default DeleteShelf;