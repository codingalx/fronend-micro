import React, { useEffect, useState,useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../common/Header";
import { tokens } from "../common/theme";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { listAssessment } from "../../../configuration/RecruitmentApp";
import { Box, useTheme,Tooltip ,IconButton  } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { canAccessResource } from "../../../configuration/SecurityService";
import RecruitmentServiceResourceName from "../../../configuration/RecruitmentServiceResourceName";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';



const ListAssessementWeight = ({refreshKey}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
     const [authState] = useAtom(authAtom); 
        const userRoles = authState.roles
        const tenantId = authState.tenantId
 
  const [assessement, setAssessement] = useState([]);
  const [error, setError] = useState(null);

  
  const handleEditAssessement = (id) => {
    navigate('/recruitment/editassessement', { state: { id } });
  };
  


  useEffect(() => {
    fetchAdvertisment();
    checkPermissions();
  }, [refreshKey]);

 
  const fetchAdvertisment = async () => {
    try {
 
      const response = await listAssessment(tenantId);
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = response.data;
      setAssessement(data);
      console.log(data);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);


  const checkPermissions = async () => {
    // Check permissions for actions
    const editAccess = await canAccessResource(RecruitmentServiceResourceName.UPDATE_ASSESSMENT_WEIGHT, userRoles);
    const deleteAccess = await canAccessResource(RecruitmentServiceResourceName.DELETE_ASSESSMENT_WEIGHT, userRoles);
  
    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
  };



  const columns = [
    { field: "writtenExam", headerName: "writtenExam", flex: 1, cellClassName: "name-column--cell" },
    { field: "interview", headerName: "interview", flex: 1, cellClassName: "name-column--cell" },
    { field: "experience", headerName: "experience", flex: 1, cellClassName: "name-column--cell" },
    { field: "other", headerName: "other", flex: 1, cellClassName: "name-column--cell" },
    { field: "cgpa", headerName: "cgpa", flex: 1, cellClassName: "name-column--cell" },
    { field: "practicalExam", headerName: "practicalExam", flex: 1, cellClassName: "name-column--cell" },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
     renderCell: (params) => (
        <Box  sx={{ display: 'flex', justifyContent: 'center' }}>

          {/* {canDelete && ( */}
                 <Tooltip title="Delete Skill of Employee">
                 <IconButton onClick={() => navigate("/recruitment/deleteAssesigmentWeight", { state: { weightId: params.row.id,recruitmentId:params.row.recruitmentId } })} color="error">
                   <DeleteIcon />
                 </IconButton>
               </Tooltip>
          {/* )} */}

          {/* {canEdit && ( */}
               <Tooltip title="Update">
               <IconButton
                   onClick={() => handleEditAssessement( params.row.id)}
                 color="primary"
               >
                 <EditIcon />
               </IconButton>
             </Tooltip>
          {/* )} */}

      
          </Box>
        ),
      },
    ];
  return (
    <Box m="20px">
      <Header  subtitle="List of Assessiement Weight" />
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


export default ListAssessementWeight;
