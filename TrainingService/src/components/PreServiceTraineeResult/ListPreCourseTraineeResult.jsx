import React, { useEffect, useState } from "react";
import { Box,  Tooltip, IconButton, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import {  listPreServiceTraineeResult, deletePreServiceTraineeResult } from "../../../configuration/TrainingApi";
import LayoutForCourse from "../TrainingCourse/LayoutForCourse";
import { tokens } from "../common/theme";
import { useLocation } from "react-router-dom";
import Header from "../common/Header";
import TrainingServiceResourceName from "../../../configuration/TrainingServiceResourceName";
import { canAccessResource } from "../../../configuration/SecurityService";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";

const ListPreCourseTraineeResult = ({refreshKey}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [result, setResult] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [resultToDelete, setResultToDelete] = useState(null);
  const location = useLocation();
  const { courseId  } = location.state;
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const userRoles = authState.roles;


  useEffect(() => {
    fetchTraineeCourserResult();
    checkPermissions();
  }, [refreshKey]);

 

  const fetchTraineeCourserResult = async () => {
    try {
      const response = await listPreServiceTraineeResult(tenantId,courseId);
      const data = response.data;
      setResult(data);
      console.log(data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };
  const handleDelete = async ( result) => {
    setResultToDelete(result);
    setOpenDialog(true);
  };

  const [canDelete, setCanDelete] = useState(false);
  const [canedit, setCanedit] = useState(false);


  const checkPermissions = async () => {
    const deleteAccess = await canAccessResource(TrainingServiceResourceName.DELETE_PRE_SERVICE_TRAINEE_RESULT, userRoles);
    const editAccess = await canAccessResource(TrainingServiceResourceName.UPDATE_PRE_SERVICE_TRAINEE_RESULT, userRoles);

    setCanDelete(deleteAccess);
    setCanedit(editAccess)
  };

 
  const handleConfirmDelete = async () => {
    try {
      await deletePreServiceTraineeResult(tenantId,resultToDelete.id);
      const updateCourseResult = result.filter((result) => result.id !== resultToDelete.id);
      setResult(updateCourseResult);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    } finally {
      setOpenDialog(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
  };

  const handlePreServiceTraineeCourseResult = (traineeId,courseId ,id) => {
    navigate('/training/updatePreTraineeCourseResult', { state: {traineeId,courseId, id } });
  };





  const columns = [
    { field: "startDate", headerName: "startDate", flex: 1 },
    { field: "endDate", headerName: "endDate", flex: 1 },
    { field: "semester", headerName: "semester", flex: 1 },
    { field: "result", headerName: "result", flex: 1 },
    { field: "decision", headerName: "decision", flex: 1 },


    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
         {canDelete &&
           <Tooltip title="Delete trainee result">
           <IconButton onClick={() => handleDelete(params.row)} color="error">
             <DeleteIcon />
           </IconButton>
         </Tooltip>
         }

              <Tooltip title="Delete Pre course service trainee ">
                   <IconButton onClick={() => navigate("/training/delete_trainee_rseult", { state: { traineeId: params.row.id ,courseId:params.row.courseId } })} color="error">
                     <DeleteIcon />
                   </IconButton>
                 </Tooltip>
          


         {canedit &&
            <Tooltip title="Update trainee">
            <IconButton
              onClick={() => handlePreServiceTraineeCourseResult(params.row.traineeId,params.row.courseId ,params.row.id)}
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
    
    <LayoutForCourse >
        <Header subtitle="The Update of Pre Service Trainee Result"/>
      <DataGrid
        rows={result}
        columns={columns}
        getRowId={(row) => row.id}
        checkboxSelection={false}
      />
      {/* <DeleteDialog
        open={openDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this Result of Trainee?"
      /> */}
    </LayoutForCourse>
  );
};

export default ListPreCourseTraineeResult;
