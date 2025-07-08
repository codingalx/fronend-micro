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
import { createDiscipline, getAllOffenses } from "../../Api/disciplineApi";
import { getAllEmployees, getEmployeeById } from "../../Api/disciplineApi";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../common/Header";
import ListDisciplineUser from "./ListDisciplineUSer";

const CreateDiscipline = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [employees, setEmployees] = useState([]);
  const [offenses, setOffenses] = useState([]);
  const [offenderName, setOffenderName] = useState("");
  const [offenderEmployee, setOffenderEmployee] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const employeeId = authState.username;
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchEmployees = async () => {
    if (!tenantId) {
      console.error("Tenant ID is not set. Cannot fetch employees.");
      return;
    }

    try {
      const response = await getAllEmployees(tenantId);
      if (response.status === 200) {
        setEmployees(response.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error.response || error);
      setNotification({
        open: true,
        message: "Failed to fetch employees: " + (error.response?.data?.message || error.message),
        severity: "error",
      });
    }
  };

  const fetchOffenses = async () => {
    if (!tenantId) return;

    try {
      const response = await getAllOffenses(tenantId);
      if (response.status === 200) {
        setOffenses(response.data);
      }
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
    if (!tenantId || !employeeId) return;

    try {
      const response = await getEmployeeById(tenantId, employeeId);
      if (response.status === 200) {
        setOffenderEmployee(response.data);
        const { firstName, middleName, lastName } = response.data;
        const fullName = [firstName, middleName, lastName].filter(Boolean).join(" ");
        setOffenderName(fullName);
      }
    } catch (error) {
      console.error("Error fetching offender details:", error);
      setNotification({
        open: true,
        message: "Failed to load your employee details",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchOffenses();
    fetchOffenderDetails();
  }, []);

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
    setSearchInput(`${employee.firstName} ${employee.lastName} (${employee.employeeId})`);
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
      const disciplineData = {
        employeeId: selectedEmployee.id,
        offenderId: offenderEmployee.id,
        offenseId: values.offenseId,
        repetition: values.repetition,
        offenseDate: formattedDate,
        description: values.description,
        remark: values.remark
      };

      const response = await createDiscipline(tenantId, disciplineData);

      if (response.status === 201) {
        setNotification({
          open: true,
          message: "Discipline record created successfully!",
          severity: "success",
        });
        resetForm();
        setSelectedEmployee(null);
        setSearchInput("");
        setRefreshKey(prev => prev + 1);
      } else {
        setNotification({
          open: true,
          message: "Error creating discipline record. Please try again.",
          severity: "error",
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || "An error occurred. Please try again.",
        severity: "error",
      });
      console.error("Error creating discipline record:", error);
    }
  };

  const initialValues = {
    offenseId: "",
    repetition: 0,
    offenseDate: new Date().toISOString().split('T')[0],
    description: "",
    remark: ""
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

  return (
    <Box m="20px">
      <Header subtitle="Create Discipline" />
      <Formik
        initialValues={initialValues}
        validationSchema={disciplineSchema}
        onSubmit={handleFormSubmit}
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
                          {`${employee.firstName} ${employee.middleName}  ${employee.lastName} (${employee.employeeId})`}
                        </Box>
                      ))}
                    </Box>
                  )
                }
              </Box>

              
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
                Create Discipline Record
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
      <ListDisciplineUser refreshKey={refreshKey} />
    </Box>
  );
};

export default CreateDiscipline;