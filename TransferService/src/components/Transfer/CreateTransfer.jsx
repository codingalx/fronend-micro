import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState, useEffect } from "react";
import { Formik } from "formik";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import { TransferType } from "../../constants/enums";
import {
  listDutyStations,
  createTransfer,
  getEmployeeByEmployeeId,
} from "../../Api/transferApi";
import EmployeeTransfers from "./EmployeeTransfers";
import Header from "../common/Header";
import DepartementTree from "../common/DepartementTree";

const CreateTransfer = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const shortEmployeeId = authState.username;

  const [longEmployeeId, setLongEmployeeId] = useState("");
  const [dutyStations, setDutyStations] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState({
    id: "",
    name: "",
  });

  const handleDialogOpen = () => setOpenDialog(true);

  const handleDialogClose = () => setOpenDialog(false);

  const handleDepartmentSelect = (id, name) => {
    setSelectedDepartment({ id, name });
  };

  const handleSaveDepartment = () => {
    if (!selectedDepartment.id || !selectedDepartment.name) {
      setNotification({
        open: true,
        message: "Please select a department before saving.",
        severity: "warning",
      });
      return;
    }
    setOpenDialog(false);
  };

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [refreshKey, setRefreshKey] = useState(0);
  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const initialValues = {
    dutyStationId: "",
    transferType: "",
    comment: "",
    employeeId: longEmployeeId,
  };

  useEffect(() => {
    fetchEmployeeDetails();
    fetchDutyStations();
  }, [tenantId]);

  const fetchEmployeeDetails = async () => {
    try {
      const response = await getEmployeeByEmployeeId(tenantId, shortEmployeeId);
      setLongEmployeeId(response.id);
    } catch (error) {
      console.error(
        "Error fetching employee details:",
        error.response || error.message
      );
    }
  };

  const fetchDutyStations = async () => {
    try {
      const response = await listDutyStations(tenantId);
      setDutyStations(response.data);
    } catch (error) {
      console.error(
        "Error fetching duty stations:",
        error.response || error.message
      );
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      if (!selectedDepartment.id) {
        setNotification({
          open: true,
          message: "Please select a department before submitting.",
          severity: "warning",
        });
        return;
      }

      const formValues = {
        ...values,
        departmentId: selectedDepartment.id,
      };

      const response = await createTransfer(
        tenantId,
        values.employeeId,
        formValues
      );

      if (response.status === 201 || response.status === 200) {
        setNotification({
          open: true,
          message: "Transfer created successfully!",
          severity: "success",
        });
        resetForm();
        setRefreshKey((prev) => prev + 1);
      } else {
        setNotification({
          open: true,
          message: `Error creating transfer. Status code: ${response.status}`,
          severity: "error",
        });
        console.error("Error creating transfer. Status code:", response.status);
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
      } else {
        console.error(
          "An error occurred while adding the transfer:",
          error.message
        );
      }
    }
  };

  const checkoutSchema = yup.object().shape({
    dutyStationId: yup.string().required("Duty Station is required"),
    transferType: yup
      .string()
      .oneOf(Object.values(TransferType))
      .required("Transfer Type is required"),
    comment: yup
      .string()
      .required("Comment is required")
      .max(150, "Comment cannot exceed 150 characters"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create Transfer" /> {/* Use the Header component */}
      <Formik
        initialValues={initialValues}
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
              <TextField
                fullWidth
                type="text"
                label="Department Name"
                value={selectedDepartment.name}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ gridColumn: "span 1" }}
              />
              <Button
                variant="outlined"
                color="primary"
                onClick={handleDialogOpen}
                sx={{ gridColumn: "span 1" }}
              >
                +
              </Button>

              <FormControl sx={{ gridColumn: "span 2" }}>
                <InputLabel id="dutyStation">Duty Station</InputLabel>
                <Select
                  labelId="dutyStation"
                  value={values.dutyStationId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  name="dutyStationId"
                  error={!!touched.dutyStationId && !!errors.dutyStationId}
                >
                  <MenuItem value="">
                    <em>Select Duty Station</em>
                  </MenuItem>
                  {dutyStations.map((dutyStation) => (
                    <MenuItem key={dutyStation.id} value={dutyStation.id}>
                      {dutyStation.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ gridColumn: "span 2" }}>
                <Select
                  label="Transfer Type"
                  value={values.transferType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "transferType" }}
                  error={!!touched.transferType && !!errors.transferType}
                  name="transferType"
                  sx={{ gridColumn: "span 2" }}
                >
                  <MenuItem value="">
                    <em>Transfer Type</em>
                  </MenuItem>
                  <MenuItem value={TransferType.PERMANENT}>Permanent</MenuItem>
                  <MenuItem value={TransferType.TEMPORARY}>Temporary</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="text"
                label="Comment"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.comment}
                name="comment"
                error={!!touched.comment && !!errors.comment}
                helperText={touched.comment && errors.comment}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="text"
                label="Employee ID"
                value={shortEmployeeId}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Transfer
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
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
        <DialogTitle>Select a Department</DialogTitle>
        <DialogContent>
          <DepartementTree
            onNodeSelect={(id, name) => handleDepartmentSelect(id, name)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveDepartment} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Box mt="40px">
        <EmployeeTransfers
          employeeId={initialValues.employeeId}
          refreshKey={refreshKey}
        />
      </Box>
    </Box>
  );
};

export default CreateTransfer;
