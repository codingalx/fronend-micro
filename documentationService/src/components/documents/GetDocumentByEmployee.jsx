import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import DocumentionServiceResourceName from "../../../configuration/DocumentionServiceResourceName";
import { canAccessResource } from "../../../configuration/SecurityService";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import { getAllDocumentType, listEmployee, getDocumentByEmployeeId } from "../../../configuration/DocumentationApi";

const GetDocumentByEmployee = ({ refreshKey, singleEmployee }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); 
  const userRoles = authState.roles;
  const tenantId = authState.tenantId;
  
  const [allDocumentType, setAllDocumentType] = useState([]);
  const [allDocument, setAllDocument] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    fetchDocumentType();
    fetchAllEmployees();
    checkPermissions();
    fetchDocument();
  }, [refreshKey]);

  const fetchDocumentType = async () => {
    try {
      const response = await getAllDocumentType(tenantId);
      setAllDocumentType(response.data);
    } catch (error) {
      console.error("Error fetching document types:", error.message);
    }
  };

  const fetchDocument = async () => {
    try {
      const response = await getDocumentByEmployeeId(tenantId, singleEmployee);
      const documentData = response.data.map(document => ({
        ...document,
        documentType: getDocumentTypeName(document.documentTypeId),
        employeeId: getEmployeeName(document.employeeId),
      }));
      setAllDocument(documentData);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching documents:", error.message);
    }
  };

  const fetchAllEmployees = async () => {
    try {
      const response = await listEmployee(tenantId);
      setEmployees(response.data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching employees:", error.message);
    }
  };

  const getDocumentTypeName = (documentTypeId) => {
    const documentType = allDocumentType.find(docu => docu.id === documentTypeId);
    return documentType ? documentType.name : "Unknown Document Type";
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emplo => emplo.id === employeeId);
    return employee ? employee.employeeId : "Unknown Employee";
  };

  const handleEditDocument = (id) => {
    navigate('/document/update', { state: { id } });
  };

  const handleDeleteDocument = (id, name) => {
    navigate('/document/delete', { state: { id, name } });
  };

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(DocumentionServiceResourceName.UPDATE_DOCUMENT, userRoles);
    const deleteAccess = await canAccessResource(DocumentionServiceResourceName.DELETE_DOCUMENT, userRoles);
  
    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
  };

  const columns = [
    {
      field: "documentType",
      headerName: "Document Type",
      flex: 1,
      renderCell: (params) => getDocumentTypeName(params.row.documentTypeId),
    },
    {
      field: "employeeId",
      headerName: "Employee",
      flex: 1,
      renderCell: (params) => getEmployeeName(params.row.employeeId),
    },
    { field: "requestDate", headerName: "Request Date", flex: 1 },
    { field: "reason", headerName: "Reason", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {canDelete && params.row.decision === 'PENDING' && (
            <Tooltip title="Delete Document">
              <IconButton
                onClick={() => handleDeleteDocument(params.row.id, params.row.name)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          {canEdit && params.row.decision === 'PENDING' && (
            <Tooltip title="Update Document">
              <IconButton
                onClick={() => handleEditDocument(params.row.id)}
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
      <Header subtitle="List Of Documents" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={allDocument}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default GetDocumentByEmployee;