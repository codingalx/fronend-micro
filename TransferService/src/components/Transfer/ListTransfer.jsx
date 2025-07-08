import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  getAllTransfers,
  getDepartmentById,
  getDutyStationById,
  getAllEmployees,
  getEmployeeById,
} from "../../Api/transferApi";
import {
  Container,
  CircularProgress,
  Snackbar,
  Button,
  Box,
  TextField,
  Alert,
  Autocomplete,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DecisionIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import Header from "../common/Header";
import TranferserviceResourseName from "../../Api/TranferserviceResourseName";
import { canAccessResource } from "../../Api/SecurityService";

const ListTransfer = ({ refreshKey }) => {
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const [transfers, setTransfers] = useState([]);
  const [filteredTransfers, setFilteredTransfers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();

  const [canEdit, setCanEdit] = useState(true);
  const [canDelete, setCanDelete] = useState(true);
  const [canAddMore, setCanAddMore] = useState(true);

  useEffect(() => {
    fetchTransfers();
    fetchEmployees();
    checkPermissions();
  }, [tenantId, refreshKey]);

  const checkPermissions = async () => {
    setCanEdit(
      await canAccessResource(
        TranferserviceResourseName.UPDATE_TRANSFER_REQUEST,
        userRoles
      )
    );
    setCanDelete(
      await canAccessResource(
        TranferserviceResourseName.DELETE_TRANSFER_REQUEST,
        userRoles
      )
    );
    setCanAddMore(
      await canAccessResource(
        TranferserviceResourseName.APPROVE_TRANSFER_REQUEST,
        userRoles
      )
    );
  };

  const fetchTransfers = async () => {
    try {
      const transfersResponse = await getAllTransfers(tenantId);
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
      setFilteredTransfers(transfersData);
    } catch (error) {
      console.error("Error fetching transfers:", error);
      setSnackbarMessage("Error fetching transfers");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await getAllEmployees(tenantId);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleSearch = () => {
    if (!selectedEmployee) {
      setSnackbarMessage("Please select an employee ID to search");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    const employeeId = selectedEmployee.id;
    const filtered = transfers.filter(
      (transfer) => transfer.employeeId === employeeId
    );

    if (filtered.length === 0) {
      setSnackbarMessage("No transfers found for the selected employee ID");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
    }

    setFilteredTransfers(filtered);
  };

  const handleEdit = (transferId) => {
    navigate("/transfer/edit-transfer", { state: { transferId } });
  };

  const handleDecision = (transferId) => {
    navigate("/transfer/make-decision", { state: { transferId } });
  };

  const handleDeleteClick = (transferId) => {
    navigate("/transfer/delete-transfer", { state: { transferId } });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex" }}>
          {params.row.status === "PENDING" && (
            <>
              {canEdit && (
                <Tooltip title="Edit Transfer">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(params.row.id)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )}
              {canAddMore && (
                <Tooltip title="Make Decision">
                  <IconButton
                    color="secondary"
                    onClick={() => handleDecision(params.row.id)}
                  >
                    <DecisionIcon />
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}
          {canDelete && (
            <Tooltip title="Delete Transfer">
              <IconButton
                color="error"
                onClick={() => handleDeleteClick(params.row.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Container style={{ height: 400, width: "100%" }}>
      <Header subtitle="Transfer List" />
      <Box display="flex" alignItems="center" mb={2}>
        <Autocomplete
          options={employees}
          getOptionLabel={(option) => option.employeeId || ""}
          isOptionEqualToValue={(option, value) =>
            option.employeeId === value.employeeId
          }
          onChange={(event, newValue) => setSelectedEmployee(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search by Employee ID"
              variant="outlined"
              fullWidth
            />
          )}
          sx={{ width: 300, marginRight: "10px" }}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box m="40px 0 0 0" height="75vh">
          <DataGrid
            rows={filteredTransfers}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
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
    </Container>
  );
};

export default ListTransfer;
