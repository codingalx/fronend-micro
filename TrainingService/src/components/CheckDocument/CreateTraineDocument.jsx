import React from 'react';
import { Button, Grid, TextField, DialogContent, Snackbar, Alert } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import {  createDocumentChecked, listDocumentChecked } from '../../../configuration/TrainingApi';
import LayoutForCourse from '../TrainingCourse/LayoutForCourse';
import Header from '../common/Header';
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import { useState } from 'react';
import ListTraineDocument from './ListTraineDocument';


function CreateTraineDocument() {
    const [document, setDocument] = React.useState([]);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
      const [authState] = useAtom(authAtom);
      const tenantId = authState.tenantId
        const [refreshKey, setRefreshKey] = useState(0);
      

    React.useEffect(() => {
        fetchDocument();
    }, []);

    const fetchDocument = async () => {
        try {
            const response = await listDocumentChecked(tenantId);
            if (Array.isArray(response.data)) {
                setDocument(response.data);
            } else {
                console.error("Unexpected data format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching document name:", error.message);
        }
    };

    const handleDocumentFormSubmit = async (values, { resetForm }) => {
        try {
            // Safely check if the category name already exists
            const existingDocuments = document?.find(
                (document) => document?.documentName?.toLowerCase() === values.documentName.toLowerCase()
            );

            if (existingDocuments) {
                setSnackbarMessage("document name already exists. Please use a different name.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                return;
            }

            // Add new category
            await createDocumentChecked(tenantId,values);
            setSnackbarMessage("doucment name created successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            resetForm();
            setRefreshKey(prev => prev + 1); 
        } catch (error) {
            console.error("Failed to create document name:", error);
            setSnackbarMessage("Failed to create document name. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const InitialValues = {
        documentName: "",
        description: "",
    };

    const categorySchema = yup.object().shape({
        documentName: yup.string().required("document name is required"),
        description: yup.string().required("Description is required"),
    });

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <LayoutForCourse subtitle="Training Course Registration">
            <Header subtitle="Craete Traine Document " />
            <Formik
                initialValues={InitialValues}
                validationSchema={categorySchema}
                onSubmit={handleDocumentFormSubmit}
            >
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit, resetForm }) => (
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
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                >
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
                anchorOrigin={{ vertical: 'top', horizontal: 'end' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '50%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <ListTraineDocument  refreshKey={refreshKey}/>
        </LayoutForCourse>
    );
}

export default CreateTraineDocument;
