import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
  getAllLocationsEndpoint,
  getAllLocationTypesEndpoint,
} from "../../../configuration/organizationApi";
import Header from "../common/Header";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 



const SearchLocation = () => {
  const [error, setError] = useState(null);
    const [authState] = useAtom(authAtom); 
    const tenantId = authState.tenantId;
const apiEndpointGetLocations = getAllLocationsEndpoint(tenantId);
const apiEndpointGetLocationTypes = getAllLocationTypesEndpoint(tenantId);
  const [locationTypes, setLocationTypes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [originalLocations, setOriginalLocations] = useState([]);
  const [displayedDepartments, setDisplayedDepartments] = useState([]);

  const displayTenants = async () => {
    try {
      const response = await axios.get(apiEndpointGetLocations);
      setOriginalLocations(response.data);
      setDisplayedDepartments(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  const fetchDepartmentTypes = async () => {
    try {
      const response = await axios.get(apiEndpointGetLocationTypes);
      setLocationTypes(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  useEffect(() => {
    displayTenants();
    fetchDepartmentTypes();
  }, []);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    const searchResults = originalLocations.filter(
      (tenant) =>
        tenant.locationName
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        tenant.id.toString().includes(event.target.value)
    );
    setDisplayedDepartments(searchResults);
  };

  const columns = [
    { field: "locationName", headerName: "Location Name", flex: 2 },
    { field: "locationTypes", headerName: "Location Type", flex: 1 },
    { field: "id", headerName: "Location ID", flex: 1 },
    { field: "tenantId", headerName: "Tenant ID", flex: 1 },
    { field: "locationTypeId", headerName: "Location Type ID", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header
        title="SEARCH LOCATION"
        subtitle="Search location by Location Name and Location ID"
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
            rows={displayedDepartments.map((tenants) => ({
              ...tenants,
              id: tenants.id,
              locationTypes: locationTypes.find(
                (type) => type.id === tenants.locationTypeId
              )?.locationTypeName,
            }))}
            columns={columns}
          />
        )}
      </Box>
    </Box>
  );
};

export default SearchLocation;
