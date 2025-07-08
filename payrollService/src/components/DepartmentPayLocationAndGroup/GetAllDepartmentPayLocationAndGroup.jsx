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
  listDepartement,
  getAllpayLocationGroup,
  getAllDepartementPayLocationGroup, // Assuming this API fetches pay location groups
} from "../../../Api/payrollApi";

const GetAllDepartmentPayLocationAndGroup = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  const [departmentData, setDepartmentData] = useState([]);
  const [payLocationData, setPayLocationData] = useState([]);
  const [allLeaveAdvancePayment, setAllLeaveAdvancePayment] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const fetchData = async () => {
    try {
      const [leavePaymentsResponse, departmentsResponse, payLocationsResponse] = await Promise.all([
        getAllDepartementPayLocationGroup(),
        listEmployee(tenantId),
        listDepartement(tenantId), // Fetch departments
        getAllpayLocationGroup() // Fetch pay location groups
      ]);

      const leavePayments = leavePaymentsResponse.data.map(payment => ({
        ...payment,
        departmentName: getDepartmentName(payment.departmentId, departmentsResponse.data),
        payGroup: getPayGroupName(payment.payLocationAndGroupId, payLocationsResponse.data),
       
      }));

      setAllLeaveAdvancePayment(leavePayments);
     
      setDepartmentData(departmentsResponse.data);
      setPayLocationData(payLocationsResponse.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };



  const getDepartmentName = (id, departments) => {
    const department = departments.find(dept => dept.id === id);
    return department ? department.departmentName : "Unknown"; // Return department name
  };

  const getPayGroupName = (id, payLocations) => {
    const payLocation = payLocations.find(location => location.id === id);
    return payLocation ? payLocation.payGroup : "Unknown"; // Return pay group
  };

  const handleEditDepartementPayLocationGroup = (id) => {
    navigate("/payroll/delete_departement_payLocation_group", { state: { id } });
  };

  const handleDeleteDepartementPayLocationGroup = (id) => {
    navigate("/payroll/delete_departement_payLocation_group", { state: { id } });
  };

  

  const columns = [
    { field: "system", headerName: "system", flex: 1 },
    { field: "costCenter", headerName: "costCenter", flex: 1 },
    { field: "departmentName", headerName: "Department Name", flex: 1 }, // Display department name
    { field: "payGroup", headerName: "Pay Group", flex: 1 }, // Display pay group

    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Tooltip title="Delete Departement Pay LocationGroup">
            <IconButton
              onClick={() => handleDeleteDepartementPayLocationGroup(params.row.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Update Departement Pay LocationGroup">
            <IconButton
              onClick={() => handleEditDepartementPayLocationGroup(params.row.id)}
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

export default GetAllDepartmentPayLocationAndGroup;