import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import { getAllpayLocationGroup } from "../../../Api/payrollApi";




const GetAllPayLocationAndGroup = ( {refreshKey} ) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();


  const [allPayLocationGroup, setallPayLocationGroup] = useState([]);
  
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllPensionRate();
   
  }, [refreshKey]); 

  const fetchAllPensionRate = async () => {
    try {
      const response = await getAllpayLocationGroup();
      setallPayLocationGroup(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleEditPayLocationGroup = (id) => {
    navigate('/payroll/update_paylocation_group', { state: { id } });
  };

  const handleDeletePayLocationGroup = (id) => {
    navigate('/payroll/delete_paylocation_group', { state: {  id } });
  };








  const columns = [
    { field: "payLocation", headerName: "payLocation", flex: 1 },
    { field: "payGroup", headerName: "payGroup", flex: 1 },
   
    
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          
       
            <Tooltip title="Delete Pay location Group">
           <IconButton
                onClick={() => handleDeletePayLocationGroup(params.row.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>



       
            <Tooltip title="Update Pay location group">
              <IconButton
                onClick={() => handleEditPayLocationGroup(params.row.id)}
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
      <Header subtitle= "List of Pay location group "/>
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={allPayLocationGroup}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default GetAllPayLocationAndGroup;