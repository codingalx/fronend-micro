import React from "react";
import {
    Box,
    Button,
    TextField, FormControl, Select, MenuItem, InputLabel,FormHelperText ,Snackbar ,Alert 
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import Header from "../common/Header";
import { useState, useEffect } from "react";
import { getAllbudgetYears, getAllWorkunits, getByIdHrAnalisis, updateHrAnalsis,listJobRegestration } from "../../../configuration/PlanningApi";
import { useLocation } from "react-router-dom";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import NotFoundHandle from "../common/NotFoundHandle";




const UpdateHrAnalisis = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const navigate = useNavigate();
    const [workunit, setworkunit] = useState([]);
    const [budgetYear, setBudgetYear] = useState([]);
    const [jobregister, setJobregister] = useState([]);
     const location = useLocation();
      const { id } = location.state || {};
        const [authState] = useAtom(authAtom); 
              const tenantId = authState.tenantId


    const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });


    const handleFormSubmit = async (values, { resetForm }) => {
        try {
                const response = await updateHrAnalsis(tenantId,id, values);
                const { hrNeedRequestId } = response.data;
                setNotification({
                open: true,
                message: "Hr Analysis updated successfully!",
                severity: "success",
            });
            resetForm();
            navigate('/planning/hranalyses', {
                state: { id: hrNeedRequestId },
            });
        } catch (error) {
            console.error("Failed to submit form data:", error);
        }
    };
    
    const [hranalyses, setHranalyses] = useState({
        budgetYearId: "",
        workUnitId: "",
        jobRegistrationId: "",
        hrNeedRequestId:"",
        processedBy: "",
        comment: ""
    });




    useEffect(() => {
        fetchAllWorkUnits();
        fetchAllBudgetYear();
        fetchAllJobRegistraion();
    }, []);

    const fetchAllWorkUnits = async () => {
        try {
            const response = await getAllWorkunits(tenantId);
            setworkunit(response.data);
        } catch (error) {
            setNotification({ open: true, message: "Failed fetch the work units. Please try again.", severity: "error" });
        }
    };

    const fetchAllBudgetYear = async () => {
        try {
            const response = await getAllbudgetYears(tenantId);
            setBudgetYear(response.data);
        } catch (error) {
            setNotification({ open: true, message: "Failed fetch the  budget year c. Please try again.", severity: "error" });
        }
    };

    const fetchAllJobRegistraion = async () => {
        try {
            const response = await listJobRegestration(tenantId);
            setJobregister(response.data);
        } catch (error) {
            setNotification({ open: true, message: "Failed fetch the  job registartion c. Please try again.", severity: "error" });
        }
    };
    
    useEffect(() => {
        fetchHrAnalisis();
      }, []);
      
      const fetchHrAnalisis = async () => {
        try {
          const response = await getByIdHrAnalisis(tenantId,id); 
          const { hrNeedRequestId } = response.data; 
          setHranalyses(response.data);
          console.log("hrNeedRequestId:", hrNeedRequestId);
        } catch (error) {
          console.error("Failed to fetch Hr analysis:", error.message);
        }
      };
      

    const checkoutSchema = yup.object().shape({
        budgetYearId: yup.string().required("Budget year is required"),
        workUnitId: yup.string().required("Work plan is required"),
        jobRegistrationId: yup.string().required("job title  is required"),
    });

    const handleCloseSnackbar = () => {
        setNotification({ ...notification, open: false });
      };

      if (!id) {
        return <NotFoundHandle message="No hr analsis selected for updation." navigateTo="/planning/listRequest" />;
      }


    return (
        <Box m="20px">
         
            <Header subtitle="Update Hr Analisis" />
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={hranalyses}
                validationSchema={checkoutSchema}
                enableReinitialize
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                }) => (
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
                                sx={{ flexGrow: 1, flexShrink: 1, minWidth: 0, gridColumn: "span 2" }}
                                error={!!touched.workUnitId && !!errors.workUnitId}
                            >
                                <InputLabel id="language-label">Select Work unit</InputLabel>
                                <Select
                                    labelId="workunit-label"
                                    value={values.workUnitId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="workUnitId"
                                    fullWidth
                                >
                                    <MenuItem value="">
                                        <em>Select Staff plan</em>
                                    </MenuItem>
                                    {workunit.map((workunit) => (
                                        <MenuItem key={workunit.id} value={workunit.id}>
                                            {workunit.workUnitName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {touched.workUnitId && errors.workUnitId && (
                                    <FormHelperText>{errors.workUnitId}</FormHelperText>
                                )}
                            </FormControl>


                            <FormControl
                                sx={{ flexGrow: 1, flexShrink: 1, minWidth: 0, gridColumn: "span 2" }}
                                error={!!touched.budgetYearId && !!errors.budgetYearId}
                            >
                                <InputLabel id="language-label">Select Budget Year</InputLabel>
                                <Select
                                    labelId="budgetYear-label"
                                    value={values.budgetYearId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="budgetYearId"
                                    fullWidth
                                >
                                    <MenuItem value="">
                                        <em>Select Budget Year</em>
                                    </MenuItem>
                                    {budgetYear.map((budget) => (
                                        <MenuItem key={budget.id} value={budget.id}>
                                            {budget.budgetYear}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {touched.budgetYearId && errors.budgetYearId && (
                                    <FormHelperText>{errors.budgetYearId}</FormHelperText>
                                )}
                            </FormControl>


                            <FormControl
                                sx={{ flexGrow: 1, flexShrink: 1, minWidth: 0, gridColumn: "span 2" }}
                                error={!!touched.jobRegistrationId && !!errors.jobRegistrationId}
                            >
                                <InputLabel id="job-register">Select Job Registration</InputLabel>
                                <Select
                                    labelId="job-register"
                                    value={values.jobRegistrationId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="jobRegistrationId"
                                    fullWidth
                                >
                                    <MenuItem value="">
                                        <em>select job Registration</em>
                                    </MenuItem>
                                    {jobregister.map((jobregister) => (
                                        <MenuItem key={jobregister.id} value={jobregister.id}>
                                            {jobregister.jobTitle}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {touched.jobRegistrationId && errors.jobRegistrationId && (
                                    <FormHelperText>{errors.jobRegistrationId}</FormHelperText>
                                )}
                            </FormControl>

                            <TextField
                                fullWidth
                                multiline
                                rows={2}

                                label="comment"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.comment}
                                name="comment"
                                error={!!touched.comment && !!errors.comment}
                                helperText={touched.comment && errors.comment}
                                sx={{ gridColumn: "span 2" }}
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="processedBy"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.processedBy}
                                name="processedBy"
                                error={!!touched.processedBy && !!errors.processedBy}
                                helperText={touched.processedBy && errors.processedBy}
                                sx={{ gridColumn: "span 2" }}
                            />



                        </Box>
                        <Box display="flex" justifyContent="center" mt="20px">
                            <Button type="submit" color="secondary" variant="contained">
                                Create HrAnalsis
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
                  <Snackbar
                    open={notification.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
                      {notification.message}
                    </Alert>
                  </Snackbar>
        </Box>
    );
};

export default UpdateHrAnalisis;