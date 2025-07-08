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
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import Header from "../common/Header";
import ToolbarComponent from "../common/ToolbarComponent";
import { useLocation } from "react-router-dom";
import { approvanceOfLeaveRequestDepartement } from "../../../configuration/LeaveApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const LeaveRequestDepartementApprovance = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const navigate = useNavigate();
      const location = useLocation();
      const [authState] = useAtom(authAtom); 
const tenantId = authState.tenantId
      
          const { id } = location.state || {};
          console.log(id)
    
    

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success",
    });


    const initialValues = {
            numberOfApprovedDays: 0,
            decision: "",
            comment: ""  
    };



    const handleFormSubmit = async (values, { resetForm }) => {
        try {

            console.log("Submitting the following values for return date request:", values);
            await approvanceOfLeaveRequestDepartement(tenantId,id,values);
            setNotification({
                open: true,
                message: "Leave request submitted successfully!",
                severity: "success",
            });
            resetForm();
        } catch (error) {
            setNotification({
                open: true,
                message: "Failed to submit leave request. Please try again.",
                severity: "error",
            });
        }
    };

    const checkoutSchema = yup.object().shape({
        numberOfApprovedDays: yup.number().required("Numbers of dates  is required"),
        decision: yup.string().required("decision is required"),
    });

    const handleIconClick = () => {
        navigate("/planning/listRequest");
    };


    const handleCloseSnackbar = () => {
        setNotification({ ...notification, open: false });
    };



    return (
        <Box m="20px">
            <ToolbarComponent mainIconType="search" onMainIconClick={handleIconClick} />
            <Header subtitle="Deapartement  leave request Approvance" />
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
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
                        
                            <FormControl sx={{ gridColumn: "span 2" }}>
                                <InputLabel id="decision-label">Please Choose decision</InputLabel>
                                <Select
                                    labelId="decision-label"
                                    value={values.decision}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="decision"
                                    error={!!touched.decision && !!errors.decision}
                                >
                                    <MenuItem value="">
                                        <em>Please Choose decision</em>
                                    </MenuItem>
                                    <MenuItem value="PENDING">PENDING</MenuItem>
                                    <MenuItem value="APPROVED">APPROVED</MenuItem>
                                    <MenuItem value="REJECTED">REJECTED</MenuItem>
                                </Select>
                            </FormControl>


                            <TextField
                                fullWidth
                                label="Number Of Approved Days"
                                onBlur={handleBlur}
                                error={!!touched.numberOfApprovedDays && !!errors.numberOfApprovedDays}
                                helperText={touched.numberOfApprovedDays && errors.numberOfApprovedDays}
                                type="number"
                                id="numberOfApprovedDays"
                                name="numberOfApprovedDays"
                                value={values.numberOfApprovedDays}
                                onChange={handleChange}
                                sx={{ gridColumn: "span 2" }}
                            />
                           

                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Comment"
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
              Submit Leave Request Desion
              </Button>
            </Box>
                    </form>
                )}
            </Formik>
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default LeaveRequestDepartementApprovance;