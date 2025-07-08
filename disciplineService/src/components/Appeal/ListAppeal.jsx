import React, { useEffect, useState } from "react";
import { 
  Box, 
  useTheme,
  IconButton,
  Tooltip 
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../common/theme";
import Header from "../../common/Header";
import { getAllAppeals, getAllDisciplines, getAllOffenses } from "../../Api/disciplineApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ListAppeal = ({ refreshKey ,disciplineId}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const navigate = useNavigate();

  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all necessary data
        const appealsResponse = await getAllAppeals(tenantId);
        const disciplinesResponse = await getAllDisciplines(tenantId);
        const offensesResponse = await getAllOffenses(tenantId);

        // Create maps for quick lookup
        const disciplineMap = new Map(disciplinesResponse.data.map(d => [d.id, d]));
        const offenseMap = new Map(offensesResponse.data.map(o => [o.id, o]));

        // Combine the data
        const combinedAppeals = appealsResponse.data.map(appeal => {
          const discipline = disciplineMap.get(appeal.disciplineId);
          const offense = discipline ? offenseMap.get(discipline.offenseId) : null;
          
          return {
            ...appeal,
            offenseName: offense?.name || "Unknown Offense",
            disciplineStatus: discipline?.status || "Unknown Status",
            createdAt: new Date(appeal.createdAt).toLocaleString(),
          };
        });

        setAppeals(combinedAppeals);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tenantId,refreshKey]);

  const handleUpdate = (id, offenseName) => {
    navigate('/discipline/update-appeal', { 
      state: { 
        appealId: id,
        offenseName: offenseName ,// Include offense name in state
      } 
    });
  };

  const handleDelete = (id, offenseName, remark) => {
    navigate('/discipline/delete-appeal', { 
      state: { 
        appealId: id,
        offenseName: offenseName, // Include offense name in state
        remark: remark ,
        disciplineId:disciplineId

      } 
    });
  };

  const columns = [
    { 
      field: "offenseName", 
      headerName: "Offense", 
      flex: 1,
    },
    { 
      field: "remark", 
      headerName: "Remark", 
      flex: 1 
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="Update Appeal">
            <IconButton
              onClick={() => handleUpdate(params.row.id, params.row.offenseName)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Appeal">
            <IconButton
              onClick={() => handleDelete(params.row.id, params.row.offenseName, params.row.remark)}
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
      <Header subtitle="List of Appeals" />
      <Box
        m="40px 0 0 0"
        height="75vh"
      >
        <DataGrid
          rows={appeals}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          checkboxSelection={false}
          pageSize={10}
          autoHeight
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Box>
    </Box>
  );
};

export default ListAppeal;