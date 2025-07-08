import React, { useEffect, useState, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import { useNavigate } from "react-router-dom";
import { listExamResult } from "../../../configuration/RecruitmentApp";
import { Box, Button, useTheme, Tooltip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RecruitmentServiceResourceName from "../../../configuration/RecruitmentServiceResourceName";
import { canAccessResource } from "../../../configuration/SecurityService";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';

const ListExamResult = ({ recruitmentId, applicantId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [assessement, setAssessement] = useState([]);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [assessementToDelete, setAssessementToDelete] = useState(null);
  const [authState] = useAtom(authAtom); 
  const userRoles = authState.roles;
  const tenantId = authState.tenantId;
  
  const handleEditExamResult = (id) => {
    navigate('/recruitment/editExamresult', { state: { recruitmentId, applicantId, id } });
  };

  useEffect(() => {
    fetchListOfExamResult();
    checkPermissions();
  }, []);

  const fetchListOfExamResult = async () => {
    try {
      const response = await listExamResult(tenantId, recruitmentId);
      const data = response.data;
      setAssessement(data);
      console.log(data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(RecruitmentServiceResourceName.UPDATE_EXAM_RESULT, userRoles);
    const deleteAccess = await canAccessResource(RecruitmentServiceResourceName.DELETE_EXAM_RESULT, userRoles);
  
    setCanEdit(!editAccess);
    setCanDelete(!deleteAccess);
  };

  const columns = [
    { field: "writtenExam", headerName: "Written Exam", flex: 1, cellClassName: "name-column--cell" },
    { field: "interview", headerName: "Interview", flex: 1, cellClassName: "name-column--cell" },
    { field: "experience", headerName: "Experience", flex: 1, cellClassName: "name-column--cell" },
    { field: "other", headerName: "Other", flex: 1, cellClassName: "name-column--cell" },
    { field: "cgpa", headerName: "CGPA", flex: 1, cellClassName: "name-column--cell" },
    { field: "total", headerName: "Total", flex: 1, cellClassName: "name-column--cell" },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {canDelete && (
            <Tooltip title="Delete Reference of Employer">  
              <IconButton onClick={() => navigate("/recruitment/deleteApplicantExamResult", { state: { examresultId: params.row.id, applicantId: params.row.applicantId, recruitmentId: params.row.recruitmentId } })} color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          {canEdit && (
            <Tooltip title="Update">
              <IconButton onClick={() => handleEditExamResult(params.row.id)} color="primary">
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  
  const id = recruitmentId

  return (
    <Box m="20px">
      <Button variant="contained" color="primary" onClick={() => navigate('/recruitment/more', { state: {  id } })} sx={{ mb: 2 }}>
        Back
      </Button>
      
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={assessement}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default ListExamResult;