import {
  Box,
  Button,
  TextField,
  FormControl,
  Snackbar,
  Alert,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../common/Header";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Formik } from "formik";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import ListDocument from './ListDocument';
import { getEmployeeByEmployeId, createDocument, getAllDocumentType } from "../../../configuration/DocumentationApi";
import GetDocumentByEmployee from "./GetDocumentByEmployee";

const CreateDocument = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const username = authState.username;
  const [refreshKey, setRefreshKey] = useState(0);
  const [singleEmployee, setSingleEmployee] = useState(null);
  const [allDocumentType, setAllDocumentType] = useState([]);

  const initialDelegation = {
    employeeId: "",
    documentTypeId: "",  // Set a default value
    requestDate: "",
    reason: "",
  };

  const [document, setDocument] = useState(initialDelegation);

  useEffect(() => {
    fetchEmployeeDetails();
    fetchDocumentType();
  }, []);

  const fetchDocumentType = async () => {
    try {
      const response = await getAllDocumentType(tenantId);
      setAllDocumentType(response.data);
    } catch (error) {
      console.error("Error fetching document types:", error.message);
    }
  };

  const fetchEmployeeDetails = async () => {
    try {
      const response = await getEmployeeByEmployeId(tenantId, username);
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = response.data;
      console.log("Fetched employee details:", data);
      setSingleEmployee(data.id);
      setDocument((prev) => ({
        ...prev,
        employeeId: data.id,
      }));
    } catch (error) {
      console.error("Failed to fetch employee details:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const handleFormSubmit = async (values) => {
    console.log("Submitting form with values:", values);
    try {
      const response = await createDocument(tenantId, values);
      if (response.status === 200 || response.status === 201) {
        setNotification({
          open: true,
          message: "Document created successfully!",
          severity: "success",
        });
        setRefreshKey(prev => prev + 1);
      } else {
        console.error("Error adding document. Status code:", response.status);
      }
    } catch (error) {
      console.error("Server responded with an error:", error.response?.data || error.message);
      setNotification({
        open: true,
        message: "Failed to create document. Please try again.",
        severity: "error",
      });
    }
  };

  const checkoutSchema = yup.object().shape({
    employeeId: yup.string().required("Employee is required"),
    documentTypeId: yup.string().required("Document type is required"),
    reason: yup.string().required("Reason is required"),
    requestDate: yup.date().required("Request Date is required").min(new Date(), "Request date must be in the present or future"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create Document" />
      <Formik
        initialValues={document}
        validationSchema={checkoutSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => {
          useEffect(() => {
            if (singleEmployee) {
              setFieldValue("employeeId", singleEmployee);
            }
          }, [singleEmployee, setFieldValue]);

          return (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <FormControl
                  sx={{
                    flexGrow: 1,
                    flexShrink: 1,
                    minWidth: 0,
                    gridColumn: "span 2",
                  }}
                  error={!!touched.documentTypeId && !!errors.documentTypeId}
                >
                  <InputLabel id="document-label">Select Document Type</InputLabel>
                  <Select
                    labelId="document-label"
                    value={values.documentTypeId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="documentTypeId"
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>Please Select Document Type</em>
                    </MenuItem>
                    {allDocumentType.map((documentType) => (
                      <MenuItem key={documentType.id} value={documentType.id}>
                        {documentType.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.documentTypeId && errors.documentTypeId && (
                    <FormHelperText>{errors.documentTypeId}</FormHelperText>
                  )}
                </FormControl>

                <TextField
                  fullWidth
                  type="date"
                  label="Request Date"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.requestDate}
                  name="requestDate"
                  error={!!touched.requestDate && !!errors.requestDate}
                  helperText={touched.requestDate && errors.requestDate}
                  sx={{ gridColumn: "span 2" }}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  fullWidth
                  type="text"
                  label="Document Reason"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.reason}
                  name="reason"
                  error={!!touched.reason && !!errors.reason}
                  helperText={touched.reason && errors.reason}
                  sx={{ gridColumn: "span 2" }}
                />
              </Box>
              <Box display="flex" justifyContent="center" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Create Document
                </Button>
              </Box>
            </form>
          );
        }}
      </Formik>
      {/* Snackbar for Notifications */}
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
      {singleEmployee &&
        <GetDocumentByEmployee singleEmployee={singleEmployee} refreshKey={refreshKey} />
      }
    </Box>
  );
};

export default CreateDocument;