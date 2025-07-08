import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton, Snackbar, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { getEmployeeRetirements, getEmployeeByEId } from "../../Api/separationApi";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import Header from "../../common/Header";

const ListRetirementUser = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  const [retirements, setRetirements] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const fetchData = async () => {
    try {
   
      const response = await getEmployeeRetirements(tenantId);
      const retirementsData = response.data;

    
      const updatedRetirements = await Promise.all(
        retirementsData.map(async (retirement) => {
          const employeeResponse = await getEmployeeByEId(tenantId, retirement.employeeId);
          const employeeData = employeeResponse.data;
          const employeeName = `${employeeData.firstName} ${employeeData.middleName || ""} ${employeeData.lastName}`.trim();

          return {
            ...retirement,
            employeeName, 
          };
        })
      );

      setRetirements(updatedRetirements);
    } catch (error) {
      console.error("Error fetching retirement records or employee details:", error);
      setNotification({
        open: true,
        message: "Failed to fetch retirement records or employee details.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    const retirement = retirements.find((retirement) => retirement.id === id);

    if (retirement.status === "APPROVED" || retirement.status === "REJECTED") {
      setNotification({
        open: true,
        message: `Cannot delete a retirement request that is already ${retirement.status.toLowerCase()}.`,
        severity: "error",
      });
    } else {
      navigate("/separation/delete-retirement", { state: { retirementId: id } });
    }
  };

  const handleUpdate = (id) => {
    navigate("/separation/update-retirement", { state: { retirementId: id } });
  };

  const columns = [
    { field: "employeeName", headerName: "Employee Name", flex: 1 },
    { field: "retirementType", headerName: "Retirement Type", flex: 1 },
    { field: "retirementDate", headerName: "Retirement Date", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "remark", headerName: "Remark", flex: 1.5 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {params.row.status === "PENDING" && (
            <Tooltip title="Edit Retirement" arrow>
              <IconButton onClick={() => handleUpdate(params.row.id)} color="primary">
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}

          {params.row.status === "PENDING" && (
            <Tooltip title="Delete Retirement" arrow>
              <IconButton onClick={() => handleDelete(params.row.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header subtitle="List " />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={retirements}
          columns={columns}
          loading={loading}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
          getRowId={(row) => row.id} 
        />
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ListRetirementUser;