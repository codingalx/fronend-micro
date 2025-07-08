import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    Snackbar,
    Alert,
    Typography,
    Card,
    CardContent,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import { addUser, assignRoleForUser, getAllRole, getAllUser } from "../../../configuration/authApi";
import { listEmployee } from "../../../configuration/authApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

const AddNewUser = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [roles, setRoles] = useState([]);
    const [uses, setUses] = useState([]);
    const [employees, setEmployees] = useState([]);
      const [authState] = useAtom(authAtom); 
      const tenantId = authState.tenantId



    const [selectedRoles, setSelectedRoles] = useState([]);
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const handleCloseSnackbar = () => {
        setNotification({ ...notification, open: false });
    };

    useEffect(() => {
        fetchAllRoles();
        fetchAlluser();
        fetchAllEmployee();
    }, []);
    
    const fetchAllRoles = async () => {
        try {
            const response = await getAllRole(tenantId);
            const data = response.data;
            setRoles(data);
        } catch (error) {
            console.error("Error fetching roles:", error.message);
        }
    };

    const fetchAlluser = async () => {
        try {
            const response = await getAllUser(tenantId);
            const data = response.data;
            setUses(data);
        } catch (error) {
            console.error("Error fetching roles:", error.message);
        }
    };

    const fetchAllEmployee = async () => {
        try {
            const response = await listEmployee(tenantId);
            const data = response.data;
            setEmployees(data);
        } catch (error) {
            console.error("Error fetching roles:", error.message);
        }
    };

    const handleRoleChange = (roleId) => {
        setSelectedRoles((prevSelectedRoles) =>
            prevSelectedRoles.includes(roleId)
                ? prevSelectedRoles.filter((id) => id !== roleId)
                : [...prevSelectedRoles, roleId]
        );
    };

    const handleFormSubmit = async (values, { resetForm }) => {
        try {
            // Check if the username or employee ID already exists
            const userExists = uses.some(
                (user) => user.username === values.employeeId
            );
          
            const employeeExists = employees.some(
                (emp) => emp.employeeId === values.employeeId
            );
    
            if (!employeeExists) {
                setNotification({
                    open: true,
                    message: "Employeer with this employee ID does not exist.",
                    severity: "warning",
                });
                return;
            }

            if (userExists) {
                setNotification({
                    open: true,
                    message: " user already exists. Please use a different one.",
                    severity: "warning",
                });
                return;
            }

            // Step 1: Create the user with the employeeId as a query parameter
            const userResponse = await addUser(tenantId,values, values.employeeId); // Pass employeeId as a query parameter
            const userId = userResponse?.data?.id; // Assuming 'id' is returned in the response.

            if (!userId) {
                throw new Error("User ID not returned from the API.");
            }

            // Step 2: Assign roles to the user
            const roleAssignmentPromises = selectedRoles.map((roleId) => {
                const roleName = roles.find((role) => role.id === roleId)?.roleName;
                const data = { employeeId: values.employeeId }; // Payload for role assignment
                return assignRoleForUser(tenantId,data, userId, roleName);
            });

            await Promise.all(roleAssignmentPromises); // Wait for all assignments to complete

            // Step 3: Notify success
            setNotification({
                open: true,
                message: "User created and roles assigned successfully!",
                severity: "success",
              
            });
            resetForm(); // Reset form after success
            setSelectedRoles([]); // Clear selected roles
            
            setTimeout(() =>{
                navigate('/usermanage'); 
              },200)

        } catch (error) {
            console.error("Failed to create user or assign roles:", error);
            if (error.response) {
                console.error("Error details:", error.response.data);
            }
            setNotification({
                open: true,
                message:
                    error.response?.data?.message ||
                    "Failed to create user or assign roles. Please try again.",
                severity: "error",
            });
        }
    };



    const initialValues = {
        employeeId: "",
    };

    const checkoutSchema = yup.object().shape({
        employeeId: yup.string().required("Employee ID is required"),
    });

    return (
        <Box m="20px">
            <Card elevation={3} sx={{ maxWidth: 800, margin: "0 auto", p: 3 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Add New User
                    </Typography>
                    <Formik
                        onSubmit={handleFormSubmit}
                        initialValues={initialValues}
                        validationSchema={checkoutSchema}
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
                                    gap="20px"
                                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                    sx={{
                                        "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                    }}
                                >
                                    <TextField
                                        fullWidth
                                        type="text"
                                        label="Employee ID"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.employeeId}
                                        name="employeeId"
                                        error={!!touched.employeeId && !!errors.employeeId}
                                        helperText={touched.employeeId && errors.employeeId}
                                        sx={{ gridColumn: "span 2" }}
                                    />

                                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                                   
                                        {roles
                                            .filter((role) => role.roleName !== "default_role") // Exclude "default_role"
                                            .map((role) => (
                                                <FormControlLabel
                                                    key={role.roleName}
                                                    control={
                                                        <Checkbox
                                                            checked={selectedRoles.includes(role.id)}
                                                            onChange={() => handleRoleChange(role.id)}
                                                        />
                                                    }
                                                    label={role.roleName}
                                                />
                                            ))}
                                    </Box>



                                </Box>

                                <Box display="flex" justifyContent="flex-start" mt="20px">
                                    <Button type="submit" color="primary" variant="contained">
                                        Create User and Assign Roles
                                    </Button>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </CardContent>
            </Card>

            {/* Snackbar for Notifications */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={notification.severity}
                    sx={{ width: "100%" }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AddNewUser;



{/* <Box sx={{ gridColumn: "span 4", mt: 2 }}>
                                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                            Select Roles:
                                        </Typography>
                                        <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                            {roles.map((role) => (
                                                <FormControlLabel
                                                    key={role.roleName}
                                                    control={
                                                        <Checkbox
                                                            checked={selectedRoles.includes(role.id)}
                                                            onChange={() => handleRoleChange(role.id)}
                                                            disabled={role.roleName === "default_role"} // Disable if role is "default_role"
                                                        />
                                                    }
                                                    label={role.roleName}
                                                    sx={{
                                                        opacity: role.roleName === "default_role" ? 0.5 : 1, // Optional: visually distinguish disabled roles
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Box> */}