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
import { deleteCell } from '../../Api/storeApi';
import NotPageHandle from "../../common/NoPageHandle";

const DeleteCell = () => {
    const location = useLocation();
    const { cellId, name, shelfId } = location.state || {};
    const [authState] = useAtom(authAtom);
    const tenantId = authState.tenantId;

      const { storeId } = location.state || {};

    const [openDialog, setOpenDialog] = useState(false);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const navigate = useNavigate();

    const handleClose = () => {
    navigate('/store/create-cell', { state: { shelfId,storeId} });

        // navigate(-1); 
    };

    const handleDelete = async () => {
        try {
            const response = await deleteCell(tenantId, cellId);
            if (response.status >= 200 && response.status < 300) {
                setNotification({
                    open: true,
                    message: `Cell "${name}" deleted successfully!`,
                    severity: 'success',
                });
                setTimeout(() => handleClose(), 1000);
                  navigate('/store/create-cell', { state: { shelfId,storeId} });
                
            } else {
                setNotification({
                    open: true,
                    message: 'Error deleting cell.',
                    severity: 'error',
                });
            }
             


        } catch (error) {
            let errorMessage = 'An error occurred. Please try again.';
            
            if (error.response && error.response.status === 500) {
                errorMessage = `Cannot delete cell "${name}" as it is currently in use.`;
            }
           
            setNotification({
                open: true,
                message: errorMessage,
                severity: 'error',
            });
            console.error('Error deleting cell:', error);
        }
    };

    const handleOpenConfirmation = () => {
        setOpenDialog(true);
    };

    const handleCloseConfirmation = () => {
        setOpenDialog(false);
    };
     const handleNavigate = () => {
            navigate('/store/create-cell', { state: { shelfId,storeId} });

    }


    if (!cellId) {
        return <NotPageHandle message="No Cell selected to Delete" navigateTo={handleNavigate} />;
    }

    return (
        <>
            <Box sx={{ padding: 4, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
                <Typography variant="h5" gutterBottom>
                    Confirm Cell Deletion
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 3 }}>
                    Are you sure you want to delete the cell with code: <strong>{name}</strong>?
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
                        You are about to permanently delete the cell "{name}". This action cannot be undone. Are you absolutely sure?
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

export default DeleteCell;