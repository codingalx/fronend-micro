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
  listEmployee,
  getAllpayEmployeeEarningDeduction,
  getAllPayrollPeriod,
  getAllDeductionSetUp,
} from "../../../Api/payrollApi";

const GetAllEmployeeEarningDeduction = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  const [employeeEarningDeduction, setEmployeeEarningDeduction] = useState([]);
  const [allemployeeEarningDeduction, setAllemployeeEarningDeduction] = useState([]);
  const [payRollPeriodData, setPayRollPeriod] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const fetchData = async () => {
    try {
      const [allemployeeEarningDeductionResponse, payRollPeriodsResponse, earningDeductionSetUpResponse, employeesResponse] = await Promise.all([
        getAllpayEmployeeEarningDeduction(),
        getAllPayrollPeriod(),
        getAllDeductionSetUp(),
        listEmployee(tenantId),
      ]);

      const employeeEarningDeduction = allemployeeEarningDeductionResponse.data.map(deduction => ({
        ...deduction,
        itemCode: itemCodeName(deduction.earningDeductionId, earningDeductionSetUpResponse.data),
        month: PayRollmonth(deduction.payrollPeriodId, payRollPeriodsResponse.data),
        employeeId: getEmployeeId(deduction.employeeId, employeesResponse.data),
      }));

      setAllemployeeEarningDeduction(employeeEarningDeduction);
      setEmployeeData(employeesResponse.data);
      setPayRollPeriod(payRollPeriodsResponse.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const itemCodeName = (id, itemCodes) => {
    const itemCode = itemCodes.find(code => code.id === id);
    return itemCode ? itemCode.itemCode : "Unknown";
  };

  const PayRollmonth = (id, PayRollmonths) => {
    const payRollMonth = PayRollmonths.find(month => month.id === id);
    return payRollMonth ? payRollMonth.month : "Unknown";
  };

  const getEmployeeId = (id, employees) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.employeeId : "Unknown";
  };

  const handleEditEmployeeEarningDeduction = (id) => {
    navigate("/payroll/update_employee_earning_deduction", { state: { id } });
  };

  const handleDeleteEmployeeEarningDeduction = (id) => {
    navigate("/payroll/delete_employee_earning_deduction", { state: { id } });
  };

  const columns = [
    { field: "appliedFrom", headerName: "Applied From", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "paymentIn", headerName: "Payment In", flex: 1 },
    { field: "numberOfMonth", headerName: "Number of Months", flex: 1 },
    { field: "monthlyAmount", headerName: "Monthly Amount", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "employeeId", headerName: "Employee ID", flex: 1 },
    { field: "itemCode", headerName: "Item Code", flex: 1 },
    { field: "month", headerName: "Month", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Tooltip title="Delete employee earning deduction">
            <IconButton
              onClick={() => handleDeleteEmployeeEarningDeduction(params.row.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Update employee earning deduction">
            <IconButton
              onClick={() => handleEditEmployeeEarningDeduction(params.row.id)}
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
      <Header subtitle="List of Employee Earning Deduction" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={allemployeeEarningDeduction}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default GetAllEmployeeEarningDeduction;