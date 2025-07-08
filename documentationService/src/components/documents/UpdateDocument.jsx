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
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Formik } from "formik";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import { getEmployeeByEmployeId, getAllDocumentType, getDocumentById, updateDocument } from "../../../configuration/DocumentationApi";

const UpdateDocument = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const location = useLocation();
  const { id } = location.state || {};

  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const username = authState.username;

  const [singleEmployee, setSingleEmployee] = useState(null);
  const [alldocumentType, setAlldocumentType] = useState([]);
  const [document, setDocument] = useState({
    employeeId: "",
    documentTypeId: "", // Corrected: added initialization
    requestDate: "",
    reason: "",
  });

  useEffect(() => {
    fetchEmployeeDetails();
    fetchDocumentType();
    fetchDocumentById();
  }, []);

  const fetchDocumentById = async () => {
    try {
      const response = await getDocumentById(tenantId, id);
      setDocument(response.data);
    } catch (error) {
      console.error("Error fetching document:", error.message);
    }
  };

  const fetchDocumentType = async () => {
    try {
      const response = await getAllDocumentType(tenantId);
      setAlldocumentType(response.data);
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
    try {
      console.log("Values being sent to server:", values);
      const response = await updateDocument(tenantId, id, values);
      if (response.status === 200 || response.status === 201) {
        setNotification({
          open: true,
          message: "Document updated successfully!",
          severity: "success",
        });
        navigate('/document/list');

      }
      
       else {
        console.error("Error updating document. Status code:", response.status);
      }
    } catch (error) {
      console.error("Error updating document:", error.message);
      setNotification({
        open: true,
        message: "Failed to update document. Please try again.",
        severity: "error",
      });
    }
  };

  const checkoutSchema = yup.object().shape({
    employeeId: yup.string().required("Employee is required"),
    reason: yup.string().required("Reason is required"),
    requestDate: yup.date().required("Request Date is required").min(new Date(), "Request date must be in the present or future"),
    documentTypeId: yup.string().required("Document Type is required"), // Added validation for documentTypeId
  });

  return (
    <Box m="20px">
      <Header subtitle="Update Document" />
      <Formik
        initialValues={document}
        validationSchema={checkoutSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
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
                  <InputLabel id="category-label">Select Document Type</InputLabel>
                  <Select
                    labelId="category-label"
                    value={values.documentTypeId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="documentTypeId"
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>Please Select Document Type</em>
                    </MenuItem>
                    {alldocumentType.map((documentType) => (
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
                  Update Document
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
    </Box>
  );
};

export default UpdateDocument;