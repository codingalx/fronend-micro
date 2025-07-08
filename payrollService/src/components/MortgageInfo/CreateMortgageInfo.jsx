import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  Autocomplete,
  MenuItem,
  FormHelperText,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import Header from "../common/Header";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import {
  createMortgageInfos,
  getAllpayEmployeeEarningDeduction,
  getAllpayLocationGroup,
  listEmployee,
} from "../../../Api/payrollApi";
// import GetAllLeaveAdvancePayment from "./GetAllLeaveAdvancePayment";

const CreateMortgageInfo = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };
  const [authState] = useAtom(authAtom); // Access the shared authentication state
  const tenantId = authState.tenantId;

  const [refreshKey, setRefreshKey] = useState(0);
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [payLocationAndGroups, setPayLocationAndGroups] = useState([]);
      const [erningEmployeeErningDeduction, setErningEmployeeErningDeduction] = useState([]);
  

  useEffect(() => {
    fetchAllEmployee();
    fetchAllLocationGroup();
    fetchAllEmployeeErningDeduction();

  }, []);

  const fetchAllEmployee = async () => {
    try {
      const response = await listEmployee(tenantId);
      const data = response.data;
      setEmployeeData(data);
    } catch (error) {
      console.error("Error fetching employees:", error.message);
    }
  };
  
   const fetchAllEmployeeErningDeduction = async () => {
      try {
        const response = await getAllpayEmployeeEarningDeduction();
        const data = response.data;
        setErningEmployeeErningDeduction(data);
      } catch (error) {
        console.error(
          "Error fetching fetch all employee erning dedeuction:",
          error.message
        );
      }
    };

  const fetchAllLocationGroup = async () => {
    try {
      const response = await getAllpayLocationGroup();
      const data = response.data;
      setPayLocationAndGroups(data);
    } catch (error) {
      console.error("Error fetching pay location group:", error.message);
    }
  };

  

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      await createMortgageInfos({ ...values, employeeId });
      setNotification({
        open: true,
        message: "Leave advance payment created successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey((prev) => prev + 1);
      setEmployeeId("");
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to create Leave advance payment. Please try again.",
        severity: "error",
      });
    }
  };




  const initialValues = {
    employeeEarningDeductionId: "",
    payLocationAndGroupId: "",
    receiverName: "",
    bankName: "",
    bankBranch: "",
    bankAccount: "",
    appliedFrom: "",
    appliedTo: "",
    status: "",
  };

  const checkoutSchema = yup.object().shape({
    employeeEarningDeductionId: yup
      .string()
      .required("employeeEarningDeductionId from is required"),
    payLocationAndGroupId: yup
      .string()
      .required("payLocationAndGroupId from is required"),
    receiverName: yup.string().required("receiverName from is required"),

    appliedFrom: yup.string().required("applied from is required"),
    bankName: yup.string().required("bank Name is required"),
    bankBranch: yup.string().required("bank Branch is required"),
    bankAccount: yup.string().required("bank Account is required"),
    status: yup.string().required("status is required"),

    appliedTo: yup.string().required("appliedT to is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create Mortgage Information" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
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
              gridTemplateColumns="repeat(2, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
              }}
            >
              <Autocomplete
                options={employeeData}
                getOptionLabel={(option) => option.employeeId} // Adjust based on your data
                onChange={(event, newValue) => {
                  setEmployeeId(newValue ? newValue.id : ""); // Assuming `id` is the employee ID
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Employee"
                    variant="outlined"
                    error={!!touched.employeeId && !!errors.employeeId}
                    helperText={touched.employeeId && errors.employeeId}
                    sx={{ gridColumn: "span 2" }}
                  />
                )}
              />

              <FormControl
                sx={{ flexGrow: 1, flexShrink: 1, minWidth: 0 }}
                error={
                  !!touched.payLocationAndGroupId &&
                  !!errors.payLocationAndGroupId
                }
              >
                <InputLabel id="paylocation-label">
                  pay locationc location
                </InputLabel>
                <Select
                  labelId="paylocation-label"
                  value={values.payLocationAndGroupId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="payLocationAndGroupId"
                >
                  <MenuItem value="">
                    <em>Select Pay Location Group</em>
                  </MenuItem>
                  {payLocationAndGroups.map((payLocationAndGroup) => (
                    <MenuItem
                      key={payLocationAndGroup.id}
                      value={payLocationAndGroup.id}
                    >
                      {payLocationAndGroup.payGroup}
                    </MenuItem>
                  ))}
                </Select>

                {touched.payLocationAndGroupId &&
                  errors.payLocationAndGroupId && (
                    <FormHelperText>
                      {errors.payLocationAndGroupId}
                    </FormHelperText>
                  )}
              </FormControl>

                <FormControl
                sx={{ flexGrow: 1, flexShrink: 1, minWidth: 0 }}
                error={
                  !!touched.employeeEarningDeductionId &&
                  !!errors.employeeEarningDeductionId
                }
              >
                <InputLabel id="paylocation-label">
                  Select employee Earning Deduction
                </InputLabel>
                <Select
                  labelId="employeeEarningDeductionId-label"
                  value={values.employeeEarningDeductionId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="employeeEarningDeductionId"
                >
                  <MenuItem value="">
                    <em>Select employee Earning Deduction</em>
                  </MenuItem>
                  {erningEmployeeErningDeduction.map((erning) => (
                    <MenuItem
                      key={erning.id}
                      value={erning.id}
                    >
                      {erning.id}
                    </MenuItem>
                  ))}
                </Select>

                {touched.employeeEarningDeductionId &&
                  errors.employeeEarningDeductionId && (
                    <FormHelperText>
                      {errors.employeeEarningDeductionId}
                    </FormHelperText>
                  )}
              </FormControl>



              

              <TextField
                fullWidth
                type="text"
                label="bank Account"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.bankAccount}
                name="bankAccount"
                error={!!touched.bankAccount && !!errors.bankAccount}
                helperText={touched.bankAccount && errors.bankAccount}
                sx={{ gridColumn: "span 1" }}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                type="text"
                label="bank Branch"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.bankBranch}
                name="bankBranch"
                error={!!touched.bankBranch && !!errors.bankBranch}
                helperText={touched.bankBranch && errors.bankBranch}
                sx={{ gridColumn: "span 1" }}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                type="text"
                label="bank Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.bankName}
                name="bankName"
                error={!!touched.bankName && !!errors.bankName}
                helperText={touched.bankName && errors.bankName}
                sx={{ gridColumn: "span 1" }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="text"
                label="receiver Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.receiverName}
                name="receiverName"
                error={!!touched.receiverName && !!errors.receiverName}
                helperText={touched.receiverName && errors.receiverName}
                sx={{ gridColumn: "span 1" }}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                type="date"
                label="Applied From"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.appliedFrom}
                name="appliedFrom"
                error={!!touched.appliedFrom && !!errors.appliedFrom}
                helperText={touched.appliedFrom && errors.appliedFrom}
                sx={{ gridColumn: "span 1" }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="date"
                label="End Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.appliedTo}
                name="appliedTo"
                error={!!touched.appliedTo && !!errors.appliedTo}
                helperText={touched.appliedTo && errors.appliedTo}
                sx={{ gridColumn: "span 1" }}
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth sx={{ gridColumn: "span 1", mb: 2 }}>
                <InputLabel id="Payrollperiod-status-label">Status</InputLabel>
                <Select
                  labelId="Payrollperiod -status-label"
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "delivery status" }}
                  name="status" // Corrected name
                  error={!!touched.status && !!errors.status} // Corrected error handling
                  sx={{
                    flexGrow: 1,
                    flexShrink: 1,
                    minWidth: 0,
                    gridColumn: "span 2",
                  }}
                >
                  <MenuItem value=""></MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="INACTIVE">InActive</MenuItem>
                </Select>
                {touched.status && errors.status && (
                  <FormHelperText error>{errors.status}</FormHelperText>
                )}
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Mortgage Info
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
      {/* <GetAllLeaveAdvancePayment refreshKey={refreshKey} /> */}
    </Box>
  );
};

export default CreateMortgageInfo;
