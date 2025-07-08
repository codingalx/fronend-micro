import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
// import { tokens } from "../theme";
import {
  Tooltip,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { getAllExcuse } from "../../Api/Attendance-Api";
import Header from "../Header";
// import Header from "../Header";


const ListExcuse = ({ refreshKey }) => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const [authState] = useAtom(authAtom);
//   const tenantId = authState.tenantId;
  const [excuseList, setExcuseList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    
    loadExcuses();
  }, [refreshKey]);
  const loadExcuses = async () => {
    try {
      const response = await getAllExcuse();
      if (response?.data?.length) {
        setExcuseList(response.data);
      }
    } catch (error) {
      console.error("Error fetching Excuses :", error);
      
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = (ExcuseId,name) =>
    navigate(`/attendance/delete-excuse`, { state: { ExcuseId , name } });
  const handleEdit = (ExcuseId) =>
    navigate(`/attendance/update-excuse`, { state: { ExcuseId } });
 

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 0.8,
      minWidth: 200,
      renderCell: (params) => (
        <Tooltip title={params.value} arrow placement="top">
          <Box
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "100%",
              "&:hover": {
                // backgroundColor: colors.primary[800],
                cursor: "pointer",
              },
            }}
          >
            {params.value}
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <Tooltip title={params.value} arrow placement="top">
          <Box
            sx={{
              whiteSpace: "normal",
              wordWrap: "break-word",
              padding: "8px",
              lineHeight: "1.5",
              maxHeight: "3em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              width: "100%",
              "&:hover": {
                // backgroundColor: colors.primary[800],
                cursor: "pointer",
              },
            }}
          >
            {params.value}
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.4,
      // minWidth:260,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
          <Tooltip title="Update Criteria" arrow>
            <IconButton
              onClick={() => handleEdit(params.row.id)}
              color="primary"
              size="small"
             
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Criteria" arrow>
            <IconButton
              onClick={() => handleDelete(params.row.id,params.row.name)}
              color="error"
              size="small"
              
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
       
        </Box>
      ),
    },
  ];

  return (
    <Box
      m="20px" >
      <Header subtitle="List of Excuses" />
      <Box m="40px 0 0 0" height="75vh">
     
      
        <DataGrid
          rows={excuseList}
          columns={columns}
          loading={loading}
          autoHeight
          getRowId={(row) => row.id}
          pageSize={5}
          
          rowsPerPageOptions={[5, 10, 20]}
        />
       </Box>
   
      </Box>
    
  );
};

export default ListExcuse;
