import React, { useEffect, useState, useCallback } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { useNavigate } from "react-router-dom";
import Header from "../../common/Header";
import { getAllDisciplines, getEmployeeByEId, getOffense } from "../../Api/disciplineApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';

const ListDiscipline = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  const [allDisciplines, setAllDisciplines] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAllDisciplines = async () => {
    try {
      const response = await getAllDisciplines(tenantId);
      return response.data;
    } catch (error) {
      setError(error.message);
      console.error(error.message);
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
      const disciplinesData = await fetchAllDisciplines();
      const updatedDisciplines = await processDisciplineData(disciplinesData);
      setAllDisciplines(updatedDisciplines);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching discipline records:', error);
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchData();
  }, [refreshKey]);



  const handleDeleteDiscipline = (id, description) => {
    navigate('/discipline/delete-discipline', { state: { disciplineId: id, description: description } });
  };

  const handleApproveDiscipline = (id) => {
    navigate('/discipline/approve-discipline', { state: { disciplineId: id, tenantId } });
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
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
      
          <Tooltip title="Delete Discipline">
            <IconButton
              onClick={() => handleDeleteDiscipline(params.row.id, params.row.description)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip 
            title={
              params.row.status === 'ACCEPT' ? 'Accept - Click to modify' :
              params.row.status === 'REJECT' ? 'Reject - Click to modify' : 
              'Pending Approval - Click to approve/reject'
            }
            arrow
          >
            <IconButton
              onClick={() => handleApproveDiscipline(params.row.id)}
              color={
                params.row.status === 'ACCEPT' ? 'success' :
                params.row.status === 'REJECT' ? 'error' : 'warning'
              }
            >
              {params.row.status === 'ACCEPT' ? (
                <CheckCircleIcon />
              ) : params.row.status === 'REJECT' ? (
                <CloseIcon />
              ) : (
                <HourglassEmptyIcon />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header subtitle="List Of Disciplines"/>
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={allDisciplines}
          columns={columns}
          loading={loading}
          autoHeight
          getRowId={(row) => row.id}
          checkboxSelection={false}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>
    </Box>
  );
};

export default ListDiscipline;