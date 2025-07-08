
import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    FormHelperText,
    Snackbar,
    Alert,
    RadioGroup,
    Radio,
    FormControlLabel,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ToolbarComponent from "../common/ToolbarComponent";
import Header from '../common/Header'
import { createAnnualRequirementPromotion,
    getAllbudgetYears,
    getAllWorkunits, } from "../../../configuration/PlanningApi";
import ListAnnualRecruitmentPromotion from "./ListAnnualRecruitmentPromotion";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import NotFoundHandle from "../common/NotFoundHandle";




const CreateAnnualRecruitmentPromotion = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = location.state || {};
      const [authState] = useAtom(authAtom); 
          const tenantId = authState.tenantId
                  const [refreshKey, setRefreshKey] = useState(0);
          
    const [workunit, setWorkunit] = useState([]);
    const [budgetYear, setBudgetYear] = useState([]);
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const [recruitmentOptions, setRecruitmentOptions] = useState({
        internalRecruitment: false,
        externalRecruitment: false,
        allRecruitments: false,
    });

    const initialValues = {
        budgetYearId: "",
        workUnitId: "",
        hrNeedRequestId: id,
        preparedBy: "",
        comment: "",
        grandTotal: "",
        remark: "",
        internalRecruitment: false,
        externalRecruitment: false,
        allRecruitments: false,
    };

    useEffect(() => {
        fetchAllWorkUnits();
        fetchAllBudgetYear();
    }, []);

    const fetchAllWorkUnits = async () => {
        try {
            const response = await getAllWorkunits(tenantId);
            setWorkunit(response.data);
        } catch (error) {
            setNotification({
                open: true,
                message: "Failed to fetch work units.",
                severity: "error",
            });
        }
    };

    const fetchAllBudgetYear = async () => {
        try {
            const response = await getAllbudgetYears(tenantId);
            setBudgetYear(response.data);
        } catch (error) {
            setNotification({
                open: true,
                message: "Failed to fetch budget years.",
                severity: "error",
            });
        }
    };

    const handleRecruitmentChange = (event) => {
        const { name } = event.target;
        setRecruitmentOptions({
            internalRecruitment: name === "internalRecruitment",
            externalRecruitment: name === "externalRecruitment",
            allRecruitments: name === "allRecruitments",
        });
    };

    const handleFormSubmit = async (values, { resetForm }) => {
        try {
            console.log("Submitting the following values:", {
                ...values,
                ...recruitmentOptions,
            });
            await createAnnualRequirementPromotion(tenantId,{
                ...values,
                ...recruitmentOptions,
            });
            setNotification({
                open: true,
                message: "Hr Analysis updated successfully!",
                severity: "success",
            });
            resetForm();
            setRefreshKey(prev => prev + 1); 
        } catch (error) {
            console.error("Failed to submit form data:", error);
            setNotification({
                open: true,
                message: "Failed to submit data. Please try again.",
                severity: "error",
            });
        }
    };

    const handleIconClick = () => {
        navigate("/planning/listRequest");
    };

    const handleCloseSnackbar = () => {
        setNotification({ ...notification, open: false });
    };
    if (!id) {
        return <NotFoundHandle message="No need request selected for hr annula recruitment creation ." navigateTo="/planning/listRequest" />;
      }

    return (
        <Box m="20px">
            <ToolbarComponent
                mainIconType="search"
                onMainIconClick={handleIconClick}
            />
            <Header subtitle="Create Annual Recruitment and Promotion" />
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={yup.object().shape({
                    budgetYearId: yup.string().required("Budget year is required"),
                    workUnitId: yup.string().required("Work unit is required"),
                })}
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
                                sx={{ gridColumn: "span 2" }}
                                error={touched.workUnitId && !!errors.workUnitId}
                            >
                                <InputLabel>Select Work Unit</InputLabel>
                                <Select
                                    value={values.workUnitId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="workUnitId"
                                >
                                    <MenuItem value="">
                                        <em>Select Work Unit</em>
                                    </MenuItem>
                                    {workunit.map((unit) => (
                                        <MenuItem key={unit.id} value={unit.id}>
                                            {unit.workUnitName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {touched.workUnitId && errors.workUnitId && (
                                    <FormHelperText>{errors.workUnitId}</FormHelperText>
                                )}
                            </FormControl>

                            <FormControl
                                sx={{ gridColumn: "span 2" }}
                                error={touched.budgetYearId && !!errors.budgetYearId}
                            >
                                <InputLabel>Select Budget Year</InputLabel>
                                <Select
                                    value={values.budgetYearId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="budgetYearId"
                                >
                                    <MenuItem value="">
                                        <em>Select Budget Year</em>
                                    </MenuItem>
                                    {budgetYear.map((year) => (
                                        <MenuItem key={year.id} value={year.id}>
                                            {year.budgetYear}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {touched.budgetYearId && errors.budgetYearId && (
                                    <FormHelperText>{errors.budgetYearId}</FormHelperText>
                                )}
                            </FormControl>

                            <TextField
                                fullWidth
                                label="Comment"
                                name="comment"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.comment}
                                error={touched.comment && !!errors.comment}
                                helperText={touched.comment && errors.comment}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                type="number"
                                rows={2}
                                label="Grand Total"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.grandTotal}
                                name="grandTotal"
                                sx={{ gridColumn: "span 2" }}
                            />

                            <TextField
                                fullWidth
                                rows={2}
                                label="remark"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.remark}
                                name="remark"
                                error={!!touched.remark && !!errors.remark}
                                helperText={touched.remark && errors.remark}
                                sx={{ gridColumn: "span 2" }}
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="preparedBy"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.preparedBy}
                                name="preparedBy"
                                error={!!touched.preparedBy && !!errors.preparedBy}
                                helperText={touched.preparedBy && errors.preparedBy}
                                sx={{ gridColumn: "span 2" }}
                            />

                            <FormControl component="fieldset" sx={{ gridColumn: "span 4" }}>
                                <RadioGroup row>
                                    <FormControlLabel
                                        control={
                                            <Radio
                                                checked={recruitmentOptions.internalRecruitment}
                                                onChange={handleRecruitmentChange}
                                                name="internalRecruitment"
                                            />
                                        }
                                        label="Internal Recruitment"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Radio
                                                checked={recruitmentOptions.externalRecruitment}
                                                onChange={handleRecruitmentChange}
                                                name="externalRecruitment"
                                            />
                                        }
                                        label="External Recruitment"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Radio
                                                checked={recruitmentOptions.allRecruitments}
                                                onChange={handleRecruitmentChange}
                                                name="allRecruitments"
                                            />
                                        }
                                        label="All Recruitments"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                        <Box display="flex" justifyContent="center" mt="20px">
                            <Button type="submit" color="secondary" variant="contained">
                                Create Annual Promotion
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={notification.severity}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
            <ListAnnualRecruitmentPromotion  refreshKey={refreshKey}/>
        </Box>
    );
};

export default CreateAnnualRecruitmentPromotion;

