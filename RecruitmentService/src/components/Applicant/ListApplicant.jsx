import React, { useEffect, useState } from "react";
import { Box, Tooltip , useTheme, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../common/Header";
import { tokens } from "../common/theme";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { deleteApplicant, listApplicant } from "../../../configuration/RecruitmentApp";
import { canAccessResource } from "../../../configuration/SecurityService";
import RecruitmentServiceResourceName from "../../../configuration/RecruitmentServiceResourceName";
import { CheckCircleOutline } from '@mui/icons-material'; 
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

const ListApplicant = ({recruitmentId,refreshKey}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [applicantToDelete, setApplicantToDelete] = useState(null);

  const [authState] = useAtom(authAtom); 
  const userRoles = authState.roles
  const tenantId = authState.tenantId
  console.log(recruitmentId)
  
  const handleEditApplicant = (id,recruitmentId) => {
    navigate('/recruitment/editapplicant', { state: { id,recruitmentId } });
  };

  const handleMoreAbout = (recruitmentId, id) => {
    navigate('/recruitment/moreaboutapplicant', { state: { recruitmentId,id } });
  };

  const handleExamResult = (recruitmentId, id) => {
    navigate('/recruitment/examResult', { state: { recruitmentId,id } });
  };

  useEffect(() => {
    if (recruitmentId) {
      fetchApplicants(recruitmentId);
    }
    checkPermissions();
  }, [recruitmentId]);

  useEffect(() => {
  }, [refreshKey]); 

  const fetchApplicants = async (recruitmentId) => {
    try {
      const response = await listApplicant(tenantId,recruitmentId);

      setApplicants(response.data);
    } catch (error) {
      console.error("Failed to fetch applicants:", error);
    }
};


  const handleDelete = async (applicant) => {
    setApplicantToDelete(applicant);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteApplicant(tenantId,applicantToDelete.id);
      const updatedApplicant = applicants.filter((emp) => emp.id !== applicantToDelete.id);
      setApplicants(updatedApplicant);
      console.log("Applicant deleted:", applicantToDelete);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    } finally {
      setOpenDialog(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
  };

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canAddMore, setCanAddMore] = useState(false);
  const [canAccessExam, setCanAccessExam] = useState(false);



  const checkPermissions = async () => {
    // Check permissions for actions
    const examResult = await canAccessResource(RecruitmentServiceResourceName.ADD_EXAM_RESULT, userRoles);
    const editAccess = await canAccessResource(RecruitmentServiceResourceName.UPDATE_APPLICANT, userRoles);
    const deleteAccess = await canAccessResource(RecruitmentServiceResourceName.DELETE_APPLICANT, userRoles);
    const addMoreAccess = await canAccessResource(
      RecruitmentServiceResourceName.ADD_EDUCATION || RecruitmentServiceResourceName.ADD_EXPERIENCE ||
      RecruitmentServiceResourceName.ADD_TRAINING || RecruitmentServiceResourceName.ADD_REFERENCE 
      , userRoles);

    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
    setCanAddMore(addMoreAccess);
    setCanAccessExam(examResult);
  };

 

  return (
    <Box m="20px">
      <Header subtitle="Applicant List " />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={applicants}
          columns={[
            { field: "firstName", headerName: "First Name", flex: 1, cellClassName: "name-column--cell" },
            { field: "middleName", headerName: "Middle Name", flex: 1, cellClassName: "name-column--cell" },
            { field: "lastName", headerName: "Last Name", flex: 1, cellClassName: "name-column--cell" },
            { field: "dateOfBirth", headerName: "Date of Birth", flex: 1, cellClassName: "name-column--cell" },
            { field: "gender", headerName: "Gender", flex: 1, cellClassName: "name-column--cell" },
            { field: "maritalStatus", headerName: "Marital Status", flex: 1, cellClassName: "name-column--cell" },
          
            {
              field: "actions",
              headerName: "Actions",
              width: 320,
              headerAlign: 'center', // Center align the header name
              renderCell: (params) => (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  
                  {/* {canEdit && ( */}
             <Tooltip title="Update">
             <IconButton
                   onClick={() => handleEditApplicant(params.row.id)}
               color="primary"
             >
               <EditIcon />
             </IconButton>
           </Tooltip>
          
          {/* )} */}

          {/* {canDelete && ( */}
            
         <Tooltip title="Delete Applicant">  
         <IconButton onClick={() => navigate("/recruitment/deleteApplicant", { state: { applicantId: params.row.id,recruitmentId:params.row.recruitmentId } })} color="error">
         <DeleteIcon />
            </IconButton>
          </Tooltip>

          {/* // )} */}

            {/* {canAddMore && ( */}
                    <Tooltip title="More">
                    <IconButton
                          onClick={() => handleMoreAbout(recruitmentId,params.row.id)} 
                      color="primary"
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
            {/* )} */}
       {/* {canAccessExam && ( */}
           <Tooltip title="Exam Result ">
           <IconButton
                 onClick={() => handleExamResult(recruitmentId, params.row.id)}
             color="primary"
           >
             <CheckCircleOutline  />;
           </IconButton>
         </Tooltip>

       {/* )} */}

        
                </Box>
              ),
            },
          ]}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
   
    </Box>
  );
};

export default ListApplicant;






