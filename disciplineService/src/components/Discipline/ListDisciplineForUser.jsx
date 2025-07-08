import React, { useEffect, useState, useCallback } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../common/theme";
import Header from "../../common/Header";
import { useNavigate } from "react-router-dom";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import { getDisciplineForUser } from "../../Api/disciplineApi";
import { getEmployeeById, getEmployeeByEId } from "../../Api/disciplineApi";
import { getOffense } from "../../Api/disciplineApi";
import GavelIcon from "@mui/icons-material/Gavel"; 

const ListDisciplineForUser = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const userId = authState.username;

  const [disciplines, setDisciplines] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEmployeeId = async () => {
    try {
      const response = await getEmployeeById(tenantId, userId);
      return response.data.id;
    } catch (error) {
      setError(error.message);
      console.error("Error fetching employee ID:", error);
      throw error;
    }
  };

  const fetchUserDisciplines = async (employeeId) => {
    try {
      const response = await getDisciplineForUser(tenantId, employeeId);
      return response.data;
    } catch (error) {
      setError(error.message);
      console.error("Error fetching user disciplines:", error);
      throw error;
    }
  };

  const getEmployeeDetails = async (employeeId) => {
    try {
      const response = await getEmployeeByEId(tenantId, employeeId);
      return response.data;
    } catch (error) {
      console.error(`Error fetching employee details for ID ${employeeId}:`, error);
      return { firstName: '', middleName: '', lastName: '' };
    }
  };

  const getOffenseDetails = async (offenseId) => {
    try {
      const response = await getOffense(tenantId, offenseId);
      return response.data.name;
    } catch (error) {
      console.error(`Error fetching offense details for ID ${offenseId}:`, error);
      return "Unknown Offense";
    }
  };

  const processDisciplineData = async (disciplinesData) => {
    return await Promise.all(
      disciplinesData.map(async (discipline) => {
        const employeeData = await getEmployeeDetails(discipline.employeeId);
        const offenderData = await getEmployeeDetails(discipline.offenderId);
        const offenseName = await getOffenseDetails(discipline.offenseId);
        
        const employeeName = `${employeeData.firstName} ${employeeData.middleName || ''} ${employeeData.lastName}`.trim();
        const offenderName = `${offenderData.firstName} ${offenderData.middleName || ''} ${offenderData.lastName}`.trim();
        
        return {
          ...discipline,
          employeeName,
          offenderName,
          offenseName,
        };
      })
    );
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const employeeId = await fetchEmployeeId();
      
      const disciplinesData = await fetchUserDisciplines(employeeId);
      const processedDisciplines = await processDisciplineData(disciplinesData);
      setDisciplines(processedDisciplines);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching user discipline records:', error);
    } finally {
      setLoading(false);
    }
  }, [tenantId, userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  const handleCreateAppeal = (id, offenseName) => {
    navigate('/discipline/create-appeal', { state: { disciplineId: id, offenseName: offenseName } });
  };
  

  const columns = [
    { field: "offenderName", headerName: "Offender Name", flex: 1 },
    { field: "employeeName", headerName: "Employee Name", flex: 1 },
    { field: "offenseName", headerName: "Offense Name", flex: 1 },
    { field: "offenseDate", headerName: "Offense Date", flex: 1 },
    { field: "repetition", headerName: "Repetition", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "remark", headerName: "Remark", flex: 1 },
    { 
      field: "status", 
      headerName: "Status", 
      flex: 1,
      renderCell: (params) => {
        let color;
        switch(params.value) {
          case 'Pending':
            color = colors.yellowAccent[500];
            break;
          case 'Approved':
            color = colors.greenAccent[500];
            break;
          case 'Rejected':
            color = colors.redAccent[500];
            break;
          default:
            color = colors.grey[500];
        }
        return <span style={{ color }}>{params.value}</span>;
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {/* Only show appeal button when status is 'ACCEPT' */}
          {params.row.status === 'ACCEPT' && (
            <Tooltip title="Create Appeal">
              <IconButton
                onClick={() => handleCreateAppeal(params.row.id, params.row.offenseName)}
                color="secondary"
                sx={{ color: colors.blueAccent[500] }}
              >
                <GavelIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header subtitle="My Disciplinary Records"/>
      <Box m="40px 0 0 0" height="75vh">
        {error ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <p style={{ color: colors.redAccent[500] }}>Error loading data: {error}</p>
          </Box>
        ) : (
          <DataGrid
            rows={disciplines}
            columns={columns}
            loading={loading}
            autoHeight
            getRowId={(row) => row.id}
            checkboxSelection={false}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        )}
      </Box>
    </Box>
  );
};

export default ListDisciplineForUser;