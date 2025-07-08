import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import { getAllPayrollGroup } from "../../../Api/payrollApi";

const GetAllPayRollGroup = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();


  const [allPayRoll, setAllPayRoll] = useState([]);

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllPayRollGroup();
  }, [refreshKey]);

  const fetchAllPayRollGroup = async () => {
    try {
      const response = await getAllPayrollGroup();
      setAllPayRoll(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleEditPayRollGroup = (id) => {
    navigate("/payroll/update_payroll_group", { state: { id } });
  };

  const handleDeletePayRollGroup = (id) => {
    navigate("/payroll/delete_payroll_group", { state: { id } });
  };

 

  const columns = [
    { field: "groupName", headerName: "groupName", flex: 1 },
    { field: "status", headerName: "status", flex: 1 },
    { field: "payrollFrom", headerName: "payrollFrom", flex: 1 },
    { field: "payrollTo", headerName: "payrollTo", flex: 1 },
    { field: "payrollToValid", headerName: "payrollToValid", flex: 1 },

    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Tooltip title="Delete Pay Roll group">
            <IconButton
              onClick={() => handleDeletePayRollGroup(params.row.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Update handle roll group">
            <IconButton
              onClick={() => handleEditPayRollGroup(params.row.id)}
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
      <Header subtitle="List Of payroll group" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={allPayRoll}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default GetAllPayRollGroup;
