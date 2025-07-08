import React, { useEffect, useState } from "react";
import {
  Snackbar,
  Tooltip,
  IconButton,
  Box,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import Header from "../Header";
import { fetchAllPromotionCriteria, fetchAllPromotionCriteriaName } from "../../Api/ApiPromo";

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const ListPromotionCriteria = ({ refreshKey }) => {
  const [criteriaList, setCriteriaList] = useState([]);
  const [criteriaNames, setCriteriaNames] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const fetchData = async () => {
    try {
      const [criteriaResponse, criteriaNamesResponse] = await Promise.all([
        fetchAllPromotionCriteria(tenantId),
        fetchAllPromotionCriteriaName(tenantId),
      ]);

      const mappedData = criteriaResponse.data.map((item) => ({
        ...item,
        name: getCriteriaName(item.criteriaNameId, criteriaNamesResponse.data),
      }));

      setCriteriaList(mappedData);
      setCriteriaNames(criteriaNamesResponse.data);
    } catch (error) {
      console.error("Error fetching promotion criteria:", error);
      setSnackbarMessage("Error fetching data");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const getCriteriaName = (criteriaNameId, criteriaNames) => {
    const criteria = criteriaNames.find((name) => name.id === criteriaNameId);
    return criteria ? criteria.name : "Unknown";
  };

  const handleDelete = (id,name) => navigate('/promotion/deletePromotionCriteria', { state: { promotionCriteriaId: id,name } });
  const handleEdit = (id) => navigate("/promotion/updatePromotionCriteria", { state: { promotionCriteriaId: id } });
  const handleNest = (id) => navigate("/promotion/nested-criteria", { state: { promotionCriteriaId: id } });

  const columns = [
    { field: "name", headerName: "Criteria Name", flex: 1,renderCell: (params) => (
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
    ), },
    { field: "weight", headerName: "Weight", flex: 1,renderCell: (params) => (
      <Tooltip title={params.value} arrow placement="top">
        <Box
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
            "&:hover": {
              cursor: "pointer",
            },
          }}
        >
          {params.value}
        </Box>
      </Tooltip>
    ), },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.3,
      renderCell: (params) => (
        <div style={{   gap: "1" }}>
          <Tooltip title="Update Criteria" arrow>
            <IconButton onClick={() => handleEdit(params.row.id)} color="primary" size="small">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Criteria" arrow>
            <IconButton onClick={() => handleDelete(params.row.id,params.row.name)} color="error" size="small">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="Add Nested Criteria" arrow>
            <IconButton onClick={() => handleNest(params.row.id)} color="success" size="small">
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip> */}
        </div>
      ),
    },
  ];

  return (
    <Box m="20px">
   

      <Header subtitle="List of Promotion Criteria" />
      <Box m="40px 0 0 0" height="75vh">
      <DataGrid
        rows={criteriaList}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        autoHeight
      
      />
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ListPromotionCriteria;
