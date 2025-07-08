import React, { useEffect, useState } from "react";
import { Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getEmployeeByEmployeId } from "../../../configuration/LeaveApi";
import { useNavigate } from "react-router-dom";
import { getAllbudgetYears, getLeaveBalance } from "../../../configuration/LeaveApi";
import Header from "../common/Header";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 



const LeaveBalance = () => {
  const navigate = useNavigate();
  const [leaveBalance, setLeaveBalance] = useState([]);
    const [authState] = useAtom(authAtom); 
    const { username } = authState;
    const tenantId = authState.tenantId
  const [employeeDetails, setEmployeeDetails] = useState("");
  const [employeeId, setEmployeeId] = useState(null);
  const [budgetYearId, setBudgetYearId] = useState(null);
  const [budgetYears, setBudgetYears] = useState([]); // Store all budget years
  const [error, setError] = useState("");

  const fetchEmployeeDetails = async () => {
    try {
      const response = await getEmployeeByEmployeId(tenantId,username);
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = response.data;
      setEmployeeDetails(data);
      setEmployeeId(data.id);
      console.log(`The employee ID is ${data.id}`);
    } catch (error) {
      console.error("Failed to fetch employee details:", error);
    }
  };

  const fetchAllBudgetYears = async () => {
    try {
      const response = await getAllbudgetYears(tenantId);
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setBudgetYears(response.data); // Set budget years list
    } catch (error) {
      console.error("Failed to fetch budget year details:", error);
    }
  };

 

  const fetchLeaveBalance = async (budgetYearId, employeeId) => {
    try {
      if (!budgetYearId || !employeeId) return;
      const response = await getLeaveBalance(tenantId,budgetYearId, employeeId);
      const data = response.data; // No need to modify if budgetYearId is unique
    
      setLeaveBalance(data);
      console.log(data);
      console.log("Leave Balance Data for DataGrid:", leaveBalance);

    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchEmployeeDetails();
    fetchAllBudgetYears();
  }, []);

  useEffect(() => {
    if (employeeId && budgetYearId) {
      fetchLeaveBalance(budgetYearId, employeeId);
    }
  }, [employeeId, budgetYearId]);
  

  const handleBudgetYearChange = (event) => {
    setBudgetYearId(event.target.value); // Set selected budget year ID
  };

  const columns = [
    { field: "remainingDays", headerName: "Total Leave Days", flex: 1 },
    { field: "totalLeaveDays", headerName: "Remaining Days", flex: 1 },

  ];

  return (
    <Box m="20px">
      <Header subtitle="Calculate Leave Balance " />
      <FormControl variant="outlined" sx={{ minWidth: 200, marginBottom: 0 }}>
        <InputLabel id="budget-year-label">Select Budget Year</InputLabel>
        <Select
          labelId="budget-year-label"
          value={budgetYearId || ""}
          onChange={handleBudgetYearChange}
          label="Select Budget Year"
        >
          {budgetYears.map((year) => (
            <MenuItem key={year.id} value={year.id}>
              {year.budgetYear} 
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Leave balance data grid */}
      <Box m="40px 0 0 0" height="75vh">
      <Box m="40px 0 0 0" height="75vh">
      <DataGrid
  rows={Array.isArray(leaveBalance) ? leaveBalance : [leaveBalance]} // Ensure rows is an array
  columns={columns}
  getRowId={(row) => row.id} // Ensure the ID field matches the unique field in your data
  checkboxSelection={false}
/>

</Box>


      </Box>
    </Box>
  );
};

export default LeaveBalance;
