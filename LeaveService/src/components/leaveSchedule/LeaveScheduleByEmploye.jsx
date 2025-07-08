import { Box, IconButton, Tooltip } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../common/Header";
import {  getLeaveScedulesByEmployeId } from "../../../configuration/LeaveApi";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LeaveServiceResourceName from "../../../configuration/LeaveServiceResourceName";
import { canAccessResource } from "../../../configuration/SecurityService";
import { useNavigate } from "react-router-dom";
import { getEmployeeByEmployeId } from "../../../configuration/LeaveApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 




const LeaveScheduleByEmploye = ({refreshKey}) => {
  const handleCellClick = (params, event) => {
    if (params.field === "delete") {
      event.stopPropagation();
    }
  };

  const [holidays, setHolidays] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  const [authState] = useAtom(authAtom); 
  const userRoles = authState.roles;
const { username } = authState;
const tenantId = authState.tenantId

const [employeeDetails, setEmployeeDetails] = useState("");
    const [employeeId, setEmployeeId] = useState(null); // State to store employeeId


  

  useEffect(() => {
    checkPermissions();
    fetchEmployeeDetails();
  }, [refreshKey]);

  
      useEffect(() => {
            if (employeeId) {
                fetchAllLeaveScedule(employeeId); 
            }
        }, [employeeId]);
    
        const fetchEmployeeDetails = async () => {
            try {
                const response = await getEmployeeByEmployeId(tenantId,username);
                if (response.status !== 200) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                const data = response.data;
                setEmployeeDetails(data);
                setEmployeeId(data.id); // Set employeeId in state
                console.log(`The employee ID is ${data.id}`);
            } catch (error) {
                console.error("Failed to fetch employee details:", error);
            }
        };
    
  

  const fetchAllLeaveScedule = async (id) => {
    try {
      const response = await getLeaveScedulesByEmployeId(tenantId,id);
      setHolidays(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);


  const checkPermissions = async () => {
    const editAccess = await canAccessResource(LeaveServiceResourceName.UPDATE_LEAVE_SCHEDULE, userRoles);
    const deleteAccess = await canAccessResource(LeaveServiceResourceName.DELETE_LEAVE_SCHEDULE, userRoles);
  
    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
  };

  const handleEditSchedule = (id) => {
    navigate('/updateleaveschedule', { state: {  id } });
  };

  const handleDeleteSchedule = (id) => {
    navigate('/deleteleaveschedule', { state: { id } });
  };


  const columns = [
    { field: "description", headerName: "Leave Schedule Description", flex: 2 },
    { field: "leaveMonth", headerName: "Leave Month", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          
          {canDelete && (
            <Tooltip title="Delete  Leave schedule">
     
           <IconButton
                onClick={() => handleDeleteSchedule(params.row.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}


          {canEdit && (
            <Tooltip title="Update">
              <IconButton
                onClick={() => handleEditSchedule(params.row.id)}
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
      <Header
        subtitle="Managing the leave schedule list"
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
            }))}
            columns={columns}
          />
        )}
      </Box>
    </Box>
  );
};

export default LeaveScheduleByEmploye;
