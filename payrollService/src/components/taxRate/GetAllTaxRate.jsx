import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import { getAllTaxRate ,getAllBudgetYear} from "../../../Api/payrollApi";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";

const GetAllTaxRate = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); // Access the shared authentication state
  const userRoles = authState.roles;
      const tenantId = authState.tenantId

  const [allTaxRate, SetallTaxRate] = useState([]);
  const [budgetYears, setBudgetYears] = useState([]);

  const [error, setError] = useState(null);

   const getBudgetYear= (id) => {
    const budgetYear = budgetYears.find(budget => budget.id === id);
    return budgetYear ? budgetYear.budgetYear : "Unknown BudetYear";
  };

  useEffect(() => {
    fetchAllTaxRate();
    fetchAllBudgetYear();
  }, [refreshKey]);

  const fetchAllTaxRate = async () => {
    try {
      const response = await getAllTaxRate();

      const enrichedResults = response.data.map(item => ({
        ...item,
        budgetYearName: getBudgetYear(item.criteriaId),
      }));

        
      SetallTaxRate(enrichedResults);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleDeleteTaxRate = (id,) => {
    navigate("/payroll/delete_tax_rate", { state: { id } });
  };

  const handleUpdateTaxRate = (id,) => {
    navigate("/payroll/update_tax_rate", { state: { id } });
  };

  const fetchAllBudgetYear = async () => {
    try {
      const response = await getAllBudgetYear(tenantId);
      const data = response.data;
      setBudgetYears(data);
    } catch (error) {
      console.error("Error fetching fetch all budget year:", error.message);
    }
  };

  const columns = [
    { field: "fromAmount", headerName: "from Amount", flex: 1 },
    { field: "toAmount", headerName: "toAmount", flex: 1 },
    { field: "rateInPercent", headerName: "rateInPercent", flex: 1 },
    { field: "constantAmount", headerName: "constantAmount", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Tooltip title="Delete Tax Rate">
            <IconButton
              onClick={() => handleDeleteTaxRate(params.row.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="update tax rate">
            <IconButton
              onClick={() => handleUpdateTaxRate(params.row.id)}
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
      <Header subtitle="List Of Tax rate" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={allTaxRate}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default GetAllTaxRate;
