import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../common/Header";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { listApplicantCertificate, deleteApplicantCertificate } from "../../../configuration/RecruitmentApp";
import { Box,  useTheme,Tooltip,IconButton  } from "@mui/material";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import RecruitmentServiceResourceName from "../../../configuration/RecruitmentServiceResourceName";
import { canAccessResource } from "../../../configuration/SecurityService";

const ListApplicantCertificate = ({applicantId}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState([]);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);;
  const [certificateToDelete, setCertificateToDelete] = useState(null);
     const [authState] = useAtom(authAtom); 
     console.log(applicantId)
          

       const userRoles = authState.roles
            const tenantId = authState.tenantId
                 const [canEdit, setCanEdit] = useState(false);
                  const [canDelete, setCanDelete] = useState(false);
  
  const handleEditTraning = (applicantId, id) => {
    navigate('/recruitment/editapplicantCertificate', { state: { applicantId, id } });
  };

  useEffect(() => {
    fetchApplicantcertificate();
    checkPermissions();
  }, [applicantId]);

  const fetchApplicantcertificate = async () => {
    try {
      const response = await listApplicantCertificate(tenantId,applicantId);
      const data = response.data;
      setCertificate(data);
      console.log(data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };


  const checkPermissions = async () => {
    const editAccess = await canAccessResource(RecruitmentServiceResourceName.UPDATE_TRAINING, userRoles);
    const deleteAccess = await canAccessResource(RecruitmentServiceResourceName.DELETE_TRAINING, userRoles);
    setCanEdit(!editAccess);
    setCanDelete(!deleteAccess);
 
  };



  const handleCancelDelete = () => {
    setOpenDialog(false);
  };

 
  const columns = [
    { field: "trainingTitle", headerName: "Training Title", flex: 1, cellClassName: "name-column--cell" },
  { field: "institution", headerName: "Institution", flex: 1, cellClassName: "name-column--cell" },
  { field: "sponsoredBy", headerName: "Sponsored By", flex: 1, cellClassName: "name-column--cell" },
  { field: "startDate", headerName: "Start Date", flex: 1, cellClassName: "name-column--cell" },
  { field: "endDate", headerName: "End Date", flex: 1, cellClassName: "name-column--cell" },
 
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
   renderCell: (params) => (
      <Box  sx={{ display: 'flex', justifyContent: 'center' }}>
    
    {canDelete &&
      <Tooltip title="Delete Applicant Reference ">  
      <IconButton onClick={() => navigate("/recruitment/deleteapplicantCertificate", { state: { certificateId:   params.row.id,applicantId:params.row.applicantId,
             recruitmentId:params.row.recruitmentId } })} color="error">
           <DeleteIcon />
         </IconButton>
       </Tooltip>

    }

    {canEdit &&
          <Tooltip title="Update">
          <IconButton
                onClick={() => handleEditTraning(applicantId, params.row.id)}
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
      <Header subtitle="Certificates of applicants" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={certificate}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
      {/* <DeleteDialog
        open={openDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      /> */}
    </Box>
  );
};

export default ListApplicantCertificate;
