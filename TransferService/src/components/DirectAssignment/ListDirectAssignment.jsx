import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  getAllDirectAssignments,
  getDepartmentById,
  getAllEmployees,
  getEmployeeById,
} from "../../Api/directAssignmentApi";
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
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import Header from "../common/Header";

const ListDirectAssignment = ({ employeeId, refreshKey }) => {
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const [directAssignments, setDirectAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDirectAssignments();
    fetchEmployees();
  }, [tenantId, refreshKey]);

  const fetchDirectAssignments = async () => {
    try {
      const assignmentsResponse = await getAllDirectAssignments(tenantId);
      const assignmentsData = await Promise.all(
        assignmentsResponse.map(async (assignment) => {
          const departmentResponse = await getDepartmentById(
            tenantId,
            assignment.departmentId
          );

          const employeeResponse = await getEmployeeById(
            tenantId,
            assignment.employeeId
          );
          const fullName = `${employeeResponse.firstName} ${employeeResponse.middleName} ${employeeResponse.lastName}`;

          return {
            ...assignment,
            departmentName: departmentResponse.data.departmentName,
            employeeFullName: fullName,
          };
        })
      );

      setDirectAssignments(assignmentsData);
      setFilteredAssignments(assignmentsData);
    } catch (error) {
      console.error("Error fetching direct assignments:", error);
      setSnackbarMessage("Error fetching data");
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
    const filtered = directAssignments.filter(
      (assignment) => assignment.employeeId === employeeId
    );

    if (filtered.length === 0) {
      setSnackbarMessage(
        "No direct assignments found for the selected employee ID"
      );
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
    }

    setFilteredAssignments(filtered);
  };

  const handleDeleteClick = (assignment) => {
    navigate("/transfer/delete-direct-assignment", {
      state: { directAssignmentId: assignment.id },
    });
  };

  const handleEdit = (id) => {
    navigate("/transfer/edit-direct-assignment", {
      state: { directAssignmentId: id },
    });
  };

  const columns = [
    { field: "employeeFullName", headerName: "Employee Name", width: 250 },
    { field: "departmentName", headerName: "Department", width: 100 },
    { field: "movementType", headerName: "Movement Type", width: 150 },
    { field: "referenceNumber", headerName: "Reference Number", width: 100 },
    { field: "remark", headerName: "Remark", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex" }}>
          <Tooltip title="Edit Assignment">
            <IconButton
              color="primary"
              onClick={() => handleEdit(params.row.id)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Assignment">
            <IconButton
              color="error"
              onClick={() => handleDeleteClick(params.row)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container style={{ height: 400, width: "100%" }}>
      <Header subtitle="Direct Assignment List" />
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
            rows={filteredAssignments}
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

export default ListDirectAssignment;
