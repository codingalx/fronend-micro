import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import {  listCourseType } from "../../../configuration/TrainingApi";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import TrainingServiceResourceName from "../../../configuration/TrainingServiceResourceName";
import { canAccessResource } from "../../../configuration/SecurityService";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";


const ListPreserviceCourseType = ({refreshKey}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

        const [authState] = useAtom(authAtom);
        const tenantId = authState.tenantId;
  
  const [category, setCategory] = useState([]);

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrainingCourseCategory();
    checkPermissions();
  }, [refreshKey]); 

  const fetchTrainingCourseCategory = async () => {
    try {
      const response = await listCourseType(tenantId);
      setCategory(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleEditCategory = (id) => {
    navigate('/training/updatecoursetype', { state: {  id } });
  };

  const handleDeleteCategory = (id,courseType) => {
    navigate('/training/deletecoursetype', { state: { courseType, id } });
  };

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const userRoles = authState.roles;

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(TrainingServiceResourceName.UPDATE_PRE_SERVICE_COURSE_TYPE, userRoles);
    const deleteAccess = await canAccessResource(TrainingServiceResourceName.DELETE_PRE_SERVICE_COURSE_TYPE, userRoles);
  
    setCanEdit(!editAccess);
    setCanDelete(!deleteAccess);
  };

  const columns = [
    { field: "courseType", headerName: "Course Type", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          
          {canDelete && (
            <Tooltip title="Delete Course Type">
     
           <IconButton
                onClick={() => handleDeleteCategory(params.row.id,params.row.courseType)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}


          {canEdit && (
            <Tooltip title="Update Course Type">
              <IconButton
                onClick={() => handleEditCategory(params.row.id)}
                color="primary"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={category}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default ListPreserviceCourseType;