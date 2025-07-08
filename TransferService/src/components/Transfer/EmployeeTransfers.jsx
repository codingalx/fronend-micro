import { useEffect, useState } from "react";
import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import {
  getTransfersByEmployee,
  getDepartmentById,
  getDutyStationById,
  getEmployeeById,
  getEmployeeByEmployeeId,
} from "../../Api/transferApi";
import Header from "../common/Header";
import NotPageHandle from "../common/NotPageHandle";

const EmployeeTransfers = ({ refreshKey }) => {
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const username = authState.username;
  const [longEmployeeId, setLongEmployeeId] = useState("");
  const [transfers, setTransfers] = useState([]);
  const [status, setStatus] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      return;
    }
    fetchEmployeeDetails();
  }, [username]);

  useEffect(() => {
    if (longEmployeeId) {
      fetchTransfers();
    }
  }, [status, longEmployeeId, refreshKey]);

  const fetchEmployeeDetails = async () => {
    try {
      const response = await getEmployeeByEmployeeId(tenantId, username);
      setLongEmployeeId(response.id);
    } catch (error) {
      console.error(
        "Error fetching employee details:",
        error.response || error.message
      );
      setSnackbarMessage("Error fetching employee details");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const transfersResponse = await getTransfersByEmployee(
        tenantId,
        longEmployeeId,
        status
      );

      const transfersData = await Promise.all(
        transfersResponse.map(async (transfer) => {
          const departmentResponse = await getDepartmentById(
            tenantId,
            transfer.departmentId
          );
          const dutyStationResponse = await getDutyStationById(
            tenantId,
            transfer.dutyStationId
          );
          const employeeResponse = await getEmployeeById(
            tenantId,
            transfer.employeeId
          );

          return {
            ...transfer,
            departmentName: departmentResponse.data.departmentName,
            dutyStationName: dutyStationResponse.data.name,
            employeeFullName: `${employeeResponse.firstName} ${employeeResponse.middleName} ${employeeResponse.lastName}`,
          };
        })
      );
      setTransfers(transfersData);
    } catch (error) {
      console.error(
        "Error fetching transfers from the employee transfers:",
        error
      );
      setSnackbarMessage("Error fetching transfers");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleEditClick = (transferId) => {
    navigate("/transfer/update-transfer", { state: { transferId } });
  };

  const columns = [
    { field: "employeeFullName", headerName: "Employee Name", width: 250 },
    { field: "departmentName", headerName: "Department", width: 100 },
    { field: "dutyStationName", headerName: "Duty Station", width: 100 },
    { field: "transferType", headerName: "Transfer Type", width: 150 },
    { field: "status", headerName: "Status", width: 100 },
    { field: "comment", headerName: "Comment", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) =>
        params.row.status === "PENDING" && (
          <Tooltip title="Edit Transfer">
            <IconButton
              color="primary"
              onClick={() => handleEditClick(params.row.id)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        ),
    },
  ];

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (!username) {
    return (
      <NotPageHandle
        message="Employee ID is missing. Redirecting to Create Transfer..."
        navigateTo="/transfer/create-transfer"
      />
    );
  }

  return (
    <Box m="20px">
      <Header subtitle="Employee Transfers" />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt="20px"
        mb="10px"
      >
        <Box flexGrow={1} />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select value={status} onChange={handleStatusChange}>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="APPROVED">Approved</MenuItem>
            <MenuItem value="REJECTED">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box m="40px 0 0 0" height="75vh">
          <DataGrid
            rows={transfers}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            getRowId={(row) => row.id}
            checkboxSelection={false}
            disableSelectionOnClick
          />
        </Box>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeTransfers;
