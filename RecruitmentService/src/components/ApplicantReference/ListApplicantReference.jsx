import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../common/Header";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { Box,  useTheme,Tooltip,IconButton  } from "@mui/material";
import { listApplicantReferences, deleteApplicantReferences } from "../../../configuration/RecruitmentApp";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import RecruitmentServiceResourceName from "../../../configuration/RecruitmentServiceResourceName";
import { canAccessResource } from "../../../configuration/SecurityService";



const ListApplicantReference = ({applicantId}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
 const [authState] = useAtom(authAtom); 
          const userRoles = authState.roles
          const tenantId = authState.tenantId
               const [canEdit, setCanEdit] = useState(false);
                const [canDelete, setCanDelete] = useState(false);

  const [reference, setReference] = useState([]);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);;
  const [referenceToDelete, setReferenceToDelete] = useState(null);
  
  const handleEditReference = (applicantId, id) => {
    navigate('/recruitment/editapplicantReference', { state: { applicantId, id } });
  };
  

  useEffect(() => {
    fetchReference();
    checkPermissions();
  }, []);

  const fetchReference = async () => {
    try {
      const response = await listApplicantReferences(tenantId,applicantId);
      const data = response.data;
      setReference(data);
      console.log(data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };





  

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(RecruitmentServiceResourceName.UPDATE_REFERENCE, userRoles);
    const deleteAccess = await canAccessResource(RecruitmentServiceResourceName.DELETE_REFERENCE, userRoles);
    setCanEdit(!editAccess);
    setCanDelete(!deleteAccess);
 
  };
 
  const columns = [
    { field: "fullName", headerName: "FullName", flex: 1, cellClassName: "name-column--cell" },
  { field: "phoneNumber", headerName: "phoneNumber", flex: 1, cellClassName: "name-column--cell" },
  { field: "jobTitle", headerName: "jobTitle", flex: 1, cellClassName: "name-column--cell" },
  { field: "workAddress", headerName: "workAddress", flex: 1, cellClassName: "name-column--cell" },
  { field: "email", headerName: "email", flex: 1, cellClassName: "name-column--cell" },
  { field: "description", headerName: "description", flex: 1, cellClassName: "name-column--cell" },
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
   renderCell: (params) => (
      <Box  sx={{ display: 'flex', justifyContent: 'center' }}>
        
    {canDelete &&
      <Tooltip title="Delete Applicant Reference ">  
      <IconButton onClick={() => navigate("/recruitment/deleteapplicantReference", { state: { refrenceId:   params.row.id,applicantId:params.row.applicantId,
             recruitmentId:params.row.recruitmentId } })} color="error">
           <DeleteIcon />
         </IconButton>
       </Tooltip>
    }
         {canEdit &&
           <Tooltip title="Update">
           <IconButton
                 onClick={() => handleEditReference(applicantId, params.row.id)}
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
      <Header subtitle="List of applicant references" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={reference}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
     
      />
        
      </Box>
    </Box>
  );
};

export default ListApplicantReference;
