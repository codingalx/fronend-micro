import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { getAllOffenses, getPenalty } from "../../Api/disciplineApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import Header from "../../common/Header";

const ListOffense = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [offenses, setOffenses] = useState([]);
  const [penaltyNames, setPenaltyNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOffenses();
  }, [refreshKey]);

  const fetchOffenses = async () => {
    try {
      setLoading(true);
      const response = await getAllOffenses(tenantId);
      const offensesData = response.data;
      setOffenses(offensesData);
      
      const penaltyIds = [...new Set(
        offensesData.flatMap(offense => offense.penaltyIds || [])
      )];
      
      const names = {};
      await Promise.all(
        penaltyIds.map(async (id) => {
          try {
            const penaltyResponse = await getPenalty(tenantId, id);
            names[id] = penaltyResponse.data.name;
          } catch (error) {
            console.error(`Error fetching penalty ${id}:`, error);
            names[id] = `Unknown (${id})`;
          }
        })
      );
      
      setPenaltyNames(names);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching offenses:', error);
      setLoading(false);
    }
  };

  const handleUpdate = (id) => {
    navigate('/discipline/update-offense', { state: { offenseId: id } });
  };

  const handleDelete = (id, name) => {
    navigate('/discipline/delete-offense', { state: { offenseId: id, name } });
  };

  const renderPenalties = (params) => {
    if (!params.row.penaltyIds || params.row.penaltyIds.length === 0) {
      return 'None';
    }
    
    return params.row.penaltyIds
      .map(id => penaltyNames[id] || `Loading... (${id})`)
      .join(', ');
  };

  const columns = [
    { field: "code", headerName: "Code", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "phaseOutTime", headerName: "Phase Out Time", flex: 1 },
    { field: "weight", headerName: "Weight", flex: 1 },
    { 
      field: "penalties", 
      headerName: "Penalties", 
      flex: 2,
      renderCell: renderPenalties,
      sortable: false,
    },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="Update Offense">
            <IconButton
              onClick={() => handleUpdate(params.row.id)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Offense">
            <IconButton
              onClick={() => handleDelete(params.row.id, params.row.name)}
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
    <Box m="20px">
      <Header subtitle="List Of Offenses" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={offenses}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          autoHeight
          checkboxSelection={false}
         
        />
      </Box>
    </Box>
  );
};

export default ListOffense;