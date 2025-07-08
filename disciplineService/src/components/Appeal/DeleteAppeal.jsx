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
import { deleteAppeal } from '../../Api/disciplineApi';
import NotPageHandle from "../../common/NoPageHandle";

const DeleteAppeal = () => {
    const location = useLocation();
    const { appealId, offenseName,disciplineId } = location.state || {};
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
        navigate("/discipline/create-appeal",{ state: { disciplineId} });

    };

    const handleDelete = async () => {
        try {
            const response = await deleteAppeal(tenantId, appealId);
            if (response.status === 200) {
                setNotification({
                    open: true,
                    message: `Appeal for offense "${offenseName}" deleted successfully!`,
                    severity: 'success',
                });
                setTimeout(() => handleClose(), 1000);
                navigate("/discipline/create-appeal"); 
            } else {
                setNotification({
                    open: true,
                    message: 'Error deleting appeal.',
                    severity: 'error',
                });
            }
        } catch (error) {
            let errorMessage = 'An error occurred while deleting the appeal. Please try again.';
            
            if (error.response && error.response.status === 500) {
                errorMessage = `Cannot delete appeal for offense "${offenseName}" as it is currently in use.`;
            }
           
            setNotification({
                open: true,
                message: errorMessage,
                severity: 'error',
            });
            console.error('Error deleting appeal:', error);
        }
    };

    const handleOpenConfirmation = () => {
        setOpenDialog(true);
    };

    const handleCloseConfirmation = () => {
        setOpenDialog(false);
    };

    if (!appealId) {
        return <NotPageHandle message="No Appeal selected to Delete" 
        navigateTo="/discipline/create-appeal" />;
    }

    return (
        <>
            <Box sx={{ padding: 4, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
                <Typography variant="h5" gutterBottom>
                    Confirm Appeal Deletion
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 3 }}>
                    Are you sure you want to delete the appeal for offense: <strong>{offenseName}</strong>?
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
                        You are about to permanently delete the appeal for offense "{offenseName}". This action cannot be undone. Are you absolutely sure?
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

export default DeleteAppeal;