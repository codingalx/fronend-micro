import { Box, TextField } from "@mui/material";

import { useEffect, useState, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

// the following is importing config file to get endpoints stored in one point
import { getAllTenantsEndpoint } from "../../apiConfig";
import AuthContext from "../Auth/AuthContext";
import Header from "../Header";

// const apiEndpointGet = getAllTenantsEndpoint();

const SearchTenant = () => {
  /* this is the display tenant list and search functionality begin */
  const { authState } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [originalTenants, setOriginalTenants] = useState([]);
  const [displayedTenants, setDisplayedTenants] = useState([]);

  const displayTenants = async () => {
    const { url, headers } = getAllTenantsEndpoint(authState.accessToken);
    try {
      const response = await axios.get(url, { headers });
      setOriginalTenants(response.data);
      setDisplayedTenants(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  useEffect(() => {
    displayTenants();
  }, []);

  const columns = [
    { field: "tenantName", headerName: "Tenant Name", flex: 2 },
    { field: "abbreviatedName", headerName: "Abbreviated Name", flex: 1 },
    { field: "establishedYear", headerName: "Established Date", flex: 1 },
  ];

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    const searchResults = originalTenants.filter(
      (tenant) =>
        tenant.tenantName
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        tenant.abbreviatedName
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        tenant.id.toString().includes(event.target.value) ||
        tenant.establishedYear.toString().includes(event.target.value)
    );
    setDisplayedTenants(searchResults);
  };

  /* End of display tenant list and search */

  return (
    <Box m="20px">
      <Header
        title="Search Tenant - Frontend"
        // subtitle="Search tenant list by any field"
      />
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
          "& .name-column--cell": {},
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {},
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
          },
          "& .MuiCheckbox-root": {},
        }}
      >
        <TextField
          type="search"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search..."
          fullWidth
        />
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <DataGrid
            rows={displayedTenants.map((tenants) => ({
              ...tenants,
              id: tenants.id,
            }))}
            columns={columns}
            disableSelectionOnClick
          />
        )}
      </Box>
    </Box>
  );
};

export default SearchTenant;
