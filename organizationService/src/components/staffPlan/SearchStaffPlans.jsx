import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
  getAllStaffPlansEndpoint,
  getJobGradeEndpoint,
  getJobRegistrationsEndpoint,
} from "../../../configuration/organizationApi";
import Header from "../common/Header";



const SearchStaffPlans = () => {
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [authState] = useAtom(authAtom); 
const tenantId = authState.tenantId;

const apiEndpointGetStaffPlan = getAllStaffPlansEndpoint(tenantId);
const apiEndpointGetJobGrade = getJobGradeEndpoint(tenantId);
const apiEndpointGetJobRegistration = getJobRegistrationsEndpoint(tenantId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const staffPlansResponse = await axios.get(apiEndpointGetStaffPlan);
        const staffPlans = staffPlansResponse.data;

        const rowsData = await Promise.all(
          staffPlans.map(async (plan) => {
            const jobRegistrationResponse = await axios.get(
              `${apiEndpointGetJobRegistration}/${plan.jobRegistrationId}`
            );
            const jobRegistration = jobRegistrationResponse.data;


            const jobGradeResponse = await axios.get(
              `${apiEndpointGetJobGrade}/${jobRegistration.jobGradeId}`
            );

            const jobGrade = jobGradeResponse.data;

            return {
              id: plan.id,
              ...plan,
              jobTitle: jobRegistration.jobTitle,
              jobCode: jobRegistration.jobCode,
              jobGradeName: jobGrade.jobGradeName,
            };
          })
        );

        setRows(rowsData);
        // Initially, filteredRows is the same as the full dataset
        setFilteredRows(rowsData);
      } catch (error) {
        setError(error.message);
        console.log(error.message);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchText(value);

    const filtered = rows.filter((row) => {
      return (
        row.jobTitle.toLowerCase().includes(value) ||
        row.quantity.toString().includes(value) ||
        row.jobCode.toLowerCase().includes(value) ||
        row.jobGradeName.toLowerCase().includes(value)
      );
    });

    setFilteredRows(filtered);
  };

  const columns = [
    { field: "jobTitle", headerName: "Job Title", flex: 2 },
    { field: "quantity", headerName: "No. of Emp. Needs", flex: 1 },
    { field: "jobCode", headerName: "Job Code", flex: 1 },
    { field: "jobGradeName", headerName: "Job Grade", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header
        title="SEARCH STAFF PLAN"
        subtitle="Searching the staff plan list by Job Title, Quantity, Job Code and Job Grade"
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
            // Use filteredRows here
            rows={filteredRows}
            columns={columns}
            pageSize={5}
          />
        )}
      </Box>
    </Box>
  );
};

export default SearchStaffPlans;
