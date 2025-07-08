import React, { useEffect, useState } from "react";
import { Box, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { getShiftById, getAllTimeTolerances } from "../../Api/Attendance-Api";
import Header from "../Header";

const ListTimeTolerance = ({ refreshKey ,shiftId}) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const overtimeResponse = await getAllTimeTolerances();
        const TimeToleranceData = overtimeResponse?.data || [];

        const mergedRows = await Promise.all(
            TimeToleranceData.map(async (timetolerance) => {
            try {
              const shiftResponse = await getShiftById(timetolerance.shiftId);
              const shift = shiftResponse?.data || {};
              return {
                id: timetolerance.id,
                shiftId: timetolerance.shiftId,
                name: shift.name || "N/A",
                startTimeTolerance: timetolerance.startTimeTolerance || "-",
                endTimeTolerance: timetolerance.endTimeTolerance || "-",
              };
            } catch (err) {
              console.error("Error fetching shift name", err);
              return {
                id: timetolerance.id,
                shiftId: timetolerance.shiftId,
                name: "Error loading name",
                startTime: timetolerance.startTimeTolerance || "-",
                endTime: timetolerance.endTimeTolerance || "-",
              };
            }
          })
        );

        setRows(mergedRows);
      } catch (error) {
        console.error("Error fetching overtimes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]);

    const handleEdit = (toleranceId,name) =>
    navigate(`/attendance/update-time-tolerance`, { state: { toleranceId,name,shiftId} });

  const handleDelete = (toleranceId,name) =>
    navigate(`/attendance/delete-time-tolerance`, { state: { toleranceId ,name,shiftId} });

  const columns = [
    {
      field: "name",
      headerName: "Shift Name",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value} arrow>
          <Box
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "100%",
            }}
          >
            {params.value}
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "startTimeTolerance",
      headerName: "Start Time Tolerance",
      flex: 1,
    },
    {
      field: "endTimeTolerance",
        headerName: "End Time Tolerance",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Edit Shift">
            <IconButton
              onClick={() => handleEdit(params.row.id,params.row.name,params.row.startTimeTolerance,params.row.endTimeTolerance)}
              color="primary"
              size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Shift">
            <IconButton
              onClick={() => handleDelete(params.row.id,params.row.name)}
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
      <Header subtitle="List of Time Tolerances"/>
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          autoHeight
        />
      </Box>
    </Box>
  );
};

export default ListTimeTolerance;
