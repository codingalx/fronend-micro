
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    TextField, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../common/Header";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { getAnnualTrainingById, trainingRequestStatus } from "../../../configuration/TrainingApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';


const TrainingStatus = () => {
    const location = useLocation();
    const trainingId = location?.state?.id
         const [authState] = useAtom(authAtom);
        const tenantId = authState.tenantId

    const isNonMobile = useMediaQuery("(min-width:600px)");
    const navigate = useNavigate();

    useEffect(() => {
        fetchAnnualTrainingRequestById();
    }, []);

    const fetchAnnualTrainingRequestById = async () => {
        try {
            const response = await getAnnualTrainingById(tenantId,trainingId);
            const data = response.data;
            data.trainingStatus = data.trainingStatus.toUpperCase();
            setAnnualTrainingDecision(data);
            console.log(data);
        } catch (error) {
            console.error("Failed to fetch training :", error.message);
        }
    };


    const [annualTrainingDecision, setAnnualTrainingDecision] = useState({
        decision: "",
        remark: "",
    });



    const handleFormSubmit = async (values) => {
        try {

            const response = await trainingRequestStatus(tenantId,trainingId, values);
            console.log("Update response:", response);
            if (response.status === 200) {
                console.log("Course updated successfully!");
                navigate('/training/annualTrainingRequest');
            } else {
                console.error("Failed to update course: Unexpected response status", response.status);
            }
        } catch (error) {
            console.error("Failed to update course:", error);
        }
    };


    const checkoutSchema = yup.object().shape({
        decision: yup.string().required("Skill type is required"),

    });

    return (
        <Box m="20px">
            <Header subtitle="Control Training Status " />
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={annualTrainingDecision}
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
                                    <MenuItem value="PENDING">Pending</MenuItem>
                                    <MenuItem value="APPROVED">Approved</MenuItem>
                                    <MenuItem value="REJECTED">Rejected</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth

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

                        <Box
                            mt="20px"
                            gridColumn="span 4"
                            display="flex"
                            justifyContent="center" // Center the buttons horizontally
                        >

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ mr: 2 }}
                            >
                                Change Training Status
                            </Button>

                            <Button
                                variant="contained"
                                onClick={() => navigate('/training/annualTrainingRequest')}

                            >
                                Cancel
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

export default TrainingStatus;
