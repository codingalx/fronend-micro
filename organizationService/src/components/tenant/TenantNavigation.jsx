import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import ListTenant from "./ListTenant";
import CreateTenant from "./CreateTenant";
import SearchTenant from "./SearchTenant";
import SearchTenantID from "./SearchTenantID";
import ManageResourceAdmin from "./ManageResourceAdmin";

const TenantNavigation = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

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

  return (
    <>
      {/* Top Navigation Bar */}
      <AppBar
        position="static"
        sx={{ backgroundColor: "white", color: "black" }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Manage Tenants
          </Typography>

          {/* Tabs for desktop view */}
          {!isMobile ? (
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              textColor="inherit"
              indicatorColor="secondary"
            >
              <Tab label="List Tenants" />
              <Tab label="Add Tenant" />
              <Tab label="Search Tenant" />
              <Tab label="Search Tenant By ID" />
              <Tab label="Manage Resource" />
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
                <MenuItem onClick={() => handleMenuItemClick(0)}>
                  List Tenants
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick(1)}>
                  Add Tenant
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick(2)}>
                  Search Tenant
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick(3)}>
                  Search Tenant By ID
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick(4)}>
                  Manage Resource
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Content Area */}
      <Box sx={{ padding: 2 }}>
        {selectedTab === 0 && <ListTenant />}
        {selectedTab === 1 && <CreateTenant />}
        {selectedTab === 2 && <SearchTenant />}
        {selectedTab === 3 && <SearchTenantID />}
        {selectedTab === 4 && <ManageResourceAdmin />}
      </Box>
    </>
  );
};

export default TenantNavigation;
