import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import { getAllPensionRates } from "../../../Api/payrollApi";




const GetAllPensionRate = ( {refreshKey} ) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();


  const [allPayrollPeriod, SetAllPayrollPeriod] = useState([]);
  
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllPensionRate();
   
  }, [refreshKey]); 

  const fetchAllPensionRate = async () => {
    try {
      const response = await getAllPensionRates();
      SetAllPayrollPeriod(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleEditPayrollPeriod = (id) => {
    navigate('/payroll/update_pension_rate', { state: { id } });
  };

  const handleDeletePayrollPeriod = (id) => {
    navigate('/payroll/delete_pension_rate', { state: {  id } });
  };








  const columns = [
    { field: "organizationContribution", headerName: "organizationContribution", flex: 1 },
    { field: "employeesContribution", headerName: "employeesContribution", flex: 1 },
    { field: "status", headerName: "status", flex: 1 },
        { field: "date", headerName: "date", flex: 1 },

      

    
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          
       
            <Tooltip title="Delete Payroll  Period">
           <IconButton
                onClick={() => handleDeletePayrollPeriod(params.row.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>



       
            <Tooltip title="Update Payroll period">
              <IconButton
                onClick={() => handleEditPayrollPeriod(params.row.id)}
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
      <Header subtitle= "List of pension rate"/>
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={allPayrollPeriod}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default GetAllPensionRate;