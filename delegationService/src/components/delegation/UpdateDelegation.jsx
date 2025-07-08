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
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Formik } from "formik";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import { getDelegationById, getEmployeeByEmployeId, listEmployee, getFileByDelegationId, updateDelegation } from "../../../configuration/DelegationApi";

const UpdateDelegation = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const username = authState.username;
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const [employees, setEmployees] = useState([]);
  const [singleEmployee, setSingleemployee] = useState(null);
  const [delegation, setDelegation] = useState({
    delegatorEmployeeId: "",
    delegateEmployeeId: "",
    startDate: "",
    endDate: "",
    delegationReason: "",
    file: null,
  });

  useEffect(() => {
    fetchAllEmployees();
    fetchEmployeeDetails();
    fetchDelegationById();
    fetchFileOfDelegation();
  }, []);

  const fetchAllEmployees = async () => {
    try {
      const response = await listEmployee(tenantId);
      setEmployees(response.data);
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
      setSingleemployee(data);
      setDelegation((prev) => ({
        ...prev,
        delegatorEmployeeId: data.id,
      }));
    } catch (error) {
      console.error("Failed to fetch employee details:", error);
    }
  };

  const fetchDelegationById = async () => {
    try {
      const response = await getDelegationById(tenantId, id);
      setDelegation(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchFileOfDelegation = async () => {
    try {
      const response = await getFileByDelegationId(tenantId, id);
      const fileUrl = URL.createObjectURL(new Blob([response.data]));
      setFileUrl(fileUrl);
      setFileName(fileUrl.split('/').pop());
    } catch (error) {
      console.error("Failed to fetch the delegation file:", error.message);
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
      const { delegatorEmployeeId, ...submissionData } = values;

      const formData = new FormData();
      formData.append("delegation", new Blob([JSON.stringify(submissionData)], { type: "application/json" }));
      formData.append("file", values.file);
      
      const response = await updateDelegation(tenantId, id, formData);

      if (response.status === 201) {
        setNotification({
          open: true,
          message: "Delegation updated successfully!",
          severity: "success",
        });
        navigate('/employee/delegation');
      } else {
        console.error("Error updating delegation. Status code:", response.status);
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
        setNotification({
          open: true,
          message: "Failed to update delegation. Please try again.",
          severity: "error",
        });
      } else {
        console.error("An error occurred while updating the delegation:", error.message);
      }
    }
  };

  const checkoutSchema = yup.object().shape({
    delegateEmployeeId: yup.string().required("Delegate Employee is required"),
    startDate: yup.date().required("Start Date is required").min(new Date(), "Start date must be in the present or future"),
    endDate: yup.date().required("End Date is required").min(yup.ref('startDate'), "End date must be after start date"),
    delegationReason: yup.string().required("Delegation reason is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Update Delegation" />
      <Formik
        initialValues={delegation}
        validationSchema={checkoutSchema}
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
          setFieldValue,
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
              {/* Display the delegator's full name */}
              {singleEmployee && (
                <Typography variant="body1" sx={{ gridColumn: "span 2" }}>
                  Delegator: {singleEmployee.fullName || singleEmployee.employeeId} {/* Display full name, or employee ID if full name is not available */}
                </Typography>
              )}

              <FormControl
                sx={{ flexGrow: 1, flexShrink: 1, minWidth: 0, gridColumn: "span 2" }}
                error={!!touched.delegateEmployeeId && !!errors.delegateEmployeeId}
              >
                <Autocomplete
                  options={employees}
                  getOptionLabel={(option) => option.fullName || option.employeeId} // Show fullName or employeeId
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

              {/* Display the current file name */}
              {fileName && (
                <Typography variant="body2" sx={{ gridColumn: "span 2" }}>
                  Current File: {fileName} <a href={fileUrl} target="_blank" rel="noopener noreferrer">View</a>
                </Typography>
              )}

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
                Update Delegation
              </Button>
            </Box>
          </form>
        )}
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
    </Box>
  );
};

export default UpdateDelegation;