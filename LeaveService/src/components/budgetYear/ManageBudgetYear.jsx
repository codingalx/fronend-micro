import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { useNavigate } from "react-router-dom";
import { budgetYearEndpoint } from "../../../configuration/LeaveApi";
import Header from "../common/Header";
import LeaveServiceResourceName from "../../../configuration/LeaveServiceResourceName";
import { canAccessResource } from "../../../configuration/SecurityService";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const ManageBudgetYear = ({refreshKey}) => {
  const [authState] = useAtom(authAtom); 
  const { tenantId } = authState;
  const userRoles = authState.roles;


  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [budgetYearToDelete, setBudgetYearToDelete] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0); // State to trigger re-fetch
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canGetDetail, setCanGetDetail] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Function to check permissions
  const checkPermissions = async () => {
    try {
      const editAccess = await canAccessResource(
        LeaveServiceResourceName.UPDATE_BUDGET_YEAR,
        userRoles
      );
      const deleteAccess = await canAccessResource(
        LeaveServiceResourceName.DELETE_BUDGET_YEAR,
        userRoles
      );
      const getDetails = await canAccessResource(
        LeaveServiceResourceName.GET_BUDGET_YEAR_BY_ID,
        userRoles
      );

      setCanEdit(editAccess);
      setCanDelete(deleteAccess);
      setCanGetDetail(getDetails);
    } catch (err) {
      console.error("Error checking permissions:", err.message);
    }
  };

  // Function to fetch and display tenants
  const displayTenants = async () => {
    const { url, headers } = budgetYearEndpoint(authState.accessToken);
    try {
      const response = await axios.get(`${url}/${tenantId}/get-all`, {
        headers,
      });
      setHolidays(response.data);
      console.log("Fetched Budget Years:", response.data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching Budget Years:", err.message);
    }
  };

  // Function to handle deletion
  const handleDeleteRole = async () => {
    console.log("Deleting Budget Year:", budgetYearToDelete);
    const { url, headers } = budgetYearEndpoint(authState.accessToken);

    try {
      await axios.delete(`${url}/${tenantId}/delete/${budgetYearToDelete}`, {
        headers,
      });

      console.log("Budget Year deleted successfully:", budgetYearToDelete);
      setReloadTrigger((prev) => prev + 1); // Trigger reload
      setDeleteDialogOpen(false); // Close the dialog
    } catch (err) {
      console.error("Failed to delete Budget Year:", err.message);
    }
  };

  const handleCellClick = (params, event) => {
    if (params.field === "delete") {
      event.stopPropagation();
    }
  };

  useEffect(() => {
    displayTenants();
    checkPermissions();
  }, [reloadTrigger,refreshKey]);

  const columns = [
    { field: "budgetYear", headerName: "Budget Year Name", flex: 2 },
    { field: "description", headerName: "Budget Year Description", flex: 1 },
    { field: "active", headerName: "Active Year", flex: 1 },
    {
      field: "delete",
      headerName: "Delete",
      renderCell: (params) =>
   
          <IconButton
            onClick={() => {
              setBudgetYearToDelete(params.row.id);
              setDeleteDialogOpen(true);
            }}
            color="inherit"
          >
            <DeleteIcon />
          </IconButton>
   
    },
    {
      field: "editAction",
      headerName: "Edit",
      flex: 1,
      renderCell: (params) => {
        const onEditClick = () => {
          navigate("/editbudgetyear", { state: { id: params.row.id } });
        };

        return (
       
            <IconButton onClick={onEditClick} color="inherit">
              <EditIcon />
            </IconButton>
      
        );
      },
    },
    {
      field: "detailsAction",
      headerName: "Details",
      flex: 1,
      renderCell: (params) => {
        const onDetailsClick = () => {
          navigate("/detailbudgetyear", { state: { id: params.row.id } });
        };

        return (
      
            <IconButton onClick={onDetailsClick} color="inherit">
              <ReadMoreIcon />
            </IconButton>
       
        );
      },
    },
  ];

  return (
    <Box m="20px">
       <Header
        subtitle="Manage Budget Year"
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
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
          },
        }}
      >
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <DataGrid
            onCellClick={handleCellClick}
            rows={holidays.map((holiday) => ({ ...holiday, id: holiday.id }))}
            columns={columns}
          />
        )}
      </Box>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this Budget Year?
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

export default ManageBudgetYear;
