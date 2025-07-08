import React, { useState, useEffect, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import ListUsers from "./ListUsers";
import ManageTenantRole from "./ManageTenantRole";
import AuthServiceResourceName from "../../../configuration/AuthServiceResourceName";
import { canAccessResource } from "../../../configuration/SecurityService";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const UserNavigation = () => {
 const [authState] = useAtom(authAtom); 
        const userRoles = authState.roles;

  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  // Permissions
  const [canManageUsers, setCanManageUsers] = useState(false);
  const [canManageRoles, setCanManageRoles] = useState(false);
  const [canManageResources, setCanManageResources] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Adjust based on the screen size

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (index) => {
    setSelectedTab(index);
    handleMenuClose();
  };

  // Check permissions
  const checkPermissions = async () => {
    const manageUsersAccess = await canAccessResource(
      AuthServiceResourceName.GET_ALL_USERS,
      userRoles
    );
    const manageRolesAccess = await canAccessResource(
      AuthServiceResourceName.GET_ALL_RESOURCES,
      userRoles
    );
    const manageResourcesAccess = await canAccessResource(
      AuthServiceResourceName.GET_ALL_ROLES,
      userRoles
    );

    setCanManageUsers(manageUsersAccess);
    setCanManageRoles(manageRolesAccess);
    setCanManageResources(manageResourcesAccess);
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  return (
    <>
      {/* Top Navigation Bar */}
      <AppBar
        position="static"
        sx={{ backgroundColor: "white", color: "black" }}
      >
        <Toolbar>
        
          {/* Tabs for desktop view */}
          {!isMobile ? (
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              textColor="inherit"
              indicatorColor="secondary"
            >
              {canManageUsers && <Tab label="Manage Users" />}
              {canManageRoles && <Tab label="Manage Role" />}
              {/* {canManageResources && <Tab label="Manage Resource" />} */}
            </Tabs>
          ) : (
            // Menu button for mobile view
            <>
              <IconButton edge="end" color="inherit" onClick={handleMenuOpen}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {canManageUsers && (
                  <MenuItem onClick={() => handleMenuItemClick(0)}>
                    Manage Users
                  </MenuItem>
                )}
                {canManageRoles && (
                  <MenuItem onClick={() => handleMenuItemClick(1)}>
                    Manage Role
                  </MenuItem>
                )}
                {/* {canManageResources && (
                  <MenuItem onClick={() => handleMenuItemClick(2)}>
                    Manage Resource
                  </MenuItem>
                )} */}
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Content Area */}
      <Box sx={{ padding: 2 }}>
        {selectedTab === 0 && canManageUsers && <ListUsers />}
        {selectedTab === 1 && canManageRoles && <ManageTenantRole />}
        {/* {selectedTab === 2 && canManageResources && <ManageTenantResource />} */}
      </Box>
    </>
  );
};

export default UserNavigation;