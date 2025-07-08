import {
  Box,
  InputAdornment,
  MenuItem,
  TextField,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { getAllResourcesEndpoint, defaultResource } from ".././../../configuration/authApi";
import SearchIcon from "@mui/icons-material/Search"; // For search icon
import Header from "./Header";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

const ManageTenantResource = () => {
  const [authState] = useAtom(authAtom); 
          const tenantId = authState.tenantId

  const [tenants, setTenants] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]); // State to handle filtered tenants
  const [error, setError] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0); // State to trigger re-fetch
  const [serviceNames, setServiceNames] = useState([]); // State for service names
  const [selectedServiceName, setSelectedServiceName] = useState(""); // State for selected service name
  const [searchQuery, setSearchQuery] = useState(""); // State to hold the search query

  // Fetch all tenants/resources initially
  const displayTenants = async () => {
    const { url, headers } = getAllResourcesEndpoint(authState.accessToken); // Get the URL and headers
    try {
      const response = await axios.get(`${url}/${tenantId}/get-all`, {
        headers,
      });
      setTenants(response.data);
      setFilteredTenants(response.data); // Initially, display all tenants
      console.log(response.data);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  // Extract unique service names from the tenant data
  const extractServiceNames = (data) => {
    const services = data.map((resource) => resource.serviceName);
    // Remove duplicates
    return [...new Set(services)];
  };

  // Fetch service names for the dropdown
  const fetchServiceNames = async () => {
    const { url, headers } = getAllResourcesEndpoint(authState.accessToken); // Get the URL and headers
    try {
      const response = await axios.get(`${url}/${tenantId}/get-all`, {
        headers,
      });
      const uniqueServiceNames = extractServiceNames(response.data);
      setServiceNames(uniqueServiceNames); // Store the unique service names
    } catch (error) {
      setError("Failed to load service names.");
      console.log(error.message);
    }
  };

  // Fetch tenants/resources by selected service name
  const fetchTenantsByServiceName = async (serviceName) => {
    try {
      const response = await axios.get(
        `${defaultResource}/${tenantId}/get/service-name?serviceName=${serviceName}`,
        {
          headers: {
            Authorization: `Bearer ${authState.accessToken}`,
          },
        }
      );
      setTenants(response.data);
      setFilteredTenants(response.data); // Update filtered tenants based on the service name
    } catch (error) {
      setError("Failed to load tenants for selected service.");
      console.log(error.message);
    }
  };

  useEffect(() => {
    displayTenants();
    fetchServiceNames(); // Fetch service names when the component mounts
  }, [reloadTrigger]);

  const handleServiceChange = (event) => {
    const serviceName = event.target.value;
    setSelectedServiceName(serviceName);
    fetchTenantsByServiceName(serviceName); // Fetch tenants when a service is selected
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter tenants based on resource name
    const filtered = tenants.filter((tenant) =>
      tenant.resourceName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTenants(filtered);
  };

  const handleCellClick = (params, event) => {
    if (params.field === "delete") {
      event.stopPropagation();
    }
  };

  const columns = [
    { field: "resourceName", headerName: "Resource Name", flex: 2.5 },
    { field: "requiredRoles", headerName: "Required Roles", flex: 1 },
  ];

  const isNonMobile = useMediaQuery("(min-width:600px)");

  return (
    <Box m="20px">
      <Header title="Manage Resource" />
      {/* Search Field */}
      <Box
        m="20px 0"
        display="grid"
        gap="30px"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        sx={{
          "& > div": { gridColumn: isNonMobile ? undefined : "span 0" },
        }}
        className="form-group"
      >
        <TextField
          fullWidth
          label="Search by Resource Name"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ gridColumn: "span 2" }}
        />
        <TextField
          select
          label="Filter by Service Name"
          value={selectedServiceName}
          onChange={handleServiceChange}
          fullWidth
          sx={{ gridColumn: "span 2" }}
        >
          {serviceNames.map((service, index) => (
            <MenuItem key={index} value={service}>
              {service}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {},
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
          },
        }}
      >
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <DataGrid
            onCellClick={handleCellClick}
            rows={filteredTenants.map((tenant) => ({
              ...tenant,
              id: tenant.id,
            }))}
            columns={columns}
          />
        )}
      </Box>
    </Box>
  );
};

export default ManageTenantResource;
