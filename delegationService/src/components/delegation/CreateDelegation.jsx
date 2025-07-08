import {
  Box,
  Button,
  TextField,
  FormControl,
  Snackbar,
  Alert,
  Autocomplete,
  Typography,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../common/Header";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Formik } from "formik";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import { createDelegation, getallActiveDelegation, getEmployeeByEmployeId, listEmployee } from "../../../configuration/DelegationApi";
import GetAllDelegationsByEmployee from "./GetAllDelegationsByEmployee";

const CreateDelegation = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const username = authState.username;
        const [refreshKey, setRefreshKey] = useState(0);


  const [employees, setEmployees] = useState([]);
  const [singleEmployee, setSingleemployee] = useState(null);
  const [existingDelegations, setExistingDelegations] = useState([]);

  const initialDelegation = {
    delegatorEmployeeId: "",
    delegateEmployeeId: "",
    startDate: "",
    endDate: "",
    delegationReason: "",
    file: null,
  };

  const [delegation, setDelegation] = useState(initialDelegation);
 const delegateEmployeeId = singleEmployee;

  useEffect(() => {
    fetchAllEmployees();
    fetchEmployeeDetails();
    fetchAllDelegation(); // Fetch existing delegations
  }, []);

  const fetchAllEmployees = async () => {
    try {
      const response = await listEmployee(tenantId);
      const filteredEmployees = response.data.filter(employee => employee.id !== singleEmployee);
      setEmployees(filteredEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error.message);
    }
  };


  const fetchEmployeeDetails = async () => {
    try {
      const response = await getEmployeeByEmployeId(tenantId, username);
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = response.data;
      console.log("Fetched employee details:", data);
      setSingleemployee(data.id);
      setDelegation((prev) => ({
        ...prev,
        delegatorEmployeeId: data.id,
      }));

    } catch (error) {
      console.error("Failed to fetch employee details:", error);
    }
  };

  const fetchAllDelegation = async () => {
    try {
      const response = await getallActiveDelegation(tenantId);
      setExistingDelegations(response.data);
    } catch (error) {
      console.error("Error fetching delegations:", error.message);
    }
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setDelegation((prev) => ({
      ...prev,
      file: file,
    }));
  };

  const handleFormSubmit = async (values) => {
    console.log("Submitting form with values:", values);
    try {
      const formData = new FormData();
      formData.append("delegation", new Blob([JSON.stringify(values)], { type: "application/json" }));
      formData.append("file", values.file);
      
      const response = await createDelegation(tenantId, formData);

      if (response.status === 200 || response.status === 201) {
        setNotification({
          open: true,
          message: "Delegation created successfully!",
          severity: "success",
        });
                setRefreshKey(prev => prev + 1);

      } else {
        console.error("Error adding delegation. Status code:", response.status);
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
        setNotification({
          open: true,
          message: "Failed to create delegation. Please try again.",
          severity: "error",
        });
      } else {
        console.error("An error occurred while adding the delegation:", error.message);
      }
    }
  };

  const checkoutSchema = yup.object().shape({
    delegateEmployeeId: yup.string().required("Delegate Employee is required")
      .test('not-self', 'You cannot delegate to yourself', (value) => value !== singleEmployee)
      .test('already-delegating', 'This employee is already representing someone else', (value) => {
        return !existingDelegations.some(delegation => delegation.delegateEmployeeId === value);
      }),
    startDate: yup.date().required("Start Date is required").min(new Date(), "Start date must be in the present or future"),
    endDate: yup.date().required("End Date is required").min(yup.ref('startDate'), "End date must be after start date"),
    delegationReason: yup.string().required("Delegation reason is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create Delegation" />
      <Formik
        initialValues={delegation}
        validationSchema={checkoutSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => {
          // Update delegation state when singleEmployee changes
          useEffect(() => {
            if (singleEmployee) {
              setFieldValue("delegatorEmployeeId", singleEmployee);
            }
          }, [singleEmployee, setFieldValue]);

          return (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <FormControl
                  sx={{ flexGrow: 1, flexShrink: 1, minWidth: 0, gridColumn: "span 2" }}
                  error={!!touched.delegateEmployeeId && !!errors.delegateEmployeeId}
                >
                  <Autocomplete
                    options={employees}
                    getOptionLabel={(option) => option.id ? `${option.employeeId}` : "Unknown Employee"}
                    onChange={(event, newValue) => {
                      console.log("Selected employee:", newValue);
                      setFieldValue("delegateEmployeeId", newValue ? newValue.id : "");
                    }}
                    onBlur={handleBlur}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Employee"
                        variant="outlined"
                        error={!!touched.delegateEmployeeId && !!errors.delegateEmployeeId}
                        helperText={touched.delegateEmployeeId && errors.delegateEmployeeId}
                      />
                    )}
                  />
                </FormControl>

                <TextField
                  fullWidth
                  type="date"
                  label="Start Date"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.startDate}
                  name="startDate"
                  error={!!touched.startDate && !!errors.startDate}
                  helperText={touched.startDate && errors.startDate}
                  sx={{ gridColumn: "span 2" }}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  fullWidth
                  type="date"
                  label="End Date"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.endDate}
                  name="endDate"
                  error={!!touched.endDate && !!errors.endDate}
                  helperText={touched.endDate && errors.endDate}
                  sx={{ gridColumn: "span 2" }}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  fullWidth
                  type="text"
                  label="Delegation Reason"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.delegationReason}
                  name="delegationReason"
                  error={!!touched.delegationReason && !!errors.delegationReason}
                  helperText={touched.delegationReason && errors.delegationReason}
                  sx={{ gridColumn: "span 2" }}
                />

                <TextField
                  type="file"
                  fullWidth
                  name="file"
                  onChange={(e) => {
                    handleFileUpload(e);
                    setFieldValue("file", e.currentTarget.files[0]);
                  }}
                  onBlur={handleBlur}
                  error={!!touched.file && !!errors.file}
                  helperText={touched.file && errors.file}
                  sx={{ gridColumn: "span 2" }}
                />
              </Box>
              <Box display="flex" justifyContent="center" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Create Delegation
                </Button>
              </Box>
            </form>
          );
        }}
      </Formik>
      {/* Snackbar for Notifications */}
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
      {delegateEmployeeId &&
      <GetAllDelegationsByEmployee  delegateEmployeeId={delegateEmployeeId} refreshKey={refreshKey} />
      }
    
    </Box>
  );
};

export default CreateDelegation;