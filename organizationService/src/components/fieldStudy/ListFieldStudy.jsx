
import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import { canAccessResource } from "../../../configuration/SecurityService";
import OrganizationServiceResourceName from "../../../configuration/OrganizationServiceResourceName";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import {listFieldOfstudy} from '../../../configuration/organizationApi'


const ListFieldStudy = ( {refreshKey} ) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); 
  const userRoles = authState.roles
  const tenantId = authState.tenantId
  const [allStudyField, setAllStudyField] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllFieldOfStudy();
    checkPermissions();
  }, [refreshKey]); 

  const fetchAllFieldOfStudy = async () => {
    try {
      const response = await listFieldOfstudy(tenantId);
      setAllStudyField(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleEditstudyOfStudy = (id) => {
    navigate('/update_field_study', { state: { id } });
  };

  const handleDeleteFieldStudy = (id,fieldOfStudy) => {
    navigate('/delete__field_study', { state: {  id ,fieldOfStudy} });
  };

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(OrganizationServiceResourceName.UPDATE_FIELD_OF_STUDY, userRoles);
    const deleteAccess = await canAccessResource(OrganizationServiceResourceName.DELETE_FIELD_OF_STUDY, userRoles);
  
    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
  };



  const columns = [
    { field: "fieldOfStudy", headerName: "fieldOfStudy", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          
          {canDelete && (
            <Tooltip title="Delete of field study">
     
           <IconButton
                onClick={() => handleDeleteFieldStudy(params.row.id,params.row.fieldOfStudy)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}


          {canEdit && (
            <Tooltip title="Update field study">
              <IconButton
                onClick={() => handleEditstudyOfStudy(params.row.id)}
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
      <Header subtitle= "List Of field of study"/>
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={allStudyField}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default ListFieldStudy;