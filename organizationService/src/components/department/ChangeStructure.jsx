import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  DialogActions,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import {   createStructureChange,
  getDepartementById,
  listOfdepartementType, } from "../../../configuration/organizationApi";
import DepartementTree from "../common/DepartementTree";
import { useLocation } from "react-router-dom";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const ChangeStructure = () => {
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [departementType, setDepartementType] = useState([]);
  const [departement, setDepartement] = useState({
    departmentName: "",
    departmentTypeId: "",
  });
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState({
    id: "",
    name: "",
    parentDepartmentId: "",
  });

  const location = useLocation();
  const id = location.state?.id; 

  useEffect(() => {
    fetchAllDepartType();
    if (id) fetchDepartement();
  }, [id]);

  const fetchAllDepartType = async () => {
    try {
      const response = await listOfdepartementType(tenantId);
      setDepartementType(response.data);
    } catch (error) {
      setNotification({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  const fetchDepartement = async () => {
    try {
      const response = await getDepartementById(tenantId,id);
      setDepartement(response.data);
    } catch (error) {
      setNotification({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  const handleDepartmentSelect = (id, name, parentDepartmentId) => {
    setSelectedDepartment({ id, name, parentDepartmentId });
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

  const handleFormSubmit = async () => {
    if (!selectedDepartment.id) {
      setNotification({
        open: true,
        message: "Please select a parent department before submitting.",
        severity: "warning",
      });
      return;
    }

    try {
      await createStructureChange(tenantId,id, selectedDepartment.id, {});
      setNotification({
        open: true,
        message: "Structure updated successfully!",
        severity: "success",
      });
    } catch (error) {
      setNotification({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  const checkoutSchema = yup.object().shape({
    departmentName: yup.string().required("Department Name is required"),
  });

  const handleCloseSnackbar = () =>
    setNotification({ ...notification, open: false });

  return (
    <Box m="20px">
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={departement}
        validationSchema={checkoutSchema}
        enableReinitialize
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(2, 1fr)"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
              }}
            >
              {/* Left Column */}
              <Box
                sx={{
                  backgroundColor: "#f5f5f5",
                  padding: "16px",
                  borderRadius: "8px",
                }}
              >
                <TextField
                  fullWidth
                  label="Department Name"
                  value={departement.departmentName}
                  disabled
                  sx={{ marginBottom: "16px" }}
                />

                <FormControl fullWidth disabled sx={{ marginBottom: "16px" }}>
                  <InputLabel>Select Department Type</InputLabel>
                  <Select value={departement.departmentTypeId}>
                    {departementType.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.departmentTypeName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Right Column */}
              <Box>
                <TextField
                  fullWidth
                  type="text"
                  label="Selected Department"
                  value={selectedDepartment.name || ""}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ marginBottom: "16px" }}
                />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleDialogOpen}
                  sx={{ marginBottom: "16px" }}
                >
                  Select Department
                </Button>
              </Box>
            </Box>

            <Box display="flex" justifyContent="start" mt="20px" gap="20px">
              <Button type="submit" color="primary" variant="contained">
                Update Structure
              </Button>
            </Box>

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
                  onNodeSelect={(id, name, parentDepartmentId) =>
                    handleDepartmentSelect(id, name, parentDepartmentId)
                  }
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
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default ChangeStructure;
