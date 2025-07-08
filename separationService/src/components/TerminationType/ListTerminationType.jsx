import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { getAllTerminationTypes } from "../../Api/separationApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import Header from "../../common/Header";

const ListTerminationType = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [terminationTypes, setTerminationTypes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTerminationTypes();
  }, [refreshKey]);

  const fetchTerminationTypes = async () => {
    try {
      const response = await getAllTerminationTypes(tenantId);
      setTerminationTypes(response.data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching termination types:', error);
    }
  };

  const handleUpdate = (id) => {
    navigate('/separation/update-termination-type', { state: { terminationTypeId: id } });
  };
  const handleDelete = (id, name) => {
    navigate('/separation/delete-termination-type', { state: { terminationTypeId: id, name } });
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
           <Tooltip title="Update Termination Type">
            <IconButton
              onClick={() => handleUpdate(params.row.id)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Termination Type">
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
      <Header subtitle="List Of Termination Types" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={terminationTypes}
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default ListTerminationType;