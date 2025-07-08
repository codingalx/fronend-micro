import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {  Box,  IconButton } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  fetchAllPromotionCandidate,
  fetchAllCandidateEvaluation,
  fetchPromotionCriteriaById,
  fetchPromotionCriteriaNameById,
  getEmployeeByEmployeId
} from '../../Api/ApiPromo';
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';



const ListCandidateEvaluation = ({refreshKey}) => {
  const navigate = useNavigate();
  const location = useLocation();
 
  const [authState] = useAtom(authAtom);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);

  const tenantId = authState.tenantId;


  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const candidatesResponse = await fetchAllPromotionCandidate(tenantId);
      const candidatesData = candidatesResponse.data;

      const enrichedEvaluations = [];
      for (const candidate of candidatesData) {
        try {

          const evaluationsResponse = await fetchAllCandidateEvaluation(tenantId, candidate.id);
          const evaluationsData = evaluationsResponse.data;

          const employeeResponse = await getEmployeeByEmployeId(tenantId, candidate.employeeId);
          const employeeData = employeeResponse.data;

          if (employeeData) {
            for (const evaluation of evaluationsData) {
              const criteriaResponse = await fetchPromotionCriteriaById(tenantId, evaluation.criteriaId);
              const criteriaData = criteriaResponse.data;

              const criteriaNameResponse = await fetchPromotionCriteriaNameById(tenantId, criteriaData.criteriaNameId);
              const criteriaNameData = criteriaNameResponse.data;

              enrichedEvaluations.push({
                id: evaluation.id,
                candidateName: `${employeeData.firstName} ${employeeData.middleName || ''} ${employeeData.lastName}`.trim(),
                criteriaName: criteriaNameData.name, 
                result: evaluation.result,
                candidateId: evaluation.candidateId,
              });
            }
          } else {
            console.error(`Employee data not found for candidate ${candidate.id}`);
           
          }
        } catch (error) {
          console.error(`Error fetching evaluations for candidate ${candidate.id}:`, error);
         
        }
      }

      setEvaluations(enrichedEvaluations);
    } catch (error) {
      console.error('Error fetching data:', error);
     
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (evaluationId, candidateId,candidateName) => {
    navigate('/promotion/deleteevaluation', {
      state: { evaluationId, candidateId ,candidateName},
    });
  };

  const handleUpdate = (evaluationId, candidateId, candidateName,criteriaName, result) => {
    navigate('/promotion/editevaluation', {
      state: { evaluationId, candidateId, candidateName, criteriaName,result },
    });
  };
 

  const columns = [
    { field: 'candidateName', headerName: 'Candidate Name', flex: 1 },
    { field: 'criteriaName', headerName: 'Criteria Name', flex: 1 },
    { field: 'result', headerName: 'Result', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.6,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleUpdate(params.row.id, params.row.candidateId, params.row.candidateName , params.row.criteriaName, params.row.result)}>
  <EditIcon color="primary" />
</IconButton>

          <IconButton onClick={() => handleDelete(params.row.id, params.row.candidateId, params.row.candidateName ,params.row.result )}>
            <DeleteIcon color="error" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box m="20px">
      
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={evaluations}
          columns={columns}
          pageSize={5}
          autoHeight
          rowsPerPageOptions={[5, 10, 20]}
          loading={loading}
          
        />
      </Box>
    
    </Box>
  );
};

export default ListCandidateEvaluation;
