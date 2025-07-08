import React, { useEffect, useState } from "react";
import {
  Box, useTheme, Tooltip, IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import LayoutForCourse from '../TrainingCourse/LayoutForCourse'
import { listTrainingInstution, listLocation, deleteTrainingInstution  } from "../../../configuration/TrainingApi";
import Header from "../common/Header";
import TrainingServiceResourceName from "../../../configuration/TrainingServiceResourceName";
import {canAccessResource} from '../../../configuration/SecurityService'
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';




const ListTrainingInstution = ({refreshKey}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [trainingInstution, setTrainingInstution] = useState([]);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);
    const [authState] = useAtom(authAtom);
    const tenantId = authState.tenantId
  const userRoles = authState.roles;


  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);


  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const editAccess = await canAccessResource(
          TrainingServiceResourceName.UPDATE_INSTITUTION,
          userRoles
        );
        const deleteAccess = await canAccessResource(
          TrainingServiceResourceName.DELETE_INSTITUTION,
          userRoles
        );
        
      
  
        setCanEdit(!editAccess );
        setCanDelete(!deleteAccess );
      
      } catch (err) {
        console.error("Error checking permissions:", err.message);
        // Fallback to false if there's an error
        setCanEdit(false);
        setCanDelete(false);
       
      }
    };
  
    fetchPermissions();
  }, [userRoles]); // Re-run if user roles change


  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const fetchData = async () => {
    try {
      const [trainingInstutionResponse, locationsResponse] = await Promise.all([
        listTrainingInstution(tenantId),
       listLocation(tenantId),
      ]);
      const trainingInstutionData = trainingInstutionResponse.data;
      const locationsData = locationsResponse.data;

      const mappedData = trainingInstutionData.map((institution) => ({
        ...institution,
        locationName: getLocationName(institution.locationId, locationsData),
      }));

      setTrainingInstution(mappedData);
      setLocations(locationsData);
      console.log(mappedData);
    } catch (error) {
      setError(error.message);
    }
  };

  const getLocationName = (locationId, locationsData) => {
    const location = locationsData.find((location) => location.id === locationId);
    return location ? location.locationName : "Unknown";
  };

  

 







  const handleCourseTraining = (id) => {
    navigate('/training/updateTrainingInstution', { state: { id } });
  };
  


  const columns = [
    { field: "institutionName", headerName: "Institution Name", flex: 1 },
    { field: "locationName", headerName: "Location Name", flex: 1 },
    { field: "costPerPerson", headerName: "Cost Per Person", flex: 1 },
    { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>

         {canDelete && (
          <Tooltip title="Delete Intitution ">
          <IconButton onClick={() => navigate("/training/delete_instution", { state: { instutionId: params.row.id } })} color="error">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
      

      
         {canEdit && 
         <Tooltip title="Update Instution">
         <IconButton onClick={() => handleCourseTraining(params.row.id)} color="primary">
           <EditIcon />
         </IconButton>
       </Tooltip>
         }
        
        </Box>
      ),
    },
  ];

  return (
    <LayoutForCourse subtitle="List Of Courses">
      <Header  subtitle="List of  Training Instution" />
     
      <DataGrid
        rows={trainingInstution}
        columns={columns}
        getRowId={(row) => row.id}
        checkboxSelection={false}
      />
      {/* <DeleteDialog
        open={openDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this course?"
      /> */}
    </LayoutForCourse>
  );
};

export default ListTrainingInstution;





