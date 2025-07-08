import { Box, MenuItem, TextField, useMediaQuery } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

// // the following is importing config file to get endpoints stored in one point
import {
  getAllTenantsEndpoint,
  getAllResourcesEndpoint,
} from "../../apiConfig";
import AuthContext from "../Auth/AuthContext";
import Header from "../Header";

const ManageResourceAdmin = () => {
  const { authState } = useContext(AuthContext); // Access authState from context
  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState(null);

  const [selectedTenant, setSelectedTenant] = useState("");
  const [tenantResources, setTenantResources] = useState([]);

  const displayTenants = async () => {
    const { url, headers } = getAllTenantsEndpoint(authState.accessToken); // Get the URL and headers
    try {
      const response = await axios.get(url, { headers }); // Use the headers in the request
      setTenants(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  const fetchTenantResources = async (tenantId) => {
    try {
      const { url, headers } = getAllResourcesEndpoint(authState.accessToken);
      const response = await axios.get(`${url}/${tenantId}/get-all`, {
        headers,
      });

      setTenantResources(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleTenantChange = (event) => {
    const tenantId = event.target.value;
    setSelectedTenant(tenantId);
    if (tenantId) {
      fetchTenantResources(tenantId);
    } else {
      setTenantResources([]);
    }
  };

  useEffect(() => {
    displayTenants();
  }, []);

  const handleCellClick = (params, event) => {
    if (params.field === "delete") {
      event.stopPropagation();
    }
  };

  const columns = [
    { field: "resourceName", headerName: "Resource Name", flex: 2 },
    {
      field: "requiredRoles",
      headerName: "Roles assigned to resource",
      flex: 2,
    },
  ];

  const isNonMobile = useMediaQuery("(min-width:600px)");

  return (
    <Box m="20px">
      <Header title="Manage Resource List" />

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
          select
          label="Filter by Tenant Name"
          fullWidth
          sx={{ gridColumn: "span 4" }}
          value={selectedTenant}
          onChange={handleTenantChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {tenants.map((tenant) => (
            <MenuItem key={tenant.id} value={tenant.id}>
              {tenant.tenantName}
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
            rows={tenantResources.map((resource) => ({
              ...resource,
              id: resource.id,
            }))}
            columns={columns}
          />
        )}
      </Box>
    </Box>
  );
};

export default ManageResourceAdmin;
