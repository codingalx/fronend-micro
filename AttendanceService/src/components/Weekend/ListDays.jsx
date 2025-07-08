import React, { useEffect, useState } from "react";
import {
  Typography,
  Stack,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getWeekendByShiftId } from "../../Api/Attendance-Api";
import Header from "../Header";
import NotPageHandle from "../common/NoPageHandel";
import { width } from "@mui/system";

const ListDays = ({ refreshKey, shiftId }) => {
  const [weekendData, setWeekendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!shiftId) return;
    loadWeekendData();
  }, [refreshKey, shiftId]);

  const loadWeekendData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getWeekendByShiftId(shiftId);

      if (response?.data) {
        const formattedData = [
          {
            id: response.data.id,
            weekendId: response.data.id,
            days: response.data.dayNames,
            allDays: response.data.dayNames,
          },
        ];
        setWeekendData(formattedData);

        if (formattedData[0].days.length === 0) {
          setWeekendData([]);
          setError("No weekends found for this shift");
        }
      } else {
        setWeekendData([]);
        setError("No weekends found for this shift");
      }
    } catch (err) {
      console.error("Error fetching weekend data", err);
      setError(err.message || "Failed to load weekend data");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    navigate("/attendance/update-weekend", {
      state: {
        weekendId: row.weekendId,
        dayNames: row.allDays,
        shiftId
      },
    });
  };

  const handleDelete = (row) => {
    navigate("/attendance/delete-weekend", {
      state: {
        weekendId: row.weekendId,
        shiftId,
      },
    });
  };

  const columns = [
    {
      field: "days",
      headerName: "Weekend Days",
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {params.value.map((day, index) => (
            <Chip
              key={index}
              label={day}
              icon={<CalendarTodayIcon fontSize="small" />}
              size="small"
              variant="outlined"
              sx={{ margin: "2px" }}
            />
          ))}
        </Stack>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex:0.2,
width:180,

renderCell: (params) => (
        <Box sx={{ gap: 1 }}>
          <Tooltip title="Edit Weekend" arrow>
            <IconButton
              onClick={() => handleEdit(params.row)}
              color="primary"
              size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Weekend" arrow>
            <IconButton
              onClick={() => handleDelete(params.row)}
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

  // If shiftId not passed at all
  if (!shiftId) {
    return (
      <NotPageHandle
        message="No shift selected for viewing weekend days."
        navigateTo="/create-weekend"
      />
    );
  }

  return (
    <Box m="20px">
      <Header subtitle="Currently Assigned Days" />

      <Box m="40px 0 0 0" height="75vh">
        {error ? (
          <DataGrid
            rows={[]}
            columns={columns}
            loading={loading}
            autoHeight
            components={{
              noRowsOverlay: () => (
                <Stack height="100%" alignItems="center" justifyContent="center">
                  <Typography variant="body1">No weekends found for this shift</Typography>
                </Stack>
              ),
            }}
          />
        ) : (
          <DataGrid
            rows={weekendData}
            columns={columns}
            loading={loading}
            autoHeight
            getRowId={(row) => row.id}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            components={{
              noRowsOverlay: () => (
                <Stack height="100%" alignItems="center" justifyContent="center">
                  <Typography variant="body1">No weekends found for this shift</Typography>
                </Stack>
              ),
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default ListDays;