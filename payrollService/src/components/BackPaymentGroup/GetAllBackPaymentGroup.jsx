import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import { getAllpayBackPaymentGroup } from "../../../Api/payrollApi";




const GetAllBackPaymentGroup = ( {refreshKey} ) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();


  const [backpaymentGroup, setBackpaymentGroup] = useState([]);
  
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllBackPaymentGroup();
   
  }, [refreshKey]); 

  const fetchAllBackPaymentGroup = async () => {
    try {
      const response = await getAllpayBackPaymentGroup();
      setBackpaymentGroup(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleEditBackPaymentGroup = (id) => {
    navigate('/payroll/update_backpayment_group', { state: { id } });
  };

  const handleDeleteBackPaymentGroup = (id) => {
    navigate('/payroll/delete_backpayment_group', { state: {  id } });
  };







  const columns = [
    { field: "groupName", headerName: "groupName", flex: 1 },
    { field: "payrollFrom", headerName: "payrollFrom", flex: 1 },
    { field: "payrollTo", headerName: "payrollTo", flex: 1 },
      

    
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          
       
            <Tooltip title="Delete back payment group">
           <IconButton
                onClick={() => handleDeleteBackPaymentGroup(params.row.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>



       
            <Tooltip title="Update back payment group">
              <IconButton
                onClick={() => handleEditBackPaymentGroup(params.row.id)}
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
      <Header subtitle= "List of Back payment group"/>
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={backpaymentGroup}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default GetAllBackPaymentGroup;