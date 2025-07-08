import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import { canAccessResource } from "../../../configuration/SecurityService";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import { getAllDocumentType } from "../../../configuration/DocumentationApi";
import DocumentionServiceResourceName from "../../../configuration/DocumentionServiceResourceName";



const ListDocumentType = ( {refreshKey} ) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); 
  const userRoles = authState.roles
  const tenantId = authState.tenantId


  
  const [alldocumentType, setAlldocumentType] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDocumentType();
    checkPermissions();
  }, [refreshKey]); 

  const fetchDocumentType = async () => {
    try {
      const response = await getAllDocumentType(tenantId);
      setAlldocumentType(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleEditDocumentTye = (id) => {
    navigate('/document/update_documentType', { state: { id } });
  };

  const handleDeleteDocumentType = (id,name) => {
    navigate('/document/delete_documentType', { state: {  id ,name} });
  };

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(DocumentionServiceResourceName.UPDATE_DOCUMENT_TYPE, userRoles);
    const deleteAccess = await canAccessResource(DocumentionServiceResourceName.DELETE_DOCUMENT_TYPE, userRoles);
  
    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
  };



  const columns = [
    { field: "name", headerName: "Country Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          
          {canDelete && (
            <Tooltip title="Delete document type">
     
           <IconButton
                onClick={() => handleDeleteDocumentType(params.row.id,params.row.name)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}


          {canEdit && (
            <Tooltip title="Update document Type">
              <IconButton
                onClick={() => handleEditDocumentTye(params.row.id)}
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
      <Header subtitle= "List Of document type"/>
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={alldocumentType}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default ListDocumentType;