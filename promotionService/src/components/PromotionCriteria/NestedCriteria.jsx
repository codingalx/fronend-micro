import React, { useState, useEffect } from 'react'
import { Box, Button, TextField, Snackbar, Container, Typography, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material'
import { useMediaQuery } from '@mui/material'
import * as yup from 'yup'
import { Formik } from 'formik'
import { useAtom } from 'jotai'
import { authAtom } from 'shell/authAtom'
import { createNestedPromotionCriteria, fetchAllPromotionCriteriaName, fetchPromotionCriteriaById, fetchNestedPromotionCriteria } from '../../Api/ApiPromo'
import { useLocation } from 'react-router-dom'
import ListNestedCriteria from './ListNested'
import Header from '../Header'

const NestedCriteria = () => {
    const location = useLocation();
    const promotionCriteriaId = location.state?.promotionCriteriaId; 
    const [authState] = useAtom(authAtom);
    const tenantId = authState.tenantId;
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [refreshKey, setRefreshKey] = useState(0);
    const [promotionCriteria, setPromotionCriteria] = useState([]);
    const [parentWeight, setParentWeight] = useState(0);

    const handleCloseSnackbar = () => {
        setNotification({ ...notification, open: false });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const parentResponse = await fetchPromotionCriteriaById(tenantId, promotionCriteriaId);
                const parentWeightValue = parseFloat(parentResponse.data.weight) || 0;
                setParentWeight(parentWeightValue);
                
               
               
                
                const criteriaResponse = await fetchAllPromotionCriteriaName(tenantId);
                setPromotionCriteria(criteriaResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setNotification({
                    open: true,
                    message: error.message || "Error fetching data.",
                    severity: "error",
                });
            }
        };
        fetchData();
    }, [tenantId, promotionCriteriaId, refreshKey]);

    const promotionSchema = yup.object().shape({
        criteriaNameId: yup.string().required("Criteria Name is required"),
        weight: yup.number()
            .required("Weight is required")
            .min(0, "Weight cannot be negative")
            .test(
                'is-valid-weight',
                `Weight cannot exceed parent weight (${parentWeight})`,
                function(value) {
                    const weight = parseFloat(value) || 0;
                    return weight <= parentWeight;
                }
            ),
    });
    const initialValues = {
        criteriaNameId: "",
        weight: "",
    };

    const handleFormSubmit = async (values, { resetForm }) => {
        try {
            await createNestedPromotionCriteria(tenantId, promotionCriteriaId, values);
            setNotification({
                open: true,
                message: "Nested Criteria created successfully",
                severity: "success",
            });
            resetForm();
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error("Error creating promotion criteria:", error);
            setNotification({
                open: true,
                message: error.response?.data?.message || "Error creating promotion criteria.",
                severity: "error",
            });
        }
    };

    return (
        <Box m="20px">
    <Header subtitle="Create Nested Promotion Criteria" />
            
     
                   <Formik
                    initialValues={initialValues}
                    validationSchema={promotionSchema}
                    onSubmit={handleFormSubmit}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{
                                    "& > div": {
                                        gridColumn: isNonMobile ? undefined : "span 4",
                                    },
                                }}
                            >
                                <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                                    <InputLabel id="criteriaNameId">Criteria Name</InputLabel>
                                    <Select
                                        labelId="criteriaNameId"
                                        value={values.criteriaNameId}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        name="criteriaNameId"
                                        error={!!touched.criteriaNameId && !!errors.criteriaNameId}
                                        label="Criteria Name"
                                    >
                                        <MenuItem value="">
                                            <em>Select Criteria Name</em>
                                        </MenuItem>
                                        {promotionCriteria.map((criteria) => (
                                            <MenuItem key={criteria.id} value={criteria.id}>
                                                {criteria.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {touched.criteriaNameId && errors.criteriaNameId && (
                                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                            {errors.criteriaNameId}
                                        </Typography>
                                    )}
                                </FormControl>

                                <TextField
                                    fullWidth
                                    type="number"
                                    label={`Weight (Max available: ${parentWeight})`}
                                    name="weight"
                                    value={values.weight}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={!!touched.weight && !!errors.weight}
                                    helperText={touched.weight && errors.weight}
                                    sx={{ gridColumn: "span 2" }}
                                    inputProps={{
                                        min: 0,
                                        max: parentWeight,
                                        step: "any"
                                    }}
                                />
                            </Box>

                              <Box display="flex" justifyContent="center" mt="20px">
                                        <Button type="submit" color="secondary" variant="contained">
                                                             
                                              Submit
                                            </Button>
                                          </Box>
                        </form>
                    )}
                </Formik>

                <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    open={notification.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
                        {notification.message}
                    </Alert>
                </Snackbar>
            {/* <ListNestedCriteria 
                promotionCriteriaId={promotionCriteriaId} 
                refreshKey={refreshKey} 
                onDelete={() => setRefreshKey(prev => prev + 1)}
            /> */}
        </Box>
    );
};

export default NestedCriteria;