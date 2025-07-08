import React, { useEffect, useState } from "react";
import { Box, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { getShiftById, getOverTime } from "../../Api/Attendance-Api";
import Header from "../Header";

const ListOverTime = ({ refreshKey }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const overtimeResponse = await getOverTime();
        const overtimeData = overtimeResponse?.data || [];

        const mergedRows = await Promise.all(
          overtimeData.map(async (overtime) => {
            try {
              const shiftResponse = await getShiftById(overtime.shiftId);
              const shift = shiftResponse?.data || {};
              return {
                id: overtime.id,
                shiftId: overtime.shiftId,
                name: shift.name || "N/A",
                startTime: overtime.startTime || "-",
                endTime: overtime.endTime || "-",
              };
            } catch (err) {
              console.error("Error fetching shift name", err);
              return {
                id: overtime.id,
                shiftId: overtime.shiftId,
                name: "Error loading name",
                startTime: overtime.startTime || "-",
                endTime: overtime.endTime || "-",
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

  const handleEdit = (overTimeId,name) =>
    navigate(`/attendance/update-overtime`, { state: { overTimeId,name } });

  const handleDelete = (overTimeId) =>
    navigate(`/attendance/delete-overtime`, { state: { overTimeId } });

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
      field: "startTime",
      headerName: "Start Time",
      flex: 1,
    },
    {
      field: "endTime",
      headerName: "End Time",
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
              onClick={() => handleEdit(params.row.id,params.row.name)}
              color="primary"
              size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Shift">
            <IconButton
              onClick={() => handleDelete(params.row.id)}
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
      <Header  subtitle="List of all over times" />
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

export default ListOverTime;
