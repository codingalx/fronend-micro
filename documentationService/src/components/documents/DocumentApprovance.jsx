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
import {
  approveDocument,
  getDocumentById,
} from "../../../configuration/DocumentationApi";


const DocumentApprovance = () => {
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

  const [document, setDocument] = useState({
    decision: "",
    numberOfCopies: "",
    approvalDate: "",
    remark: "",
  });

  useEffect(() => {
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

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const handleFormSubmit = async (values) => {
    try {
      console.log("Values being sent to server:", values);
      const response = await approveDocument(tenantId, id, values);
      if (response.status === 200 || response.status === 201) {
        setNotification({
          open: true,
          message: "Document updated successfully!",
          severity: "success",
        });
        navigate("/document/list");
      } else {
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
    decision: yup.string().required("Desion is required"),
    numberOfCopies: yup.string().required("Number of Copies is required"),
    approvalDate: yup.date().required("Approval Date is required"),
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
        {(
          {
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
           
          } // Change this line to add the arrow function
        ) => (
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
                fullWidth
                sx={{ gridColumn: "span 2" }}
                error={!!touched.decision && !!errors.decision}
              >
                <InputLabel id="decision-label">Decision</InputLabel>
                <Select
                  labelId="decision-label"
                  value={values.decision}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "Decision" }}
                  name="decision"
                  error={!!touched.decision && !!errors.decision}
                  helperText={touched.decision && errors.decision}
                >
                  <MenuItem value="PENDING">PENDING</MenuItem>
                  <MenuItem value="APPROVED">APPROVED</MenuItem>
                  <MenuItem value="REJECTED">REJECTED</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="date"
                label="Approval Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.approvalDate}
                name="approvalDate"
                error={!!touched.approvalDate && !!errors.approvalDate}
                helperText={touched.approvalDate && errors.approvalDate}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                type="number"
                label="Number of Copies"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.numberOfCopies}
                name="numberOfCopies"
                error={!!touched.numberOfCopies && !!errors.numberOfCopies}
                helperText={touched.numberOfCopies && errors.numberOfCopies}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="text"
                label="Remark"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.remark}
                name="remark"
                error={!!touched.remark && !!errors.remark}
                helperText={touched.remark && errors.remark}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Decision
              </Button>
            </Box>
          </form>
        )}
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

export default DocumentApprovance;
