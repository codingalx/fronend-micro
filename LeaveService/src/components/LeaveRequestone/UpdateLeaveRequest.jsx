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
import {
    calculateLeaverequest,
    getAllbudgetYears,
    getAllLeaveType,
    addLeaveRequest,
    getLeaveRequestById,getEmployeeByEmployeId
} from "../../../configuration/LeaveApi";
import { useLocation } from "react-router-dom";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const UpdateLeaveRequest = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const navigate = useNavigate();
    const [leaveType, setLeaveType] = useState([]);
    const [budgetYear, setBudgetYear] = useState([]);
    const [returnDate, setReturnDate] = useState("");
    const [employeeDetails, setEmployeeDetails] = useState("");
    const [authState] = useAtom(authAtom); 
    const { username } = authState;
    const tenantId = authState.tenantId
      const location = useLocation();
          const { id } = location.state || {};
    
    

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const fetchEmployeeDetails = async () => {
        try {
            const response = await getEmployeeByEmployeId(tenantId,username);
            if (response.status !== 200) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = response.data;
            setEmployeeDetails(data);
        } catch (error) {
            console.error("Failed to fetch employee details:", error);
        }
    };

    const [leaveRequest, setLeaveRequest] = useState({
        employeeId: "",
        numberOfDays: "",
        leaveStart: "",
        day: "",
        description: "",
        leaveTypeId: "",
        budgetYearId: "",
        returnDate: "",

    });

   

    useEffect(() => {
        fetchAllLeaveTypes();
        fetchAllBudgetYear();
        fetchEmployeeDetails();
    }, []);

    const fetchAllLeaveTypes = async () => {
        try {
            const response = await getAllLeaveType(tenantId);
            setLeaveType(response.data);
        } catch (error) {
            setNotification({
                open: true,
                message: "Failed to fetch leave types. Please try again.",
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
                message: "Failed to fetch budget years. Please try again.",
                severity: "error",
            });
        }
    };

    const handleCalculateReturnDate = async (values) => {
        try {
            if (!employeeDetails.id) {
                setNotification({
                    open: true,
                    message: "Employee details not loaded. Please try again.",
                    severity: "error",
                });
                return;
            }

            // Add the employee `id` to the data being sent
            const dataToCalculate = { ...values, employeeId: employeeDetails.id };
            console.log("Submitting the following values for return date calculation:", dataToCalculate);

            // Make the API call
            const response = await calculateLeaverequest(tenantId,dataToCalculate);



            const returnDate = response.data;
            setReturnDate(returnDate);
            console.log(`The returned values are ${returnDate}`);


            setNotification({
                open: true,
                message: "Return date calculated successfully!",
                severity: "success",
            });
        } catch (error) {
            console.error("Error during return date calculation:", error);

            // Log additional details if available
            if (error.response) {
                // Server responded with a status code outside 2xx range
                console.error("Server Response:", error.response);
            } else if (error.request) {
                // No response received from the server
                console.error("Request Made, No Response:", error.request);
            } else {
                // Something else went wrong
                console.error("Error Message:", error.message);
            }

            setNotification({
                open: true,
                message: "Failed to calculate return date. Please try again.",
                severity: "error",
            });
        }
    };
    const handleFormSubmit = async (values, { resetForm }) => {
        try {
            // Replace employeeId (username) with the corresponding id for submission
            const updatedValues = {
                ...values,
                employeeId: employeeDetails.id,
                returnDate,
            };
            console.log("Submitting the following values for return date request:", updatedValues);
            await addLeaveRequest(tenantId,updatedValues);
            navigate('/addleaverequest'); 

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
        employeeId: yup.string().required("Employee Id is required"),
        budgetYearId: yup.string().required("Budget year is required"),
        numberOfDays: yup.number().required("Number of days is required"),
        leaveTypeId: yup.string().required("Leave type is required"),
        leaveStart: yup
            .date()
            .required("Start date is required")
            .min(new Date(), "Start date cannot be in the past"),
    });

    const handleIconClick = () => {
        navigate("/planning/listRequest");
    };

    const handleCloseSnackbar = () => {
        setNotification({ ...notification, open: false });
    };

      useEffect(() => {
        fetchLeaveRequest();
          }, []);
          
          const fetchLeaveRequest = async () => {
            try {
              const response = await getLeaveRequestById(tenantId,id); 
              setLeaveRequest(response.data);
            } catch (error) {
              console.error("Failed to fetch Hr analysis:", error.message);
            }
          };


    return (
        <Box m="20px">
            <ToolbarComponent mainIconType="search" onMainIconClick={handleIconClick} />
            <Header subtitle="Create leave request" />
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={leaveRequest}
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
                    setFieldValue,
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
                            {/* Display username as Employee ID */}
                            <TextField
                                fullWidth
                                type="text"
                                label="Employee ID"
                                value={values.employeeId}
                                name="employeeId"
                                disabled
                                InputLabelProps={{ shrink: !!values.employeeId }}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <FormControl
                                sx={{ gridColumn: "span 2" }}
                                error={!!touched.leaveTypeId && !!errors.leaveTypeId}
                            >
                                <InputLabel id="leaveType-label">Select Leave Types</InputLabel>
                                <Select
                                    labelId="leaveType-label"
                                    value={values.leaveTypeId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="leaveTypeId"
                                >
                                    <MenuItem value="">
                                        <em>Select leave types</em>
                                    </MenuItem>
                                    {leaveType.map((type) => (
                                        <MenuItem key={type.id} value={type.id}>
                                            {type.leaveTypeName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {touched.leaveTypeId && errors.leaveTypeId && (
                                    <FormHelperText>{errors.leaveTypeId}</FormHelperText>
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

                            <FormControl sx={{ gridColumn: "span 2" }}>
                                <InputLabel id="halfOrfulldate-label">Half/Full Day</InputLabel>
                                <Select
                                    labelId="halfOrfulldate-label"
                                    value={values.day}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="day"
                                    error={!!touched.day && !!errors.day}
                                >
                                    <MenuItem value="">
                                        <em>Select Half/Full Day</em>
                                    </MenuItem>
                                    <MenuItem value="HalfDay">Half Day</MenuItem>
                                    <MenuItem value="FullDay">Full Day</MenuItem>
                                    <MenuItem value="On_Off_Day">ON and OFF Day</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                label="No. of Days"
                                onBlur={handleBlur}
                                error={!!touched.numberOfDays && !!errors.numberOfDays}
                                helperText={touched.numberOfDays && errors.numberOfDays}
                                type="number"
                                id="numberOfDays"
                                name="numberOfDays"
                                value={values.numberOfDays}
                                onChange={handleChange}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                label="Leave Start Date"
                                onBlur={handleBlur}
                                error={!!touched.leaveStart && !!errors.leaveStart}
                                helperText={touched.leaveStart && errors.leaveStart}
                                sx={{ gridColumn: "span 2" }}
                                type="date"
                                id="leaveStart"
                                name="leaveStart"
                                value={values.leaveStart}
                                onChange={handleChange}
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Description"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.description}
                                name="description"
                                error={!!touched.description && !!errors.description}
                                helperText={touched.description && errors.description}
                                sx={{ gridColumn: "span 2" }}
                            />
                               <TextField
                                fullWidth
                                label="Return date"
                                onBlur={handleBlur}
                                error={!!touched.returnDate && !!errors.returnDate}
                                helperText={touched.returnDate && errors.returnDate}
                                sx={{ gridColumn: "span 2" }}
                                type="date"
                                id="returnDate"
                                name="returnDate"
                                value={values.returnDate}
                                onChange={handleChange}
                            />

                            <TextField
                                fullWidth
                                label="Return Date"
                                value={returnDate || ""}
                                name="returnDate"
                                disabled
                                InputLabelProps={{ shrink: !!returnDate }}
                                sx={{ gridColumn: "span 1" }}
                            />
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={() => handleCalculateReturnDate(values)}
                            >
                                Calculate Return Date
                            </Button>

                           
                            <Box display="flex" justifyContent="start" mt="20px">
                            <Button type="submit" variant="contained" color="primary"
                            >
                                Submit Leave Request
                            </Button>
                            </Box>

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

export default UpdateLeaveRequest;