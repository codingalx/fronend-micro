import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme";
import {
  Tooltip,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { fetchAllPromotionCriteriaName } from "../../Api/ApiPromo";
import { authAtom } from "shell/authAtom";
import Header from "../Header";


const ListPromotion = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const [criteriaList, setCriteriaList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    
    loadCriteria();
  }, [refreshKey]);
  const loadCriteria = async () => {
    try {
      const response = await fetchAllPromotionCriteriaName(tenantId);
      if (response?.data?.length) {
        setCriteriaList(response.data);
      }
    } catch (error) {
      console.error("Error fetching promotion criteria:", error);
      
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = (criteriaNameId,name) =>
    navigate(`/promotion/deleteCriteria`, { state: { criteriaNameId , name } });
  const handleEdit = (criteriaNameId) =>
    navigate(`/promotion/updateCriteria`, { state: { criteriaNameId } });
  const handleNest = (criteriaNameId) =>
    navigate(`/promotion/nestedcriteria`, { state: { criteriaNameId } });

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 250,
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
      flex: 1.2,
      minWidth: 250,
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
      flex: 0.5,
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
          <Tooltip title="Add Weekends " arrow>
            <IconButton
              onClick={() => handleNest(params.row.id)}
              color="success"
              size="small"
             
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box
      m="20px" >
      <Header subtitle="List of Promotion Criteria" />
      <Box m="40px 0 0 0" height="75vh">
     
      
        <DataGrid
          rows={criteriaList}
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

export default ListPromotion;
