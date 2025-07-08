import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import { listMediaType } from "../../../configuration/RecruitmentApp"; // Adjust as needed
import { canAccessResource } from "../../../configuration/SecurityService";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; // Adjust the import based on your structure
import RecruitmentServiceResourceName from "../../../configuration/RecruitmentServiceResourceName";

const ListMediaType = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); // Access the shared authentication state
  const userRoles = authState.roles;
  const tenantId = authState.tenantId;

  const [allMediaTypes, setAllMediaTypes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllMediaTypes();
    checkPermissions();
  }, [refreshKey]);

  const fetchAllMediaTypes = async () => {
    try {
      const response = await listMediaType(tenantId);
      setAllMediaTypes(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleEditMediaType = (id) => {
    navigate('/recruitment/update_media_type', { state: { id } }); // Adjust route as needed
  };

  const handleDeleteMediaType = (id, mediaTypeName) => {
    navigate('/recruitment/delete_media_type', { state: { id, mediaTypeName } }); // Adjust route as needed
  };


  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(RecruitmentServiceResourceName.UPDATE_MEDIA_TYPE, userRoles);
    const deleteAccess = await canAccessResource(RecruitmentServiceResourceName.DELETE_MEDIA_TYPE, userRoles);
  
    setCanEdit(!editAccess);
    setCanDelete(!deleteAccess);
  };

  const columns = [
    { field: "mediaTypeName", headerName: "Media Type Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {canDelete && (
            <Tooltip title="Delete Media Type">
              <IconButton
                onClick={() => handleDeleteMediaType(params.row.id, params.row.mediaTypeName)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          {canEdit && (
            <Tooltip title="Update Media Type">
              <IconButton
                onClick={() => handleEditMediaType(params.row.id,params.row.mediaTypeName)}
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
      <Header subtitle="List of Media Types" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={allMediaTypes}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default ListMediaType;