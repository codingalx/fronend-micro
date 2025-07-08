import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  FormControl,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import * as XLSX from "xlsx";
import { Formik } from "formik";
import Header from "../Header";
import { createAttendanceLog } from "../../Api/Attendance-Api";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const CreateAttendanceLog = () => {
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [fileData, setFileData] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleClose = () => {
    setNotification({ ...notification, open: false });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const transformedData = jsonData.map((item) => ({
        employeeId: item.employeeId?.toString() || "",
        biometricId: item.biometricId || "",
        date: item.date ? new Date(item.date).toISOString().split("T")[0] : "",
        punchTime: item.punchTime?.toString() || "",
      }));

      setFileData(transformedData);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async () => {
    try {
      if (fileData.length === 0) {
        setNotification({
          open: true,
          message: "Please upload a file first",
          severity: "warning",
        });
        return;
      }
      console.log("Payload to API:", fileData);
      await createAttendanceLog(fileData);

      setNotification({
        open: true,
        message: "Attendance logs created successfully!",
        severity: "success",
      });
      setFileData([]);
      setFileName("");
    } catch (error) {
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error creating attendance logs",
        severity: "error",
      });
    }
  };

  return (
    <Box m="20px">
      <Header subtitle="Create Attendance Logs" />

      <Formik initialValues={{}} onSubmit={handleSubmit}>
        {({ handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="flex"
              flexDirection="column"
              gap="20px"
              alignItems="center"
              sx={{ maxWidth: "700px", margin: "auto" }}
            >
              <FormControl fullWidth>
                <Button
                  component="label"
                  variant="contained"
                  color="secondary"
                  startIcon={<CloudUploadIcon />}
                  size="large"
                  sx={{ minWidth: "200px" }}
                >
                  Upload Excel File
                  <input
                    type="file"
                    hidden
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                  />
                </Button>
                {fileName && (
                  <Typography variant="body2" mt={1}>
                    File: {fileName}
                  </Typography>
                )}
              </FormControl>

              {fileData.length > 0 && (
                <TableContainer component={Paper} elevation={2} sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Employee ID</strong></TableCell>
                        <TableCell><strong>Biometric ID</strong></TableCell>
                        <TableCell><strong>Date</strong></TableCell>
                        <TableCell><strong>Punch Time</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fileData.slice(0, 5).map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.employeeId}</TableCell>
                          <TableCell>{row.biometricId}</TableCell>
                          <TableCell>{row.date}</TableCell>
                          <TableCell>{row.punchTime}</TableCell>
                        </TableRow>
                      ))}
                      {fileData.length > 5 && (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            + {fileData.length - 5} more records
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {fileData.length > 0 && (
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{ minWidth: "200px" }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Create Attendance Logs"}
                </Button>
              )}
            </Box>
          </form>
        )}
      </Formik>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateAttendanceLog;
