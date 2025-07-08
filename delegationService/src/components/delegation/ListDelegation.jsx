import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import DelegationServiceResourceName from "../../../configuration/DelegationServiceResourceName";
import Header from "../common/Header";
import { canAccessResource } from "../../../configuration/SecurityService";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import { getallActiveDelegation, listEmployee } from "../../../configuration/DelegationApi";
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';


const ListDelegation = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); 
  const userRoles = authState.roles;
  const tenantId = authState.tenantId;

  const [alldelegation, setDelegation] = useState([]);
  const [employees, setEmployees] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    fetchAllDelegation(); // Fetch delegations
    fetchAllEmployees(); // Fetch employees
    checkPermissions(); // Check user permissions
  }, [refreshKey]); 

  const fetchAllEmployees = async () => {
    try {
      const response = await listEmployee(tenantId);
      setEmployees(response.data); // Set the employees data
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };
  
  const fetchAllDelegation = async () => {
    try {
      const response = await getallActiveDelegation(tenantId);
      const delegationData = response.data.map(delegation => ({
        ...delegation,
        employeeId: getEmployeeName(delegation.delegateEmployeeId) // Get employee name
      }));
      setDelegation(delegationData); // Set the delegation data
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const getEmployeeName = (delegateEmployeeId) => {
    const employeeRecord = employees.find(emp => emp.id === delegateEmployeeId); // Correctly reference 'employees'
    return employeeRecord ? employeeRecord.employeeId : "Unknown Employee"; // Return employeeId or default message
  };

  const handleEditDelegation = (id) => {
    navigate('/delegation/update', { state: { id } });
  };

  const handleDeleteDelegation = (id) => {
    navigate('/delegation/delete', { state: { id } });
  };

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(DelegationServiceResourceName.ADD_DELEGATION, userRoles);
    const deleteAccess = await canAccessResource(DelegationServiceResourceName.ADD_DELEGATION, userRoles);
  
    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
  };
  const handleTerminateDelegation = (id) => {
    navigate('/delegation/terminate', { state: { id } });
  };

  const columns = [
    { field: "terminationDate", headerName: "Termination Date", flex: 1 },
    { field: "employeeId", headerName: "Employee ID", flex: 1 },
    { field: "startDate", headerName: "Start Date", flex: 1 },
    { field: "endDate", headerName: "End Date", flex: 1 },
    { field: "terminationReason", headerName: "Termination Reason", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {canDelete && (
            <Tooltip title="Delete Delegation">
              <IconButton
                onClick={() => handleDeleteDelegation(params.row.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          {canEdit && (
            <Tooltip title="Update Delegation">
              <IconButton
                onClick={() => handleEditDelegation(params.row.id)}
                color="primary"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          
           {params.row.status === 'ACTIVE' && (
            <Tooltip title="Terminate Delegation">
              <IconButton
                onClick={() => handleTerminateDelegation(params.row.id)}
                color="primary"
              >
                <HourglassEmptyIcon />

              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header subtitle="List Of Delegation" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={alldelegation}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default ListDelegation;