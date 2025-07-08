
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../common/Header";
import { tokens } from "../common/theme";
import {deleteApplicantExperences, listApplicantExperences } from "../../../configuration/RecruitmentApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { Box,  useTheme,Tooltip,IconButton  } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import RecruitmentServiceResourceName from "../../../configuration/RecruitmentServiceResourceName";
import { canAccessResource } from "../../../configuration/SecurityService";


const ListApplicantExperience = ({applicantId}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
   const [authState] = useAtom(authAtom); 
  const userRoles = authState.roles
 const tenantId = authState.tenantId
  const [experence, setExperence] = useState([]);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);;
     const [canEdit, setCanEdit] = useState(false);
      const [canDelete, setCanDelete] = useState(false);
  
   const [experenceToDelete, setExperenceToDelete] = useState(null);
  
  const handleEditExperence = (applicantId, id) => {
    navigate('/recruitment/editapplicantExperence', { state: { applicantId, id } });
  };

  useEffect(() => {
    fetchExperence();
    checkPermissions();
  }, []);

  const fetchExperence = async () => {
    try {
      const response = await listApplicantExperences(tenantId,applicantId);
      const data = response.data;
      setExperence(data);
      console.log(data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };



  const checkPermissions = async () => {
    const editAccess = await canAccessResource(RecruitmentServiceResourceName.UPDATE_EXPERIENCE, userRoles);
    const deleteAccess = await canAccessResource(RecruitmentServiceResourceName.DELETE_EXPERIENCE, userRoles);
    setCanEdit(!editAccess);
    setCanDelete(!deleteAccess);
 
  };





  const columns = [
    { field: "institution", headerName: "Institution", flex: 1  ,cellClassName: "name-column--cell" },
    { field: "experienceType", headerName: "Employment Type", flex: 1 ,cellClassName: "name-column--cell" },
    { field: "jobTitle", headerName: "Job Title", flex: 1 ,cellClassName: "name-column--cell"},
    { field: "salary", headerName: "Salary", flex: 1 ,cellClassName: "name-column--cell"},
    { field: "startDate", headerName: "Start Date", flex: 1 ,cellClassName: "name-column--cell"},
    { field: "endDate", headerName: "End Date", flex: 1,cellClassName: "name-column--cell" },
    { field: "responsibility", headerName: "Responsibility", flex: 1,cellClassName: "name-column--cell" },
   
    
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
   renderCell: (params) => (
      <Box  sx={{ display: 'flex', justifyContent: 'center' }}>
     {canDelete &&
     <Tooltip title="Delete Applicant Experience ">  
     <IconButton onClick={() => navigate("/recruitment/deleteapplicantExperience", { state: { expirenceId:   params.row.id,applicantId:params.row.applicantId,
            recruitmentId:params.row.recruitmentId } })} color="error">
          <DeleteIcon />
        </IconButton>
      </Tooltip>
     }
        
    {canEdit &&
     <Tooltip title="Update">
     <IconButton
             onClick={() => handleEditExperence(applicantId, params.row.id)}
       color="primary"
     >
       <EditIcon />
     </IconButton>
   </Tooltip>

    }
          
         
   
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header subtitle="list of applicant Experience"  />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={experence}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    
    </Box>
  );
};

export default ListApplicantExperience;

