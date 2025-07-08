import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import { listEmployee,listTitleName,listPayGrade } from "../../Api/employeeApi";
import { Box, useTheme, IconButton, Tooltip, TextField, Snackbar, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { useNavigate } from "react-router-dom";
import ToolbarComponent from "../common/ToolbarComponent";
import { canAccessResource } from "../../Api/SecurityService";
import EmployeeServiceResourceName from "../../Api/EmployeeServiceResourceName";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const ListEmployee = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canAddMore, setCanAddMore] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [authState] = useAtom(authAtom); // Access the shared authentication state
    const userRoles = authState.roles
    const tenantId = authState.tenantId

  useEffect(() => {
    fetchEmployees();
    checkPermissions();
  }, []);

  const fetchEmployees = async () => {
    try {
      const [employeeResponse, titleNamesResponse, payGradeNameResponse] = await Promise.all([
        listEmployee(tenantId),
        listTitleName(tenantId),
        listPayGrade(tenantId),
      ]);

      const employeeData = employeeResponse.data;
      const titleNamesData = titleNamesResponse.data;
      const payGradeNamesData = payGradeNameResponse.data;

      const mappedData = employeeData.map((employee) => ({
        ...employee,
        titleName: getTitleName(employee.titleNameId, titleNamesData),
        salary: getPayGradeName(employee.payGradeId, payGradeNamesData),
      }));

      setEmployees(mappedData);
      showNotification("Employees fetched successfully!", "success");
    } catch (error) {
      setError(error.message);
      showNotification("Failed to fetch employees. Please try again.", "error");
      console.error(error.message);
    }
  };

  const getTitleName = (titleNameId, titleNames) => {
    const title = titleNames.find((name) => name.id === titleNameId);
    return title ? title.titleName : "Unknown";
  };

  const getPayGradeName = (payGradeId, payGradeNames) => {
    const payGrade = payGradeNames.find((name) => name.id === payGradeId);
    return payGrade ? payGrade.salary : "Unknown";
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

    const handleEditEmployee = (id) => {
    navigate("/employee/editDetails", { state: { id, isEditable: true } });
  };

    const handleDetails = (id) => {
    navigate("/employee/editDetails", { state: { id, isEditable: false } });
  };

  const checkPermissions = async () => {
    setCanEdit(await canAccessResource(EmployeeServiceResourceName.UPDATE_EMPLOYEE, userRoles));
    setCanDelete(await canAccessResource(EmployeeServiceResourceName.DELETE_EMPLOYEE, userRoles));
    setCanAddMore(await canAccessResource(EmployeeServiceResourceName.ADD_ADDRESS, userRoles));
  };

  const filteredEmployees = searchTerm
    ? employees.filter((employee) => employee.employeeId.toString().includes(searchTerm))
    : employees;

  const columns = [
    { field: "employeeId", headerName: "Employee ID", flex: 1 },
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "employmentType", headerName: "Employment Type", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          {canDelete && (
            <Tooltip title="Delete Employee">
              <IconButton onClick={() => navigate("/employee/delete", { state: { employeeId: params.row.id } })} color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}

        

          {canEdit && (
            <Tooltip title="Update Employee Information">
              <IconButton onClick={() => handleEditEmployee(params.row.id)} color="primary">
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Detail">
         <IconButton onClick={() => handleDetails(params.row.id)}>
          <ReadMoreIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      
        <Box>
          <ToolbarComponent mainIconType="add" onMainIconClick={() => navigate("/employee/add")} />

          <Box m="0 0 0 0" height="75vh">
            <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mb: 2 }}>
              <TextField
                label="Search by Employee ID"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: "300px" }}
              />
            </Box>

            <DataGrid
              rows={filteredEmployees}
              columns={columns}
              getRowId={(row) => row.id}
              checkboxSelection={false}
              pageSize={100}
              // pageSizeOptions={[10, 20, 50]}
            />
          </Box>

          {error && (
            <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError(null)}>
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            </Snackbar>
          )}

          {/* Snackbar for Notifications */}
          <Snackbar 
            open={notification.open} 
            autoHideDuration={6000} 
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Positioned at top-right
          >
            <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
              {notification.message}
            </Alert>
          </Snackbar>
        </Box>
      )
    </Box>
  );
};

export default ListEmployee;






