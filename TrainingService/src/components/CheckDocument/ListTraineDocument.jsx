import React, { useEffect, useState, useContext } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import {  listDocumentChecked } from "../../../configuration/TrainingApi";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import TrainingServiceResourceName from "../../../configuration/TrainingServiceResourceName";
import { canAccessResource } from "../../../configuration/SecurityService";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';


const ListTraineDocument = ({refreshKey}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId
    const userRoles = authState.roles;
  
  const [document, setDocument] = useState([]);

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllTraineDocument();
    checkPermissions();
  }, [refreshKey]); 

  const fetchAllTraineDocument = async () => {
    try {
      const response = await listDocumentChecked(tenantId);
      setDocument(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleEditCategory = (id) => {
    navigate('/training/updatedocument', { state: {  id } });
  };

  const handleDeleteCategory = (id,documentName) => {
    navigate('/training/deletedocument', { state: {  id,documentName } });
  };

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);


  const checkPermissions = async () => {
    const editAccess = await canAccessResource(TrainingServiceResourceName.UPDATE_PRE_SERVICE_CHECKED_DOCUMENT, userRoles);
    const deleteAccess = await canAccessResource(TrainingServiceResourceName.DELETE_PRE_SERVICE_CHECKED_DOCUMENT, userRoles);
  
    setCanEdit(!editAccess);
    setCanDelete(!deleteAccess);
  };

  const columns = [
    { field: "documentName", headerName: "Document Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          
          {canDelete && (
            <Tooltip title="Delete document">
     
           <IconButton
                onClick={() => handleDeleteCategory(params.row.id,params.row.documentName)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}


          {canEdit && (
            <Tooltip title="Update document">
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
          rows={document}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default ListTraineDocument;