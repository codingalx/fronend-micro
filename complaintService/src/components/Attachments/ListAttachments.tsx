import React, { useEffect, useState } from "react";
import { Box, IconButton, Tooltip, Snackbar, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../common/Header";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAllAttachmentsByComplaint,
  downloadAttachment,
} from "../../Api/AttachmentsApi";
import NotPageHandle from "../../common/NoPageHandle";

const ListAttachments = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tenantId, complaintId } = location.state || {};
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const fetchAttachments = async () => {
    try {
      const data = await getAllAttachmentsByComplaint(tenantId, complaintId);
      setAttachments(data);
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to fetch attachments.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId && complaintId) {
      fetchAttachments();
    }
    // eslint-disable-next-line
  }, [tenantId, complaintId]);

  const handleDownload = async (attachmentId: string, fileName: string) => {
    try {
      const response = await downloadAttachment(tenantId, attachmentId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to download attachment.",
        severity: "error",
      });
    }
  };

  const handleDelete = (attachmentId: string, fileName: string) => {
    navigate("/complaint/delete-attachment", {
      state: {
        tenantId,
        attachmentId,
        fileName,
        complaintId, 
      },
    });
  };

  if (!tenantId || !complaintId) {
    return (
      <NotPageHandle
        message="No Complaint selected for attachments"
        navigateTo="/complaint/attachments-list"
      />
    );
  }

  const columns = [
    { field: "fileName", headerName: "File Name", flex: 2 },
    { field: "fileType", headerName: "File Type", flex: 1 },
    { field: "createdAt", headerName: "Created At", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params: any) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Tooltip title="Download">
            <IconButton
              onClick={() =>
                handleDownload(params.row.id, params.row.fileName)
              }
              color="primary"
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() =>
                handleDelete(params.row.id, params.row.fileName)
              }
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box m="20px">
      <Header subtitle="List of Attachments" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={attachments}
          columns={columns}
          loading={loading}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
          getRowId={(row) => row.id}
        />
      </Box>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ListAttachments;