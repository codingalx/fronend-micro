import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Button, Container, Typography, Box, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Checkbox, List, ListItem, ListItemText, ListItemIcon,
  CircularProgress, Snackbar, Paper, Avatar, Divider
} from "@mui/material";
import {
  Edit as EditIcon,
  Event as EventIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import { updateWeekend } from "../../Api/Attendance-Api";
import { styled } from "@mui/material/styles";
import NotPageHandle from "../common/NoPageHandel";

const daysOfWeek = [
  "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY",
  "FRIDAY", "SATURDAY", "SUNDAY"
];

const DayCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.palette.primary.main,
  '&.Mui-checked': {
    color: theme.palette.primary.main,
  },
}));

const DayItem = styled(ListItem)(({ theme, selected }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: selected ? theme.palette.action.selected : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  transition: 'background-color 0.2s ease',
}));

const UpdateWeekend = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  
  const { weekendId, dayNames = [],shiftId } = location.state || {};
  console.log(shiftId)
  const [selectedDays, setSelectedDays] = useState(dayNames);
  const [editDialogOpen, setEditDialogOpen] = useState(false);


  

  const handleOpenEditDialog = () => {
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    // Reset to original selection if dialog is closed without saving
    setSelectedDays(dayNames);
  };

  const handleDaySelection = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleUpdate = async () => {
    if (!weekendId) {
      setNotification({
        open: true,
        message: "No weekend selected for update",
        severity: "error"
      });
      return;
    }

    try {
      setLoading(true);
      await updateWeekend(weekendId, selectedDays);

      setNotification({
        open: true,
        message: "Weekend days updated successfully",
        severity: "success"
      });
      
   setTimeout(() => {
    navigate('/attendance/set_up', { state: { activeTab: 1 } }); 

}, 1500);

    } catch (error) {
      console.error("Error updating weekend days:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to update weekend days",
        severity: "error"
      });
    } finally {
      setLoading(false);
      handleCloseEditDialog();
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };
  console.log("shiftId in update component:", shiftId);
  if (!weekendId) {
    return <NotPageHandle message="No weekend ID provided please choose weekend for the shift" navigateTo="/attendance/set_up" state={{ activeTab: 0 }}  />;
  }

 

  return (
    <Box m="20px">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <EventIcon />
          </Avatar>
          <Typography variant="h5" component="h1">
            Update Weekend 
          </Typography>
        </Box>
        
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            CURRENTLY ASSIGNED DAYS
          </Typography>
          <Paper variant="outlined" sx={{ p: 1 }}>
            {selectedDays.length > 0 ? (
              <List dense>
                {selectedDays.map((day, index) => (
                  <DayItem key={index} selected>
                    <ListItemIcon>
                      <CheckIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={day} 
                      primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                  </DayItem>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="textSecondary">
                  No weekend days currently configured
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate(-1)}
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            color="secondary"
            onClick={handleOpenEditDialog}
            sx={{ minWidth: 150 }}
          >
            {selectedDays.length > 0 ? "Edit Days" : "Set Days"}
          </Button>
        </Box>

      <Dialog 
        open={editDialogOpen} 
        onClose={handleCloseEditDialog} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EventIcon sx={{ mr: 1 }} />
            Select Weekend Days
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Select the days that should be considered weekends:
          </Typography>
          
          <List sx={{ mt: 1 }}>
            {daysOfWeek.map(day => (
              <DayItem 
                key={day} 
                button
                onClick={() => handleDaySelection(day)}
                selected={selectedDays.includes(day)}
              >
                <ListItemIcon>
                  <DayCheckbox
                    edge="start"
                    checked={selectedDays.includes(day)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText 
                  primary={day} 
                  primaryTypographyProps={{
                    fontWeight: selectedDays.includes(day) ? 'medium' : 'normal'
                  }}
                />
              </DayItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseEditDialog} 
            variant="outlined"
            color="secondary"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate} 
            variant="contained"
            color="secondary"
            disabled={loading || selectedDays.length === 0}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ minWidth: 120 }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
          elevation={6}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateWeekend;