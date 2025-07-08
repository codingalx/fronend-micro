import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid, gridColumnGroupsLookupSelector } from "@mui/x-data-grid";
import axios from "axios";

// import "react-confirm-alert/src/react-confirm-alert.css";
// import "../../../css/ConfirmAlertOverride.css";

// the following is importing config file to get endpoints stored in one point
import {
  getAllJobRegistrationsEndpoint,
  getJobGradeEndpoint,
  getJobCategoriesEndpoint,
  getWorkUnitsEndpoint,
  getEducationalLevelsEndpoint,
  getQualificationsEndpoint,
  getDepartmentsEndpoint,
} from "../../../apiConfig";
import Header from "../../Header";

const tenantsID = 1;
const apiEndpointGetDep = getAllJobRegistrationsEndpoint(tenantsID);
const apiEndpointGetJobGradeID = getJobGradeEndpoint(tenantsID);
const apiEndpointGetJobCategoryID = getJobCategoriesEndpoint(tenantsID);
const apiEndpointGetWorkUnitID = getWorkUnitsEndpoint(tenantsID);
const apiEndpointGetEducationLevelID = getEducationalLevelsEndpoint(tenantsID);
const apiEndpointGetQualificationID = getQualificationsEndpoint(tenantsID);
const apiEndpointGetDepartment = getDepartmentsEndpoint(tenantsID);

const SearchJobRegistration = () => {
  const [error, setError] = useState(null);

  const [originalDepartments, setOriginalDepartments] = useState([]); // Holds the original data
  const [searchText, setSearchText] = useState("");

  /* search use of one useEffect best senario for displaying id to name converter without id means from get all get id and get from other api */
  // Assuming you have a state to hold all the data for the grid
  const [gridData, setGridData] = useState([]);

  useEffect(() => {
    // Function to fetch all necessary data
    const fetchData = async () => {
      try {
        // Fetch the initial list of departments
        const response = await axios.get(apiEndpointGetDep);
        const displayElement = response.data;
        setOriginalDepartments(displayElement);

        // Map over the displayElement to fetch additional data
        const dataWithDetails = await Promise.all(
          displayElement.map(async (tenant) => {
            // Fetch additional data based on departmentId
            const departmentResponse = await axios.get(
              `${apiEndpointGetDepartment}/${tenant.departmentId}`
            );
            const educationResponse = await axios.get(
              `${apiEndpointGetEducationLevelID}/${tenant.educationLevelId}`
            );
            const jobCategoryResponse = await axios.get(
              `${apiEndpointGetJobCategoryID}/${tenant.jobCategoryId}`
            );
            const jobGradeResponse = await axios.get(
              `${apiEndpointGetJobGradeID}/${tenant.jobGradeId}`
            );
            const workUnitResponse = await axios.get(
              `${apiEndpointGetWorkUnitID}/${tenant.workUnitId}`
            );
            const qualificationResponse = await axios.get(
              `${apiEndpointGetQualificationID}/${tenant.qualificationId}`
            );

            const departmentName = departmentResponse.data.departmentName;
            const educationLevelName =
              educationResponse.data.educationLevelName;
            const jobCategoryName = jobCategoryResponse.data.jobCategoryName;
            const jobGradeName = jobGradeResponse.data.jobGradeName;
            const workUnitName = workUnitResponse.data.workUnitName;
            const qualification = qualificationResponse.data.qualification;

            // Return the updated tenant object
            return {
              ...tenant,
              departmentName: departmentName,
              educationLevelName: educationLevelName,
              jobCategoryName: jobCategoryName,
              jobGradeName: jobGradeName,
              workUnitName: workUnitName,
              qualification: qualification,
            };
          })
        );

        // Update the state with the new data
        setGridData(dataWithDetails);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle errors as needed
      }
    };

    fetchData();
  }, []); // Dependency array depends on when you want to fetch the data
  /* end of new useeffect */

  const handleSearchChange = (event) => {
    const newSearchText = event.target.value;
    setSearchText(newSearchText);

    if (!newSearchText) {
      // If the search text is empty, reset the displayed data to the original data
      setGridData(originalDepartments);
    } else {
      // Filter the gridData based on the search text
      const searchResults = gridData.filter(
        (tenant) =>
          tenant.jobTitle
            ?.toLowerCase()
            .includes(newSearchText.toLowerCase()) ||
          tenant.jobCode?.toLowerCase().includes(newSearchText.toLowerCase()) ||
          tenant.reportsTo
            ?.toLowerCase()
            .includes(newSearchText.toLowerCase()) ||
          tenant.jobType?.toLowerCase().includes(newSearchText.toLowerCase()) ||
          tenant.duties?.toLowerCase().includes(newSearchText.toLowerCase()) ||
          tenant.skills?.toLowerCase().includes(newSearchText.toLowerCase()) ||
          tenant.minExperience.toString().includes(event.target.value) ||
          tenant.description
            ?.toLowerCase()
            .includes(newSearchText.toLowerCase()) ||
          tenant.alternativeExperience
            ?.toLowerCase()
            .includes(newSearchText.toLowerCase()) ||
          tenant.relativeExperience
            ?.toLowerCase()
            .includes(newSearchText.toLowerCase()) ||
          tenant.departmentName
            ?.toLowerCase()
            .includes(newSearchText.toLowerCase()) ||
          tenant.educationLevelName
            ?.toLowerCase()
            .includes(newSearchText.toLowerCase()) ||
          tenant.jobCategoryName
            ?.toLowerCase()
            .includes(newSearchText.toLowerCase()) ||
          tenant.jobGradeName
            ?.toLowerCase()
            .includes(newSearchText.toLowerCase()) ||
          tenant.workUnitName
            ?.toLowerCase()
            .includes(newSearchText.toLowerCase()) ||
          tenant.qualification
            ?.toLowerCase()
            .includes(newSearchText.toLowerCase())
      );
      setGridData(searchResults); // Update the gridData with the search results
    }
  };

  const columns = [
    { field: "jobTitle", headerName: "Department Name", flex: 5 },
    // { field: "id", headerName: "Job ID", flex: 1 },
    { field: "jobCode", headerName: "Job Code", flex: 2 },
    { field: "reportsTo", headerName: "Reports To", flex: 2 },
    { field: "jobType", headerName: "Job Type", flex: 1 },
    { field: "minExperience", headerName: "Min. Exp.", flex: 1 },
    { field: "duties", headerName: "Duties", flex: 2 },
    { field: "skills", headerName: "Skills", flex: 2 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "alternativeExperience",
      headerName: "Alt. Exp.",
      flex: 2,
    },
    { field: "relativeExperience", headerName: "Rel. Exp.", flex: 2 },
    { field: "departmentName", headerName: "Department", flex: 2 },
    { field: "educationLevelName", headerName: "Edu. Lvl", flex: 2 },
    { field: "jobCategoryName", headerName: "Job Cat.", flex: 2 },
    { field: "jobGradeName", headerName: "Job Gr.", flex: 2 },
    { field: "workUnitName", headerName: "Work Unit", flex: 2 },
    { field: "qualification", headerName: "Qualfication", flex: 2 },
  ];

  return (
    <Box m="20px">
      <Header
        title="SEARCH JOB REGISTRATION"
        subtitle="Search job registration list"
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
          <DataGrid rows={gridData} columns={columns} />
        )}
      </Box>
    </Box>
  );
};

export default SearchJobRegistration;
