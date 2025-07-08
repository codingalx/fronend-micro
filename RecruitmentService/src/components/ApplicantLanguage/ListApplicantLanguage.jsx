import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../common/Header";
import { tokens } from "../common/theme";
import { listApplicantLanguages, listLanguageName } from "../../../configuration/RecruitmentApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { Box,  useTheme,Tooltip,IconButton  } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import RecruitmentServiceResourceName from "../../../configuration/RecruitmentServiceResourceName";
import { canAccessResource } from "../../../configuration/SecurityService";


const ListApplicantLanguage = ({applicantId}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
    const [authState] = useAtom(authAtom); 
          const userRoles = authState.roles
          const tenantId = authState.tenantId
               const [canEdit, setCanEdit] = useState(false);
                const [canDelete, setCanDelete] = useState(false);
  

  const [error, setError] = useState(null);
  const [language, setLanguage] = useState([]);
  const [languageNames, setLanguageNames] = useState([]);
  
  const handleEditLanguage = (applicantId,id) => {
    navigate('/recruitment/editapplicantLangage', { state: { applicantId, id } });
  };
  


  useEffect(() => {
    fetchData();
    checkPermissions();
  }, []);

  const fetchData = async () => {
    try {
      const [languageResponse, languageNamesResponse] = await Promise.all([
        listApplicantLanguages(tenantId,applicantId),
       listLanguageName(tenantId),
      ]);

      const languageData = languageResponse.data;
      const languageNamesData = languageNamesResponse.data;

      const mappedData = languageData.map(lang => ({
        ...lang,
        languageName: getLanguageName(lang.languageNameId, languageNamesData)
      }));

      setLanguage(mappedData);
      setLanguageNames(languageNamesData);
      console.log(mappedData);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const getLanguageName = (languageNameId, languageNames) => {
    const language = languageNames.find((lang) => lang.id === languageNameId);
    return language ? language.languageName : "Unknown";
  };

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(RecruitmentServiceResourceName.UPDATE_LANGUAGE, userRoles);
    const deleteAccess = await canAccessResource(RecruitmentServiceResourceName.DELETE_LANGUAGE, userRoles);
    setCanEdit(!editAccess);
    setCanDelete(!deleteAccess);
 
  };

  const columns = [
    { field: "languageName", headerName: "language Name", flex: 1, cellClassName: "name-column--cell" },
    { field: "reading", headerName: "Reading Level", flex: 1, cellClassName: "name-column--cell" },
    { field: "listening", headerName: "Listening Level", flex: 1, cellClassName: "name-column--cell" },
    { field: "speaking", headerName: "speaking Level", flex: 1, cellClassName: "name-column--cell" },
    { field: "writing", headerName: "writing Level", flex: 1, cellClassName: "name-column--cell" },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
     renderCell: (params) => (
        <Box  sx={{ display: 'flex', justifyContent: 'center' }}>

    {canDelete &&
     <Tooltip title="Delete Applicant Language ">  
     <IconButton onClick={() => navigate("/recruitment/deleteapplicantLanguage", { state: { languageId:   params.row.id,applicantId:params.row.applicantId,
            recruitmentId:params.row.recruitmentId } })} color="error">
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    }
           {canEdit &&
            <Tooltip title="Update">
            <IconButton
                 onClick={() => handleEditLanguage(applicantId, params.row.id)}
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
        <Header subtitle="List of applicant language"  />
        <Box m="40px 0 0 0" height="75vh">
          <DataGrid
            rows={language}
            columns={columns}
            getRowId={(row) => row.id}
            checkboxSelection={false}
          />
        </Box>
        {/* <DeleteDialog
        open={openDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this Skill of The Employee?"
      /> */}
      </Box>
    );
  };
export default ListApplicantLanguage;
