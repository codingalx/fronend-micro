
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../common/Header";
import { tokens } from "../common/theme";
import { useNavigate } from "react-router-dom";
import { listApplicantEducations, listFieldStudies, listEducationLevels } from "../../../configuration/RecruitmentApp";
import { Box,  useTheme,Tooltip,IconButton  } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import RecruitmentServiceResourceName from "../../../configuration/RecruitmentServiceResourceName";
import { canAccessResource } from "../../../configuration/SecurityService";



const ListApplicantEducation = ({applicantId}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
   const [authState] = useAtom(authAtom); 
      const userRoles = authState.roles
      const tenantId = authState.tenantId


  const [education, setEducation] = useState([]);
  const [error, setError] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);;
  const [educationLevels, setEducationLevels] = useState([]);
  const [fieldOfStudies, setFieldOfStudies] = useState([]);

    const [canEdit, setCanEdit] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
  
  


  
  useEffect(() => {
    fetchApplicant();
    checkPermissions();
  }, []);

  const fetchApplicant = async () => {
    try {
      const [applicantEducationResponse,
         fieldofStudyResponse,
         educationLevelResponse] = await Promise.all([
        listApplicantEducations(tenantId,applicantId),
      listFieldStudies(tenantId),
      listEducationLevels(tenantId),
      ]);

      const applicantEducationData = applicantEducationResponse.data;
      const fieldofStudyData = fieldofStudyResponse.data;
      const educationLevelData = educationLevelResponse.data;

      const mappedData = applicantEducationData.map(lang => ({
        ...lang,
        fieldOfStudy: getFieldOfStudies(lang.fieldOfStudyId, fieldofStudyData),
        educationLevelName: getEducationLevel(lang.educationLevelId, educationLevelData)
      }));

      setEducation(mappedData);
      setEducationLevels(educationLevelData);
      setFieldOfStudies(fieldofStudyData);

      console.log(mappedData);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const getEducationLevel = (educationLevelId, educationLevels) => {
    const education = educationLevels.find((lang) => lang.id === educationLevelId);
    return education ? education.educationLevelName : "Unknown";
  };
  const getFieldOfStudies = (fieldOfStudyId, fieldOfStudies) => {
    const field = fieldOfStudies.find((lang) => lang.id === fieldOfStudyId);
    return field ? field.fieldOfStudy : "Unknown";
  };

  const handleEditEducation = (applicantId, id) => {
    navigate('/recruitment/editapplicantEducation', { state: { applicantId, id } });
  };


  const checkPermissions = async () => {
    const editAccess = await canAccessResource(RecruitmentServiceResourceName.UPDATE_EDUCATION, userRoles);
    const deleteAccess = await canAccessResource(RecruitmentServiceResourceName.DELETE_EDUCATION, userRoles);
    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
 
  };

  
  
  

  const columns = [
    { field: "educationLevelName", headerName: "Education Level", flex: 1  ,cellClassName: "name-column--cell" },
    { field: "fieldOfStudy", headerName: "Field of Study", flex: 1  ,cellClassName: "name-column--cell" },
    { field: "educationType", headerName: "Education Type", flex: 1 ,cellClassName: "name-column--cell" },
    { field: "institution", headerName: "institution", flex: 1 ,cellClassName: "name-column--cell"},
    { field: "startDate", headerName: "Start Date", flex: 1 ,cellClassName: "name-column--cell"},
    { field: "endDate", headerName: "End Date", flex: 1,cellClassName: "name-column--cell" },
    { field: "result", headerName: "result", flex: 1,cellClassName: "name-column--cell" },
   { field: "fileName", headerName: "Document", flex: 1 ,cellClassName: "name-column--cell"},
    
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
   renderCell: (params) => (
      <Box  sx={{ display: 'flex', justifyContent: 'center' }}>
        {/* {canDelete && */}
        
        <Tooltip title="Delete Applicant Education ">  
         <IconButton onClick={() => navigate("/recruitment/deleteapplicantEducation", { state: { educationId:   params.row.id,applicantId:params.row.applicantId,
                recruitmentId:params.row.recruitmentId } })} color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        {/* } */}

        {/* {canEdit && */}
        <Tooltip title="Update">
        <IconButton
              onClick={() => handleEditEducation(applicantId, params.row.id)}
          color="primary"
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
        {/* } */}

        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header subtitle="list of applicant Education" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={education}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default ListApplicantEducation;

