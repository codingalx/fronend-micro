import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useLocation } from "react-router-dom";
import {
  assignResourseForRole,
  getAllResourse,
  UnassignResourseForRole,
} from "../../../configuration/authApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import Header from "./Header";


const ListRoles = () => {
  const location = useLocation();
  const { roleName } = location.state; 
  const [authState] = useAtom(authAtom); 
        const tenantId = authState.tenantId

  const [resourses, setResourses] = useState([]);
  const [assignedResources, setAssignedResources] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
    

  useEffect(() => {
    fetchAllResourse();
  }, []);

  useEffect(() => {
    fetchAssignedResources();
  }, [resourses]);

  const fetchAllResourse = async () => {
    try {
      const response = await getAllResourse(tenantId);
      setResourses(response.data);
    } catch (error) {
      console.error("Error fetching resources:", error.message);
    }
  };

  const fetchAssignedResources = () => {
    const assignedIds = resourses
      .filter((resource) => resource.requiredRoles.includes(roleName))
      .map((resource) => resource.id);
    setAssignedResources(assignedIds);
  };

  const handleAssignResource = async (resourceId) => {
    try {
      const payload = { roles: [roleName] };
      await assignResourseForRole(tenantId,resourceId, payload);
      setAssignedResources((prev) => [...prev, resourceId]);
      setResourses((prev) =>
        prev.map((resource) =>
          resource.id === resourceId
            ? { ...resource, requiredRoles: [...resource.requiredRoles, roleName] }
            : resource
        )
      );
      setNotification({
        open: true,
        message: "Resource assigned successfully!",
        severity: "success",
      });
      
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to assign resource.",
        severity: "error",
      });
      console.error("Error assigning resource:", error.message);
    }
  };

  const handleUnassignResource = async (resourceId) => {
    if (roleName === "admin") {
      setNotification({
        open: true,
        message: "Unassign action is not allowed for the admin role.",
        severity: "warning",
      });
      return;
    }

    try {
      await UnassignResourseForRole(tenantId,resourceId, roleName);
      setAssignedResources((prev) => prev.filter((id) => id !== resourceId));
      setResourses((prev) =>
        prev.map((resource) =>
          resource.id === resourceId
            ? {
                ...resource,
                requiredRoles: resource.requiredRoles.filter(
                  (role) => role !== roleName
                ),
              }
            : resource
        )
      );
      setNotification({
        open: true,
        message: "Resource unassigned successfully!",
        severity: "success",
      });
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to unassign resource.",
        severity: "error",
      });
      console.error("Error unassigning resource:", error.message);
    }
  };

  const isResourceAssigned = (resourceId) => assignedResources.includes(resourceId);

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const columns = [
    { field: "resourceName", headerName: "Resource Name", flex: 1 },
    { field: "serviceName", headerName: "Service Name", flex: 1 },
    { field: "requiredRoles", headerName: "Required Roles", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => {
        const resourceId = params.row.id;
        const assigned = isResourceAssigned(resourceId);

        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            {/* Assign Button */}
            <Button
              variant="contained"
              color="primary"
              disabled={assigned} // Active if unassigned, inactive if assigned
              onClick={() => handleAssignResource(resourceId)}
            >
              Assign
            </Button>

            {/* Unassign Button */}
            <Button
              variant="contained"
              color="secondary"
              disabled={roleName === "admin" || !assigned} // Disable for admin or if unassigned
              onClick={() => handleUnassignResource(resourceId)}
            >
              Unassign
            </Button>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header subtitle= "Assign Resourse to Role"/>
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={resourses}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
        />
      </Box>
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

export default ListRoles;




