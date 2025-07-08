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
  generateDocument,
  getDocumentById,
} from "../../../configuration/DocumentationApi";


const GenerateDocument = () => {
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
    comment: "",

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
      const response = await generateDocument(tenantId, id, values);
      if (response.status === 200 || response.status === 201) {
        setNotification({
          open: true,
          message: "Document generated successfully!",
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
    comment: yup.string().required("Comment is required"),
   
  });

  return (
    <Box m="20px">
      <Header subtitle="Generate Document" />
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
         

        
              <TextField
                fullWidth
                type="text"
                label="comment"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.comment}
                name="comment"
                error={!!touched.comment && !!errors.comment}
                helperText={touched.comment && errors.comment}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Generate
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

export default GenerateDocument;
