import React, { useEffect, useState } from "react";
import { Button, Grid, TextField, DialogContent, Snackbar, Alert
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import {
    getDocumentCheckedById,
    listDocumentChecked,
    updateDocumentChecked
} from "../../../configuration/TrainingApi";
import LayoutForCourse from "../TrainingCourse/LayoutForCourse";
import Header from "../common/Header";
import { useNavigate, useLocation } from "react-router-dom";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';

function UpdateTraineDocument() {
    const [document, setCourseDocument] = useState({
        documentName: "",
        description: "",
    });
    const [documenties, setDocumenties] = React.useState([]);

    const location = useLocation();
    const { id } = location.state || {};
    const navigate = useNavigate();
      const [authState] = useAtom(authAtom);
    const tenantId = authState.tenantId

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    useEffect(() => {
        if (id) {
            fetchDocumentById();
        }
        fetchAllDocuments();
    }, [id]);

    const fetchAllDocuments = async () => {
        try {
            const response = await listDocumentChecked(tenantId);
            setDocumenties(response.data);
        } catch (error) {
            console.error("Error fetching documents:", error.message);
        }
    };

    const fetchDocumentById = async () => {
        try {
            const response = await getDocumentCheckedById(tenantId,id);
            setCourseDocument(response.data);
        } catch (error) {
            console.error("Error fetching traine document:", error.message);
        }
    };

    
        const handleDocumentFormSubmit = async (values) => {
            try {
          
                const existingDocuments = documenties.find(
                    (document) =>
                        document.documentName.toLowerCase() === values.documentName.toLowerCase() &&
                    document.id !== id
                );
    
    
                if (existingDocuments) {
                    setSnackbarMessage("document name already exists. Please use a different name.");
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                    return;
                }
    
                // Add new category
                await updateDocumentChecked(tenantId,id,values);
                setSnackbarMessage("doucment name created successfully!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
                navigate("/training/createdocument");

            } catch (error) {
                console.error("Failed to create document name:", error);
                setSnackbarMessage("Failed to create document name. Please try again.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            }
        };


    const categorySchema = yup.object().shape({
        documentName: yup.string().required("document name is required"),
        description: yup.string().required("Description is required"),
    });

    // Snackbar close handler
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <LayoutForCourse subtitle="Training Course Registration">
            <Header subtitle="Update document name" />
            <Formik
                enableReinitialize
                initialValues={document}
                validationSchema={categorySchema}
                onSubmit={handleDocumentFormSubmit}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    resetForm,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <DialogContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Document Name"
                                        variant="outlined"
                                        name="documentName"
                                        value={values.documentName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!touched.documentName && !!errors.documentName}
                                        helperText={touched.documentName && errors.documentName}
                                        style={{ marginTop: 8 }}
                                    />
                                </Grid>
                                <Grid item xs={12} style={{ marginTop: 8 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Description"
                                        variant="outlined"
                                        name="description"
                                        value={values.description}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!touched.description && !!errors.description}
                                        helperText={touched.description && errors.description}
                                        style={{ marginTop: 8 }}
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>

                        <Grid container spacing={3} justifyContent="center" style={{ marginBottom: 16 }}>
                            <Grid item xs={12} md={3}>
                                <Button fullWidth variant="contained" color="primary" type="submit">
                                    Save
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    type="button"
                                    onClick={() => resetForm()}
                                >
                                    Reset
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>

            {/* Snackbar for displaying messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </LayoutForCourse>
    );
}

export default UpdateTraineDocument;
