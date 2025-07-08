import { Box, IconButton,Dialog,DialogTitle,DialogContent,DialogActions,Button } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { useNavigate } from "react-router-dom";
import { leaveSettingsEndpoint, leaveTypesEndpoint } from "../../../configuration/LeaveApi";
import Header from "../common/Header";
import { canAccessResource } from "../../../configuration/SecurityService";
import LeaveServiceResourceName from "../../../configuration/LeaveServiceResourceName";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const ManageLeaveSettings = ({refreshKey}) => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const userRoles = authState.roles;
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canGetDetail, setCanGetDetail] = useState(false);

  // Function to check permissions
  const checkPermissions = async () => {
    try {
      const editAccess = await canAccessResource(
        LeaveServiceResourceName.UPDATE_LEAVE_SETTING,
        userRoles
      );
      const deleteAccess = await canAccessResource(
        LeaveServiceResourceName.DELETE_LEAVE_SETTING,
        userRoles
      );
      const getDetails = await canAccessResource(
        LeaveServiceResourceName.GET_LEAVE_SETTING_BY_ID,
        userRoles
      );

      setCanEdit(editAccess);
      setCanDelete(deleteAccess);
      setCanGetDetail(getDetails);
    } catch (err) {
      console.error("Error checking permissions:", err.message);
    }
  };

   
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leaveSettingToDelete, setLeaveSettingToDelete] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0); // State to trigger re-fetch


// Function to handle deletion
const handleDeleteRole = async () => {
 console.log("Deleting leave setting:", leaveSettingToDelete); // Debugging log
 try {
   const { url, headers } = leaveSettingsEndpoint(authState.accessToken);
   await axios.delete(`${url}/${tenantId}/delete/${leaveSettingToDelete}`, {
     headers,
   });

   console.log("leave setting    deleted successfully:", leaveSettingToDelete);
   setReloadTrigger((prev) => prev + 1); // Trigger reload after successful delete
   setDeleteDialogOpen(false); // Close the dialog
 } catch (error) {
   console.error("Failed to delete address ", error);
 }
};

  const handleCellClick = (params, event) => {
    if (params.field === "delete") {
      event.stopPropagation();
    }
  };

  const navigate = useNavigate();
  const [holidays, setHolidays] = useState([]);
  const [error, setError] = useState(null);
  const [leaveTypeNames, setLeaveTypeNames] = useState([]);

  const displayTenants = async () => {
    const { url, headers } = leaveSettingsEndpoint(authState.accessToken);

    try {
      const response = await axios.get(`${url}/${tenantId}/get-all`, {
        headers,
      });
      setHolidays(response.data);
      console.log("response", response.data);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };
  const fetchBudgetYearNames = async () => {
    const { url, headers } = leaveTypesEndpoint(authState.accessToken);
    try {
      const response = await axios.get(`${url}/${tenantId}/get-all`, {
        headers,
      });
      setLeaveTypeNames(response.data);
      console.log("leaveTypeNames", response.data);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchBudgetYearNames();
    displayTenants();
    checkPermissions();
  }, [reloadTrigger,refreshKey]);

  const columns = [
    { field: "leaveTypeNames", headerName: "Leave Type Name", flex: 2 },
    { field: "gender", headerName: "Gender", flex: 1 },
    { field: "employmentType", headerName: "Employee Type", flex: 1 },
    { field: "minimumDays", headerName: "Min. Days", flex: 1 },
    { field: "maximumDays", headerName: "Max. Days", flex: 1 },
    
    {
      field: "delete",
      headerName: "Delete",
      renderCell: (params) => 
        // canDelete &&(
        <IconButton
          onClick={() => {
            console.log("Delete button clicked for:", params.row.id);
            setLeaveSettingToDelete(params.row.id); // Set the role to delete
            setDeleteDialogOpen(true); // Open the delete dialog
          }}
          color="inherit"
        >
          <DeleteIcon />
        </IconButton>
      // ),
    },


    {
      field: "editAction",
      headerName: "Edit",
      flex: 1,
      renderCell: (params) => {
        const onEditClick = () => {
          navigate("/editleavesettings", { state: { id: params.row.id } });
        };

        return (
          // canEdit && (
            <IconButton onClick={onEditClick} color="inherit">
            <EditIcon />
          </IconButton>
          // )
      
        );
      },
    },
    {
      field: "detailsAction",
      headerName: "Details",
      flex: 1,
      renderCell: (params) => {
        const onEditClick = () => {
          navigate("/detailsleavesettings", { state: { id: params.row.id } });
        };

        return (
          // canGetDetail && (
            <IconButton onClick={onEditClick} color="inherit">
            <ReadMoreIcon />
          </IconButton>
          )
       
        // );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header
        subtitle="Managing the leave settings list"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {},
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {},
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
          },
          "& .MuiCheckbox-root": {},
        }}
      >
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <DataGrid
            onCellClick={handleCellClick}
            rows={holidays.map((holidays) => ({
              ...holidays,
              id: holidays.id,
              leaveTypeNames: leaveTypeNames.find(
                (type) => type.id === holidays.leaveTypeId
              )?.leaveTypeName,
            }))}
            columns={columns}
          />
        )}
      </Box>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
  <DialogTitle>Confirm Delete</DialogTitle>
  <DialogContent>
    Are you sure you want to delete the this pay Grade ?
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
      Cancel
    </Button>
    <Button onClick={handleDeleteRole} color="secondary">
      Delete
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
};

export default ManageLeaveSettings;
