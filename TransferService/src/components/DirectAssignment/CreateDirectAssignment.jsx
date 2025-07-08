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
import { useState } from "react";
import { Formik } from "formik";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import { MovementType } from "../../constants/enums";
import {
  createDirectAssignment,
  getEmployeeByEmployeeId,
} from "../../Api/directAssignmentApi";
import ListDirectAssignment from "./ListDirectAssignment";
import Header from "../common/Header";
import DepartementTree from "../common/DepartementTree";

const CreateDirectAssignment = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [employeeError, setEmployeeError] = useState("");

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

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

  const intialValue = {
    employeeId: "",
    movementType: "",
    referenceNumber: "",
    remark: "",
  };

  const validateEmployeeId = async (shortEmployeeId) => {
    try {
      const response = await getEmployeeByEmployeeId(tenantId, shortEmployeeId);
      setEmployeeError("");
      return response.id;
    } catch (error) {
      setEmployeeError("Employee ID does not exist.");
      return null;
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    const longEmployeeId = await validateEmployeeId(values.employeeId);
    if (!longEmployeeId) {
      return;
    }

    const requestBody = {
      ...values,
      employeeId: longEmployeeId,
      departmentId: selectedDepartment.id,
    };

    try {
      const response = await createDirectAssignment(tenantId, requestBody);

      if (response.status === 201 || response.status === 200) {
        setNotification({
          open: true,
          message: "Direct assignment created successfully!",
          severity: "success",
        });
        resetForm();
        setRefreshKey((prev) => prev + 1);
      } else {
        setNotification({
          open: true,
          message: `Error creating direct assignment. Status code: ${response.status}`,
          severity: "error",
        });
        console.error(
          "Error creating direct assignment. Status code:",
          response.status
        );
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
      } else {
        console.error(
          "An error occurred while adding the direct assignment:",
          error.message
        );
      }
    }
  };

  const checkoutSchema = yup.object().shape({
    employeeId: yup.string().required("Employee ID is required"),
    movementType: yup
      .string()
      .oneOf(Object.values(MovementType))
      .required("Movement Type is required"),
    referenceNumber: yup.number().required("Reference Number is required"),
    remark: yup.string().required("Remark is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create Direct Assignment" />{" "}
      <Formik
        initialValues={intialValue}
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
                label="Employee ID"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.employeeId}
                name="employeeId"
                error={
                  !!touched.employeeId &&
                  (!!errors.employeeId || !!employeeError)
                }
                helperText={
                  touched.employeeId && (errors.employeeId || employeeError)
                }
                sx={{ gridColumn: "span 2" }}
              />

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

              <TextField
                fullWidth
                type="text"
                label="Remark"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.remark}
                name="remark"
                error={!!touched.remark && !!errors.remark}
                helperText={touched.remark && errors.remark}
                sx={{ gridColumn: "span 2" }}
              />

              <FormControl sx={{ gridColumn: "span 2" }}>
                <InputLabel id="movementType">Movement Type</InputLabel>
                <Select
                  labelId="movementType"
                  value={values.movementType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  name="movementType"
                  error={!!touched.movementType && !!errors.movementType}
                >
                  <MenuItem value="">
                    <em>Select Movement Type</em>
                  </MenuItem>
                  {Object.values(MovementType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="number"
                label="Reference Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.referenceNumber}
                name="referenceNumber"
                error={!!touched.referenceNumber && !!errors.referenceNumber}
                helperText={touched.referenceNumber && errors.referenceNumber}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Direct Assignment
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
            onNodeSelect={(id, name) => handleDepartmentSelect(id, name)} // Pass selected node back
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
        <ListDirectAssignment
          employeeId={intialValue.employeeId}
          refreshKey={refreshKey}
        />
      </Box>
    </Box>
  );
};

export default CreateDirectAssignment;
