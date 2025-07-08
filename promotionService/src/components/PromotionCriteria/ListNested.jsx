import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  CircularProgress,
  Snackbar,
  Backdrop,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MuiAlert from "@mui/material/Alert";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import { fetchNestedPromotionCriteria, fetchAllPromotionCriteriaName } from "../../Api/ApiPromo";
import NotPageHandle from "../common/NotPageHandle";
const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const ListNested = ({ promotionId, refreshKey }) => {
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const [criteriaList, setCriteriaList] = useState([]);
  const [criteriaNames, setCriteriaNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const getCriteriaName = (criteriaNameId, criteriaNames) => {
    const criteria = criteriaNames.find((name) => name.id === criteriaNameId);
    return criteria ? criteria.name : "Unknown";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [criteriaResponse, criteriaNamesResponse] = await Promise.all([
          fetchNestedPromotionCriteria(tenantId, promotionId),
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
      } finally {
        setLoading(false);
      }
    };

    if (promotionId) {
      fetchData();
    }
  }, [promotionId, refreshKey]);

  const columns = [
    { field: "name", headerName: "Criteria Name", flex: 1 },
    { field: "weight", headerName: "Weight", flex: 1 },
  ];

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (!promotionId) {
    return <NotPageHandle message="No criteria selected" navigateTo="/CreatePromotionCriteria" />;
  }

  return (
    <Box m="20px">
    <Header  subtitle="List of child criteria" />
    <Box 
      m="40px 0 0 0" 
      height="75vh"
      sx={{
        width: '90%',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
          <DataGrid
            rows={criteriaList}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelection
            disableSelectionOnClick
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #e0e0e0",
              },
            }}
          />
        </Box>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ListNested;