import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import { updateDiscipline, getDiscipline, getAllOffenses, getAllEmployees, getEmployeeById,getEmployeeByEId } from "../../Api/disciplineApi";
import { useLocation, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import NoPageHandle from "../../common/NoPageHandle";
import Header from "../../common/Header";

const UpdateDiscipline = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { disciplineId } = location.state || {};
  
  const [employees, setEmployees] = useState([]);
  const [offenses, setOffenses] = useState([]);
  const [offenderName, setOffenderName] = useState("");
  const [offenderEmployee, setOffenderEmployee] = useState(null);
  const [disciplineData, setDisciplineData] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const employeeId = authState.username;
  const [refreshKey, setRefreshKey] = useState(0);


  const initialValues = {
    offenseId: disciplineData?.offenseId || "",
    repetition: disciplineData?.repetition || 0,
    offenseDate: disciplineData?.offenseDate 
      ? disciplineData.offenseDate.split('T')[0] 
      : new Date().toISOString().split('T')[0],
    description: disciplineData?.description || "",
    remark: disciplineData?.remark || ""
  };
  useEffect(() => {
    fetchEmployees();
    fetchOffenses();
    fetchOffenderDetails();
  }, []);

  useEffect(() => { 
    if (disciplineId) {
      fetchDiscipline();
    }
  }, [disciplineId]);

  const fetchEmployees = async () => {
    try {
      const response = await getAllEmployees(tenantId);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setNotification({
        open: true,
        message: "Failed to fetch employees",
        severity: "error",
      });
    }
  };

  const fetchOffenses = async () => {
    try {
      const response = await getAllOffenses(tenantId);
      setOffenses(response.data);
    } catch (error) {
      console.error("Error fetching offenses:", error);
      setNotification({
        open: true,
        message: "Failed to load offenses",
        severity: "error",
      });
    }
  };

  const fetchOffenderDetails = async () => {
    try {
      const response = await getEmployeeById(tenantId, employeeId);
      setOffenderEmployee(response.data);
      const { firstName, middleName, lastName } = response.data;
      setOffenderName([firstName, middleName, lastName].filter(Boolean).join(" "));
    } catch (error) {
      console.error("Error fetching offender details:", error);
      setNotification({
        open: true,
        message: "Failed to load your employee details",
        severity: "error",
      });
    }
  };

  const fetchDiscipline = async () => {
    try {
      const response = await getDiscipline(tenantId, disciplineId);
      setDisciplineData(response.data);
      
      // Get the employee details directly using the employeeId from discipline data
      const employeeResponse = await getEmployeeByEId(tenantId, response.data.employeeId);
      if (employeeResponse.data) {
        setSelectedEmployee(employeeResponse.data);
        setSearchInput(`${employeeResponse.data.firstName} ${employeeResponse.data.middleName} ${employeeResponse.data.lastName} (${employeeResponse.data.employeeId})`);
      }
    } catch (error) {
      console.error("Error fetching discipline record:", error);
      setNotification({
        open: true,
        message: "Failed to load discipline record",
        severity: "error",
      });
    }
  };
  const handleEmployeeSearch = (inputValue) => {
    setSearchInput(inputValue);
    if (inputValue.length > 0) {
      const filtered = employees.filter(employee =>
        employee.employeeId.toLowerCase().includes(inputValue.toLowerCase()) ||
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredEmployees(filtered);
      setShowEmployeeDropdown(filtered.length > 0);
    } else {
      setFilteredEmployees([]);
      setShowEmployeeDropdown(false);
    }
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setSearchInput(`${employee.firstName} ${employee.middleName} ${employee.lastName} (${employee.employeeId})`);
    setShowEmployeeDropdown(false);
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      if (!offenderEmployee) {
        throw new Error("Offender employee data not loaded");
      }
      if (!selectedEmployee) {
        throw new Error("Please select an employee");
      }

      const formattedDate = `${values.offenseDate}T00:00:00`;
      const updateData = {
        employeeId: selectedEmployee.id,
        offenderId: offenderEmployee.id,
        offenseId: values.offenseId,
        repetition: values.repetition,
        offenseDate: formattedDate,
        description: values.description,
        remark: values.remark
      };

      await updateDiscipline(tenantId, disciplineId, updateData);

      setNotification({
        open: true,
        message: "Discipline record updated successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey(prev => prev + 1);
      navigate(-1);
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || "Failed to update discipline record",
        severity: "error",
      });
      console.error("Error updating discipline record:", error);
    }
  };

  const disciplineSchema = Yup.object().shape({
    offenseId: Yup.string().required("Offense is required"),
    repetition: Yup.number()
      .required("Repetition is required")
      .min(0, 'Repetition must be at least 0'),
    offenseDate: Yup.date().required("Offense date is required"),
    description: Yup.string().required("Description is required"),
    remark: Yup.string()
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  if (!disciplineId) {
    return (
      <NoPageHandle
        message="No discipline record selected for update."
        navigateTo="/discipline/create-discipline"
      />
    );
  }

  if (!disciplineData) {
    return <Box>Loading discipline record...</Box>;
  }

  return (
    <Box m="20px">
      <Header subtitle="Update Discipline Record" />
      <Formik
       initialValues={initialValues} 
        validationSchema={disciplineSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {/* Employee Search */}
              <Box sx={{ gridColumn: "span 2", position: "relative" }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Search Employee by ID or Name"
                  value={searchInput}
                  onChange={(e) => handleEmployeeSearch(e.target.value)}
                />
                {
                  showEmployeeDropdown && (
                    <Box
                      sx={{
                        position: "absolute",
                        width: "100%",
                        maxHeight: "200px",
                        overflowY: "auto",
                        bgcolor: "background.paper",
                        backgroundColor: "white",
                        boxShadow: 3,
                        zIndex: 1300,
                        mt: 1,
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        '&::-webkit-scrollbar': {
                          width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                          background: '#f1f1f1',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: '#888',
                          borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                          background: '#555',
                        }
                      }}
                    >
                      {filteredEmployees.map((employee) => (
                        <Box
                          key={employee.employeeId}
                          onClick={() => handleEmployeeSelect(employee)}
                          sx={{
                            p: 1,
                            cursor: "pointer",
                            "&:hover": {
                              bgcolor: "#f5f5f5",
                            },
                          }}
                        >
                          {`${employee.firstName} ${employee.middleName} ${employee.lastName} (${employee.employeeId})`}
                        </Box>
                      ))}
                    </Box>
                  )
                }
              </Box>

              {/* Offender (logged-in user) - Readonly field */}
              <TextField
                fullWidth
                variant="outlined"
                label="Offender"
                value={offenderName}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ gridColumn: "span 2" }}
              />

              {/* Offense ID Dropdown */}
              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel id="offense-label">Offense</InputLabel>
                <Select
                  labelId="offense-label"
                  value={values.offenseId}
                  onChange={handleChange}
                  name="offenseId"
                  label="Offense"
                  error={!!touched.offenseId && !!errors.offenseId}
                  onBlur={handleBlur}
                >
                  <MenuItem value="">
                    <em>--Select an Offense--</em>
                  </MenuItem>
                  {offenses.map((offense) => (
                    <MenuItem key={offense.id} value={offense.id}>
                      {offense.name || offense.offenseName} 
                    </MenuItem>
                  ))}
                </Select>
                {touched.offenseId && errors.offenseId && (
                  <Box color="red" fontSize="12px">{errors.offenseId}</Box>
                )}
              </FormControl>

              {/* Repetition */}
              <TextField
                fullWidth
                variant="outlined"
                type="number"
                label="Repetition"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.repetition}
                name="repetition"
                error={!!touched.repetition && !!errors.repetition}
                helperText={touched.repetition && errors.repetition}
                sx={{ gridColumn: "span 2" }}
              />

              {/* Offense Date */}
              <TextField
                fullWidth
                variant="outlined"
                type="date"
                label="Offense Date"
                InputLabelProps={{ shrink: true }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.offenseDate}
                name="offenseDate"
                error={!!touched.offenseDate && !!errors.offenseDate}
                helperText={touched.offenseDate && errors.offenseDate}
                sx={{ gridColumn: "span 2" }}
              />

              {/* Description */}
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                label="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
                multiline
                rows={4}
              />
            </Box>

            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update Discipline Record
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateDiscipline;