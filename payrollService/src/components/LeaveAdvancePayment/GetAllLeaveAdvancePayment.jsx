import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import {
  getAllpayLeaveAdvacementPayment,
  listEmployee,
} from "../../../Api/payrollApi";

const GetAllLeaveAdvancePayment = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  const [employeeData, setEmployeeData] = useState([]);
  const [allLeaveAdvancePayment, setAllLeaveAdvancePayment] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const fetchData = async () => {
    try {
      const [leavePaymentsResponse, employeesResponse] = await Promise.all([
        getAllpayLeaveAdvacementPayment(),
        listEmployee(tenantId)
      ]);

      const leavePayments = leavePaymentsResponse.data.map(payment => ({
        ...payment,
        employeeId: getEmployeeId(payment.employeeId, employeesResponse.data) // Map employeeId
      }));

      setAllLeaveAdvancePayment(leavePayments);
      setEmployeeData(employeesResponse.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const getEmployeeId = (id, employees) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.employeeId : "Unknown"; // Return employeeId
  };

  const handleEditLeaveAdvancePayment = (id) => {
    navigate("/payroll/update_leave_advance_payment", { state: { id } });
  };

  const handleDeleteLeaveAdvancePayment = (id) => {
    navigate("/payroll/delete_leave_advance_payment", { state: { id } });
  };

  const columns = [
    { field: "startFrom", headerName: "Start From", flex: 1 },
    { field: "endTo", headerName: "End To", flex: 1 },
    { field: "employeeId", headerName: "Employee ID", flex: 1 }, // Display employeeId

    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Tooltip title="Delete leave advance payment">
            <IconButton
              onClick={() => handleDeleteLeaveAdvancePayment(params.row.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Update leave advance payment">
            <IconButton
              onClick={() => handleEditLeaveAdvancePayment(params.row.id)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header subtitle="List of Leave Advance Payments" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={allLeaveAdvancePayment}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default GetAllLeaveAdvancePayment;