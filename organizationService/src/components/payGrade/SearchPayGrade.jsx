import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Header from "../common/Header";

import {
  getAllDepartmentsEndpoint,
  getAllDepartmentTypesEndpoint,
} from "../../../configuration/organizationApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';



const SearchPayGrade = () => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;
const apiEndpointGetDep = getAllDepartmentsEndpoint(tenantId);
const apiEndpointGetType = getAllDepartmentTypesEndpoint(tenantId);
  const userRoles = authState.roles;
  const [error, setError] = useState(null);
  const [departmentTypes, setDepartmentTypes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [originalDepartments, setOriginalDepartments] = useState([]);
  const [displayedDepartments, setDisplayedDepartments] = useState([]);

  const displayTenants = async () => {
    try {
      const response = await axios.get(apiEndpointGetDep);
      setOriginalDepartments(response.data);
      setDisplayedDepartments(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  const fetchDepartmentTypes = async () => {
    try {
      const response = await axios.get(apiEndpointGetType);
      setDepartmentTypes(response.data);
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
    const searchResults = originalDepartments.filter(
      (tenant) =>
        tenant.departmentName
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        tenant.id.toString().includes(event.target.value) ||
        tenant.establishedDate.toString().includes(event.target.value)
    );
    setDisplayedDepartments(searchResults);
  };

  const columns = [
    { field: "departmentName", headerName: "Department Name", flex: 2 },
    { field: "departmentTypes", headerName: "Department Type", flex: 1 },
    { field: "establishedDate", headerName: "Established Date", flex: 1 },
    { field: "id", headerName: "ID", flex: 1 },
    { field: "tenantId", headerName: "Tenant ID", flex: 1 },
    { field: "departmentTypeId", headerName: "Dep Type ID", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header title="SEARCH PAY GRADE" subtitle="Search pay grade list" />
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
              departmentTypes: departmentTypes.find(
                (type) => type.id === tenants.departmentTypeId
              )?.departmentTypeName,
            }))}
            columns={columns}
          />
        )}
      </Box>
    </Box>
  );
};

export default SearchPayGrade;
