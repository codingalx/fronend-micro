import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { getAllPenalties } from "../../Api/disciplineApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import Header from "../../common/Header";

const ListPenalty = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  const [penalties, setPenalties] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPenalties();
  }, [refreshKey]);

  const fetchPenalties = async () => {
    try {
      const response = await getAllPenalties(tenantId);
      setPenalties(response.data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching penalties:', error);
    }
  };

  const handleUpdate = (id) => {
    navigate('/discipline/update-penalty', { state: { penaltyId: id } });
  };

  const handleDelete = (id, name) => {
    navigate('/discipline/delete-penalty', { state: { penaltyId: id, name } });
  };

  const columns = [
    { field: "name", headerName: "Penalty Name", flex: 1 },
    { field: "code", headerName: "Code", flex: 1 },
    { field: "classification", headerName: "Classification", flex: 1 },
    { field: "actionTaker", headerName: "Action Taker", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="Update Penalty">
            <IconButton
              onClick={() => handleUpdate(params.row.id)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Penalty">
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
      <Header subtitle="List Of Penalties" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={penalties}
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default ListPenalty;