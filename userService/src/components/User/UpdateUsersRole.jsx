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
import { assignRoleForUser, unAssignRoleForUser, getAllRole, getUserRoles } from "../../../configuration/authApi";
import { useLocation,useNavigate } from "react-router-dom";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const UpdateUsersRole = () => {
      const [authState] = useAtom(authAtom); 
      const tenantId = authState.tenantId

    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [roles, setRoles] = useState([]);
    const [userRole, setUserRole] = useState([]);
    const location = useLocation();
    const navigate = useNavigate()
    
    const { id, username } = location.state || {};
    console.log(`the user name is ${username}`);

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
        fetchRolesByUserId();
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

    const fetchRolesByUserId = async () => {
        try {
            const response = await getUserRoles(tenantId,id);
            const data = response.data;
            setUserRole(data);
            // Pre-select roles based on the fetched user roles
            const selectedRoleIds = data.map(role => role.id);
            setSelectedRoles(selectedRoleIds);
        } catch (error) {
            setNotification({
                open: true,
                message: "Failed to fetch roles. Please try again.",
                severity: "error",
            });
        }
    };

    const handleRoleChange = (roleId, roleName) => {
        setSelectedRoles((prevSelectedRoles) => {
            if (prevSelectedRoles.includes(roleId)) {
                // If the role is already selected, unassign it
                unAssignRoleForUser(tenantId,id, roleName);
                return prevSelectedRoles.filter((id) => id !== roleId);
            } else {
                // If the role is not selected, assign it
                assignRoleForUser(tenantId,{ employeeId: id }, id, roleName);
                return [...prevSelectedRoles, roleId];
            }
        });
    };

    const handleFormSubmit = async () => {
        try {
            // Notify success
            setNotification({
                open: true,
                message: "User roles updated successfully!",
                severity: "success",
            });

            setTimeout(() =>{
                navigate('/user_manage'); 
              },200)

        } catch (error) {
            console.error("Failed to update roles:", error);
            setNotification({
                open: true,
                message:
                    error.response?.data?.message ||
                    "Failed to update roles. Please try again.",
                severity: "error",
            });
        }
    };

    const initialValues = {
        employeeId: username || "", // Display username in a disabled field
    };

    const checkoutSchema = yup.object().shape({
        employeeId: yup.string().required("Employee ID is required"),
    });

    return (
        <Box m="20px">
            <Card elevation={3} sx={{ maxWidth: 800, margin: "0 auto", p: 3 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Update User Role
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
                                        value={values.employeeId}
                                        name="employeeId"
                                        error={!!touched.employeeId && !!errors.employeeId}
                                        helperText={touched.employeeId && errors.employeeId}
                                        disabled
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
                                                            onChange={() => handleRoleChange(role.id, role.roleName)}
                                                        />
                                                    }
                                                    label={role.roleName}
                                                />
                                            ))}
                                    </Box>
                                </Box>

                                <Box display="flex" justifyContent="flex-start" mt="20px">
                                    <Button type="submit" color="primary" variant="contained">
                                        Update Roles
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

export default UpdateUsersRole;
