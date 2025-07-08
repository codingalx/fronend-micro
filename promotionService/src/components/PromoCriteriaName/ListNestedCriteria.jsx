import React, { useState, useEffect } from "react";
import {
  Box,
 
  IconButton,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MuiAlert from "@mui/material/Alert";
import { useAtom } from "jotai";
import Header from "../Header";
import { authAtom } from "shell/authAtom";
import { fetchExistingNestedCriteriaName ,updatePromotionCriteriaName,deletePromotionCriteriaName} from "../../Api/ApiPromo";
import NotPageHandle from "../common/NotPageHandle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";


const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const ListNestedCriteria = ({ refreshKey, criteriaNameId }) => {
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const [nestedCriteria, setNestedCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  

  useEffect(() => {
    const fetchNestedCriteria = async () => {
      try {
        setLoading(true);
        const response = await fetchExistingNestedCriteriaName(
          tenantId,
          criteriaNameId
        );
        setNestedCriteria(response.data || []);
      } catch (error) {
        console.error("Error fetching Nested criteria:", error);
       
      } finally {
        setLoading(false);
      }
    };

    if (criteriaNameId) {
      fetchNestedCriteria();
    }
  }, [criteriaNameId, refreshKey, tenantId]);

  if (!criteriaNameId) {
    return <NotPageHandle message="No criteria selected for nested criteria" navigateTo="/name" />;
  }



  const handleDelete = (criteriaNameId,id,name) =>
    navigate(`/promotion/deleteChildCriteria`, { state: { criteriaNameId ,id,name} });
  const handleEdit = (criteriaNameId,id) =>
    navigate(`/promotion/editednestedcriteria`, { state: { criteriaNameId,id } });

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1.2,
      renderCell: (params) => (
        <Tooltip title={params.value} arrow placement="top">
          <Box
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "100%",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.05)",
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
                backgroundColor: "rgba(0, 0, 0, 0.05)",
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
      minWidth: 260,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Tooltip title="Edit" arrow placement="top">
            <IconButton
              onClick={() => handleEdit(criteriaNameId,params.row.id)}
              size="small"
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" arrow placement="top">
            <IconButton
              onClick={() => handleDelete(criteriaNameId,params.row.id,params.row.name)}
              size="small"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box
      m="20px"
      
    >
      <Header subtitle="List of Nested Criteria" />
      <Box m="40px 0 0 0" height="75vh">
      <DataGrid
          rows={nestedCriteria}
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

export default ListNestedCriteria;
