import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import { getAllDeductionSetUp } from "../../../Api/payrollApi";

const GetAllEarningDeductionSetup = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [allEarningDeductionSetup, setAllEarningDeductionSetup] = useState([]);

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllErningDeductionSet();
  }, [refreshKey]);

  const fetchAllErningDeductionSet = async () => {
    try {
      const response = await getAllDeductionSetUp();
      setAllEarningDeductionSetup(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleEditEarningDeductionSetUp = (id) => {
    navigate("/payroll/update_earning_earning_setup", { state: { id } });
  };

  const handleDeleteEarningDeductionSetUp = (id) => {
    navigate("/payroll/delete_earning_earning_setup", { state: { id } });
  };

  const columns = [
    { field: "itemCode", headerName: "itemCode", flex: 1 },
    { field: "type", headerName: "type", flex: 1 },
    { field: "deductionOrder", headerName: "deductionOrder", flex: 1 },
    { field: "debitOrCredit", headerName: "debitOrCredit", flex: 1 },
    {
      field: "counterDebitOrCredit",
      headerName: "counterDebitOrCredit",
      flex: 1,
    },
    { field: "systemOrCostCenter", headerName: "systemOrCostCenter", flex: 1 },
    { field: "taxable", headerName: "taxable", flex: 1 },

    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Tooltip title="Delele Earning Deduction set up">
            <IconButton
              onClick={() => handleDeleteEarningDeductionSetUp(params.row.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Update Earning Deduction set up">
            <IconButton
              onClick={() => handleEditEarningDeductionSetUp(params.row.id)}
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
      <Header subtitle="List Earning Deduction set up" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={allEarningDeductionSetup}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default GetAllEarningDeductionSetup;
