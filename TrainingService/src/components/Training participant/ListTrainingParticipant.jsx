import React, { useEffect, useState } from "react";
import {
  Box,
  Tooltip,
  IconButton,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import {   listOfTrainingParticipant,
  listEmployeeData } from "../../../configuration/TrainingApi";
import LayoutForCourse  from '../TrainingCourse/LayoutForCourse'
import {tokens} from '../common/theme'
import Header from  '../common/Header'
import {canAccessResource} from '../../../configuration/SecurityService'
import TrainingServiceResourceName from '../../../configuration/TrainingServiceResourceName'
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';



const ListTrainingParticipant = ({ trainingId,refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [employeeId, setEmplyeeId] = useState([]);
  const [participantTrainer, setParticipantTrainer] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId

  useEffect(() => {
    fetchData();
    checkPermissions();
  }, [refreshKey]);

  const fetchData = async () => {
    try {
      const [participantResponse, participantIdResponse] = await Promise.all([
        listOfTrainingParticipant(tenantId,trainingId),
        listEmployeeData(tenantId)
      ]);

      const participantData = participantResponse.data;
      const participantIdData = participantIdResponse.data;

      const mappedData = participantData.map(participant => ({
        ...participant,
        employeeId: getEmployeeId(participant.participantEmployeeId, participantIdData)
      }));

      setParticipantTrainer(mappedData);
      setEmplyeeId(participantIdData);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const getEmployeeId = (participantEmployeeId, participantIdData) => {
    const participant = participantIdData.find((emp) => emp.id === participantEmployeeId);
    return participant ? participant.employeeId : "Unknown";
  };



  const editTrainingParticipants = (trainingId,id) => {
    navigate("/training/updateTrainingParticipants", { state: {trainingId, id } });
  };

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const userRoles = authState.roles;

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(TrainingServiceResourceName.GET_ALL_TRAINING_PARTICIPANTS, userRoles);
    const deleteAccess = await canAccessResource(TrainingServiceResourceName.DELETE_TRAINING_PARTICIPANT, userRoles);
  
    setCanEdit(!editAccess);
    setCanDelete(!deleteAccess);
  };


  const columns = [
    { field: "employeeId", headerName: "Employee ID", flex: 1 },
    { field: "reason", headerName: "Reason", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
       
       
       {canDelete && (
              <Tooltip title="Delete Participant ">
              <IconButton onClick={() => navigate("/training/delete_participant", { state: { participantId: params.row.id,  trainingId: params.row.trainingId} })} color="error">
                 <DeleteIcon />
             </IconButton>
         </Tooltip>
        )}

          {/* {canDelete && 
                   <Tooltip title="Delete Participant">
                   <IconButton
                     onClick={() => handleDelete(trainingId, params.row)}
                     color="error"
                   >
                     <DeleteIcon />
                   </IconButton>
                 </Tooltip>
          } */}


          {canEdit && 
          
          <Tooltip title="Update">
            <IconButton
              onClick={() => editTrainingParticipants(trainingId,params.row.id)}
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
    <LayoutForCourse>
     
      <Header subtitle="List Of Training Participants" />
      <DataGrid
        rows={participantTrainer}
        columns={columns}
        getRowId={(row) => row.id}
        checkboxSelection={false}
      />
      {/* <DeleteDialog
        open={openDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this participant?"
      />
       */}
    </LayoutForCourse>
  );
};

export default ListTrainingParticipant;
