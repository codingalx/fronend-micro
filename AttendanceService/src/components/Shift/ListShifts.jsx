import React, { useEffect, useState } from "react";
import { Box, } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Tooltip,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Header from "../Header";
import {
  Event as EventIcon,
  CalendarViewDay as CalendarViewDayIcon,
  Schedule as ScheduleIcon, // Added for time tolerance
} from '@mui/icons-material';

import { useNavigate } from "react-router-dom";
import { getAllshift } from "../../Api/Attendance-Api";

const ListShift = ({ refreshKey }) => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadShifts();
  }, [refreshKey]);
  
  const loadShifts = async () => {
    try {
      const response = await getAllshift();
      if (response?.data?.length) {
        setShifts(response.data);
      }
    } catch (error) {
      console.error("Error fetching shifts", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = (shiftId,name) =>
    navigate(`/attendance/deleteshift`, { state: { shiftId ,name} });
  
  const handleEdit = (shiftId) =>
    navigate(`/attendance/updateshift`, { state: { shiftId } });

 
  


  const columns = [
    {
      field: "name",
      headerName: "Shift Name",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value} arrow placement="top">
          <Box
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "100%",
              "&:hover": {
                cursor: "pointer",
              },
            }}
          >
            {params.value}
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "startTime",
      headerName: "Start Time",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value} arrow placement="top">
          <Box
            sx={{
              width: "100%",
              "&:hover": {
                cursor: "pointer",
              },
            }}
          >
            {params.value}
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "endTime",
      headerName: "End Time",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value} arrow placement="top">
          <Box
            sx={{
              width: "100%",
              "&:hover": {
                cursor: "pointer",
              },
            }}
          >
            {params.value}
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200, // Increased width to accommodate new button
      renderCell: (params) => (
        <Box sx={{ display: 'flex',  gap: 1 }}>
          <Tooltip title="Edit Shift" arrow>
            <IconButton
              onClick={() => handleEdit(params.row.id)}
              color="primary"
              size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Shift" arrow>
            <IconButton
              onClick={() => handleDelete(params.row.id, params.row.name)}
              color="error"
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
         
        </Box>
      ),
    },
  ];
  
  return (
    <Box m="20px">
      <Header subtitle="List of Shifts"/>
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={shifts}
          columns={columns}
          loading={loading}
          autoHeight
          getRowId={(row) => row.id}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </Box>
    </Box>
  );
};

export default ListShift;