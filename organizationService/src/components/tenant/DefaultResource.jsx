import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import {
  addDefaultRole,
  addAdmin,
  addresourses,
  deleteresourses,
  getAllResourseWithTenant,
  getAllUserWithTenant,
  getRoleByRoleName,
  changeResourseStatus,
} from "../../../configuration/organizationApi";
import { useLocation } from "react-router-dom";
import Header from "../common/Header";
import { useNavigate } from "react-router-dom";

const DefaultResource = () => {
  const [loading, setLoading] = useState({
    role: false,
    admin: false,
    resource: false,
    deleteAll: false,
    status: false,
  });

  const [disabled, setDisabled] = useState({
    role: true,
    admin: true,
    resource: true,
    deleteAll: true,
  });

  const [resources, setResources] = useState([]);
  const [users, setUsers] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [isResourceActive, setIsResourceActive] = useState(false); // Track resource status
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {};

  const roleName = "default_role" || "admin";

  // Fetch data whenever the component mounts or the location changes
  useEffect(() => {
    fetchAllResources();
    fetchAllUsers();
    fetchRoleByRoleName();
  }, [location]);

  useEffect(() => {
    updateButtonStates();
  }, [resources, users, roleData]);

  const fetchAllResources = async () => {
    try {
      const response = await getAllResourseWithTenant(id);
      setResources(response.data);

      // Assume response contains a property indicating active status
      const isActive = response.data.some((r) => r.status === "ACTIVE");
      setIsResourceActive(isActive);
    } catch (error) {
      console.error("Error fetching resources:", error.message);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await getAllUserWithTenant(id);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const fetchRoleByRoleName = async () => {
    try {
      const response = await getRoleByRoleName(id, roleName);
      setRoleData(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error.message);
    }
  };

  const updateButtonStates = () => {
    const isRoleEmpty = roleData.length === 0;
    const isUsersEmpty = users.length === 0;
    const isResourcesEmpty = resources.length === 0;

    setDisabled({
      role: !isRoleEmpty,
      admin: !(!isRoleEmpty && isUsersEmpty),
      resource: !(!isRoleEmpty && isResourcesEmpty),
      deleteAll: isResourcesEmpty,
    });
  };

  const handleStatusChange = async () => {
    if (disabled.deleteAll) return; // Prevent toggling if no resources exist

    setLoading((prev) => ({ ...prev, status: true }));
    const newStatus = isResourceActive ? "INACTIVE" : "ACTIVE";

    try {
      await changeResourseStatus({ id }, id, newStatus);
      setIsResourceActive(!isResourceActive);
    } catch (error) {
      console.error("Error changing resource status:", error.message);
    } finally {
      setLoading((prev) => ({ ...prev, status: false }));
    }
  };

  const handleAction = async (type) => {
    setLoading((prev) => ({ ...prev, [type]: true }));
    try {
      switch (type) {
        case "role":
          await addDefaultRole(id);
          await fetchRoleByRoleName();
          break;
        case "admin":
          await addAdmin(id);
          await fetchAllUsers();
          break;
        case "resource":
          await addresourses(id);
          await fetchAllResources();
          break;
        case "deleteAll":
          await deleteresourses(id);
          await fetchAllResources();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error executing ${type}:`, error.response?.data || error.message);
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Header subtitle="Configure Tenant" />

      <Grid container spacing={3}>
       
        {/* Add Default Role */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Add Admin Role</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAction("role")}
                disabled={disabled.role || loading.role}
                sx={{ mt: 2 }}
              >
                {loading.role ? <CircularProgress size={24} /> : "Add Admin Role"}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Add Admin */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Add Tenant Admin</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAction("admin")}
                disabled={disabled.admin || loading.admin}
                sx={{ mt: 2 }}
              >
                {loading.admin ? <CircularProgress size={24} /> : "Add Admin User"}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Add Resource */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Add Tenant Resource</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAction("resource")}
                disabled={disabled.resource || loading.resource}
                sx={{ mt: 2 }}
              >
                {loading.resource ? <CircularProgress size={24} /> : "Add Resources"}
              </Button>
            </CardContent>
          </Card>
        </Grid>

         {/* Change Resource Status */}
         <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Resource Status</Typography>
              <Button
                variant="contained"
                color={isResourceActive ? "secondary" : "primary"}
                onClick={handleStatusChange}
                disabled={disabled.deleteAll || loading.status}
                sx={{ mt: 2 }}
              >
                {loading.status ? (
                  <CircularProgress size={24} />
                ) : isResourceActive ? (
                  "Set INACTIVE"
                ) : (
                  "Set ACTIVE"
                )}
              </Button>
            </CardContent>
          </Card>
        </Grid>


        {/* Delete All Resources */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Delete All Resources</Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleAction("deleteAll")}
                disabled={disabled.deleteAll || loading.deleteAll}
                sx={{ mt: 2 }}
              >
                {loading.deleteAll ? <CircularProgress size={24} /> : "Delete All Resources"}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="start" mt="20px">
        <Button
          variant="contained"
          sx={{ mr: 2 }}
          onClick={() => navigate(`/manageteant`)}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default DefaultResource;