import React, { useEffect, useState } from "react";
import { Box, useTheme, Tooltip, IconButton, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../common/theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import { canAccessResource } from "../../../configuration/SecurityService";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { getAllDocumentRequest, getAllDocumentApproved, getAllDocumentGenerated, getAllDocumentType, listEmployee, getAllDocument } from "../../../configuration/DocumentationApi";
import DocumentionServiceResourceName from "../../../configuration/DocumentionServiceResourceName";
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from "@mui/icons-material/Add";



const ListDocument = ({ refreshKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom); 
  const userRoles = authState.roles;
  const tenantId = authState.tenantId;

  const [alldocumentType, setAlldocumentType] = useState([]);
  const [alldocument, setAlldocument] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState("requested");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDocumentType();
    fetchAllEmployees();
    checkPermissions();
    fetchDocument();
  }, [refreshKey, selectedDocument]);

  const fetchDocumentType = async () => {
    try {
      const response = await getAllDocumentType(tenantId);
      setAlldocumentType(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const fetchDocument = async () => {
    try {
      let response;
      switch (selectedDocument) {
        case "all":
          response = await getAllDocument(tenantId);
          break;
        case "requested":
          response = await getAllDocumentRequest(tenantId);
          break;
        case "approved":
          response = await getAllDocumentApproved(tenantId);
          break;
        case "generated":
          response = await getAllDocumentGenerated(tenantId);
          break;
        default:
          response = { data: [] };
      }

      const documentData = response.data.map(document => ({
        ...document,
        documentType: getDocumentTypeName(document.documentTypeId),
        employeeId: getEmployeeName(document.employeeId),
      }));
      setAlldocument(documentData);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const fetchAllEmployees = async () => {
    try {
      const response = await listEmployee(tenantId);
      setEmployees(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const getDocumentTypeName = (documentId) => {
    const documentType = alldocumentType.find(docu => docu.id === documentId);
    return documentType ? documentType.name : "Unknown Document Type";
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emplo => emplo.id === employeeId);
    return employee ? employee.employeeId : "Unknown Employee";
  };

  const handleEditDocument = (id) => {
    navigate('/document/update', { state: { id } });
  };

  const handleApprovanceDocument = (id) => {
    navigate('/document/approvance', { state: { id } });
  };

  const handleDeleteDocument = (id, name) => {
    navigate('/document/delete', { state: { id, name } });
  };

  const handleGenerateDocument = (id,) => {
    navigate('/document/generate', { state: { id } });
  };


  

  

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const checkPermissions = async () => {
    const editAccess = await canAccessResource(DocumentionServiceResourceName.UPDATE_DOCUMENT, userRoles);
    const deleteAccess = await canAccessResource(DocumentionServiceResourceName.DELETE_DOCUMENT, userRoles);
  
    setCanEdit(editAccess);
    setCanDelete(deleteAccess);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredDocuments = alldocument.filter(doc => 
    doc.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { field: "documentType", headerName: "Document Type", flex: 1 },
    { field: "employeeId", headerName: "Employee", flex: 1 },
    { field: "requestDate", headerName: "Request Date", flex: 1 },
    { field: "reason", headerName: "Reason", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {canDelete && (
            <Tooltip title="Delete document">
              <IconButton
                onClick={() => handleDeleteDocument(params.row.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}


{canEdit && params.row.decision === 'PENDING' && (
  <Tooltip title="Update  document">
    <IconButton
      onClick={() => handleEditDocument(params.row.id)}
      color="primary"
    >
                <EditIcon />
                </IconButton>
  </Tooltip>
)}


{canEdit && params.row.decision === 'PENDING' && (
  <Tooltip title="Decision for document">
    <IconButton
      onClick={() => handleApprovanceDocument(params.row.id)}
      color="primary"
    >
      <HourglassEmptyIcon />
    </IconButton>
  </Tooltip>
)}

{canEdit && params.row.decision === 'APPROVED' && (
  <Tooltip title="Approved, generate document">
    <IconButton
      onClick={() => handleGenerateDocument(params.row.id)}
      color="primary"
    >
      <AddIcon />
    </IconButton>
  </Tooltip>
)}

{canEdit && params.row.decision === 'REJECTED' && (
  <Tooltip title="Rejected">
    <IconButton color="primary">
      <CancelIcon />
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

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0 }}>
        <FormControl sx={{ minWidth: 200, mr: 2 }}>
          <InputLabel>Choose Status</InputLabel>
          <Select
            value={selectedDocument}
            onChange={(e) => setSelectedDocument(e.target.value)}
            displayEmpty
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="requested">Requested</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="generated">Generated</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={filteredDocuments}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
          autoHeight
        />
      </Box>
    </Box>
  );
};

export default ListDocument;