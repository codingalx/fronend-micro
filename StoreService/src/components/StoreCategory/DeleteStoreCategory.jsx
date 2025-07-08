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
import { deleteStoreCategory } from '../../Api/storeApi';
import NoPageHandle from "../../common/NoPageHandle";

const DeleteStoreCategory = () => {
    const location = useLocation();
    const { categoryId, name } = location.state || {};
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
       navigate('/store/store_setup', { state: { activeTab: 0 } });
    };

    const handleDelete = async () => {
        try {
            const response = await deleteStoreCategory(tenantId, categoryId);
            
            // Check for successful response (2xx status)
            if (response.status >= 200 && response.status < 300) {
                setNotification({
                    open: true,
                    message: `Store category "${name}" deleted successfully!`,
                    severity: 'success',
                });
                setTimeout(() => handleClose(), 1000);
                navigate('/store/store_setup', { state: { activeTab: 0 } });
            } else {
                setNotification({
                    open: true,
                    message: 'Error deleting store category.',
                    severity: 'error',
                });
            }
        } catch (error) {
            let errorMessage = 'An error occurred. Please try again.';
            
            if (error.response) {
                if (error.response.status === 500) {
                    errorMessage = `Cannot delete store category "${name}" as it is currently in use.`;
                }
            }
           
            setNotification({
                open: true,
                message: errorMessage,
                severity: 'error',
            });
            console.error('Error deleting store category:', error);
        } finally {
            setOpenDialog(false);
        }
    };

    const handleOpenConfirmation = () => {
        setOpenDialog(true);
    };

    const handleCloseConfirmation = () => {
        setOpenDialog(false);
    };

       const handleNavigate = () => {
        navigate('/store/store_setup', { state: {  activeTab: 0 } });
    }

   

      if (!categoryId) {
        return (
          <NoPageHandle
            message="No Store Category selected to Delete."
             onNavigate={handleNavigate}
          />
        );
      }

    return (
        <>
            <Box sx={{ padding: 4, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
                <Typography variant="h5" gutterBottom>
                    Confirm Store Category Deletion
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 3 }}>
                    Are you sure you want to delete the store category: <strong>{name}</strong>?
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
                        You are about to permanently delete the store category "{name}". 
                        This action cannot be undone. Are you absolutely sure?
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
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default DeleteStoreCategory;