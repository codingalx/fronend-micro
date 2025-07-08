import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import EvaluationServiceResourceName from "../../../configuration/EvaluationServiceResourceName";
import { canAccessResource } from "../../../configuration/SecurityService";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import { getAllSession, getAllbudgetYears } from "../../../configuration/EvaluationApi";

const ListSession = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); 
  const userRoles = authState.roles;
  const tenantId = authState.tenantId;

  const [session, setSession] = useState([]);
  const [budgetYear, setBudgetYear] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllSession();
    fetchAllBudgetYear();
    checkPermissions();
  }, [refreshKey]); 

  const fetchAllSession = async () => {
    try {
      const response = await getAllSession(tenantId);
      const sessionData = response.data.map(s => ({
        ...s,
        budgetYearName: getBudgetYearName(s.budgetYearId) // Map budget year name
      }));
      setSession(sessionData);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching sessions:", error.message);
    }
  };

  const fetchAllBudgetYear = async () => {
    try {
      const response = await getAllbudgetYears(tenantId);
      setBudgetYear(response.data);
    } catch (error) {
      console.error("Failed to fetch budget years:", error.message);
    }
  };

  const getBudgetYearName = (budgetYearId) => {
    const budgetYearItem = budgetYear.find(b => b.id === budgetYearId);
    return budgetYearItem ? budgetYearItem.budgetYear : "Unknown Year"; // Adjust property name as necessary
  };

  const handleEditSession = (id) => {
    navigate('/evaluation/update_session', { state: { id } });
  };

  const handleDeleteSession = (id) => {
    navigate('/evaluation/delete_session', { state: { id } });
  };

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(EvaluationServiceResourceName.UPDATE_EVALUATION_SESSION, userRoles);
    const deleteAccess = await canAccessResource(EvaluationServiceResourceName.DELETE_EVALUATION_SESSION, userRoles);
  
    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
  };

  const columns = [
    { field: "term", headerName: "Term", flex: 1 },
    { field: "startDate", headerName: "Start Date", flex: 1 },
    { field: "endDate", headerName: "End Date", flex: 1 },
    {
      field: "budgetYearId",
      headerName: "Budget Year",
      flex: 1,
      renderCell: (params) => getBudgetYearName(params.row.budgetYearId), // Use renderCell to display budget year name
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {canDelete && (
            <Tooltip title="Delete Session">
              <IconButton
                onClick={() => handleDeleteSession(params.row.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          {canEdit && (
            <Tooltip title="Update Session">
              <IconButton
                onClick={() => handleEditSession(params.row.id)}
                color="primary"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header subtitle="List Of Sessions" />
      {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error if there is one */}
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={session}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default ListSession;