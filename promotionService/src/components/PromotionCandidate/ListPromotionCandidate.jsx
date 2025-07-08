import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { fetchAllPromotionCandidate, fetchAllApprovedRecruitments, getAllEmployee } from '../../Api/ApiPromo';
import {

  IconButton,
  Tooltip,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UpgradeIcon from '@mui/icons-material/Upgrade'; // For Promote
import AssessmentIcon from '@mui/icons-material/Assessment'; // For Evaluate
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import Header from '../Header';


const ListPromotionCandidates = ({ refreshKey }) => {
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const [promotionCandidateList, setPromotionCandidateList] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const fetchData = async () => {
    try {
      const [employeesResponse, candidatesResponse, recruitmentsResponse] = await Promise.all([
        getAllEmployee(tenantId),
        fetchAllPromotionCandidate(tenantId),
        fetchAllApprovedRecruitments(tenantId),
      ]);

      const employeesData = employeesResponse.data; 
      const candidatesData = candidatesResponse.data; 
      const recruitmentsData = recruitmentsResponse.data; 

      if (!candidatesData || candidatesData.length === 0) {
        console.error('No promotion candidate found:', error);

        setLoading(false);
        return;
      }

      const mappedData = candidatesData.map((candidate) => ({
        id: candidate.id,
        name: getEmployeeName(candidate.employeeId, employeesData),
        vacancyNumber: getVacancyNumber(candidate.recruitmentId, recruitmentsData),
      }));

      setPromotionCandidateList(mappedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeName = (employeeId, employeesData) => {
    const employee = employeesData.find((emp) => emp.id === employeeId);
    return employee
      ? `${employee.firstName} ${employee.middleName || ''} ${employee.lastName}`.trim()
      : 'Unknown';
  };

  const getVacancyNumber = (recruitmentId, recruitmentsData) => {
    const recruitment = recruitmentsData.find((req) => req.id === recruitmentId);
    return recruitment ? recruitment.vacancyNumber : 'N/A';
  };

  const handleDelete = (id,name) => {
    navigate(`/promotion/deleteCandidate`, { state: { id,name } });
  };

  const handleEdit = (id,name,vacancyNumber) => {
    navigate(`/promotion/updatePromotionCandidates`, { state: { id ,name,vacancyNumber} });
  };

  const handlePromote = (id, name) => {
    navigate(`/promotion/createPromoteCandidate`, { state: { id , name } }); 
  };

  const handleEvaluate = (id, name) => {
    navigate(`/promotion/CreateCandidateEvaluation`, { state: { id, name } }); 
  };

  const columns = [
    { 
      field: 'name', 
      headerName: 'Name', 
      flex: 0.6,
      
    },
    { 
      field: 'vacancyNumber', 
      headerName: 'Vacancy Number', 
      flex: 0.6,
     
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.4,
     
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton 
              color="primary" 
              onClick={() => handleEdit(params.row.id,params.row.name,params.row.vacancyNumber)}
              sx={{ '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' }}}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton 
              color="error" 
              onClick={() => handleDelete(params.row.id,params.row.name)}
              sx={{ '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.08)' }}}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Promote">
            <IconButton
              color="success"
              onClick={() => handlePromote(params.row.id, params.row.name)}
              sx={{ '&:hover': { backgroundColor: 'rgba(46, 125, 50, 0.08)' }}}
            >
              <UpgradeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Evaluate">
            <IconButton
              color="secondary"
              onClick={() => handleEvaluate(params.row.id, params.row.name)}
              sx={{ '&:hover': { backgroundColor: 'rgba(123, 31, 162, 0.08)' }}}
            >
              <AssessmentIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];



  return (
    <Box m="20px">
    <Header subtitle="List of Promotion Criteria" />
      <Box m="40px 0 0 0" height="75vh">
      <DataGrid
        rows={promotionCandidateList}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        autoHeight
      
      />
      </Box>
     
    </Box>
  );
};

export default ListPromotionCandidates;