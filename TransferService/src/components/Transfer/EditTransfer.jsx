import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Snackbar,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Formik } from "formik";
import DepartementTree from "../common/DepartementTree";
import {
  getTransferById,
  updateTransfer,
  listDutyStations,
  getEmployeeByEmployeeId,
  getDepartementById,
} from "../../Api/transferApi";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import { TransferType } from "../../constants/enums";
import NotPageHandle from "../common/NotPageHandle";
import Header from "../common/Header";

const EditTransfer = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();

  const transferId = location.state?.transferId;
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const username = authState.username;

  const [dutyStations, setDutyStations] = useState([]);
  const [shortEmployeeId, setShortEmployeeId] = useState("");
  const [transfer, setTransfer] = useState({});

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState({
    id: "",
    name: "",
  });

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
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

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  useEffect(() => {
    if (!transferId) {
      return;
    }
    fetchEmployeeDetails();
    fetchTransferData();
    fetchDutyStations();
  }, [transferId]);

  const fetchEmployeeDetails = async () => {
    try {
      const response = await getEmployeeByEmployeeId(tenantId, username);
      setShortEmployeeId(response.employeeId);
      setTransfer((prev) => ({ ...prev, employeeId: response.id }));
    } catch (error) {
      console.error("Error fetching employee details:", error.message);
    }
  };

  const fetchTransferData = async () => {
    try {
      const transferData = await getTransferById(tenantId, transferId);

      if (transferData) {
        setTransfer(transferData);

        if (transferData.departmentId) {
          const departmentResponse = await getDepartementById(
            tenantId,
            transferData.departmentId
          );
          setSelectedDepartment({
            id: transferData.departmentId,
            name: departmentResponse.data.departmentName,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching transfer data:", error.message);
    }
  };

  const fetchDutyStations = async () => {
    try {
      const response = await listDutyStations(tenantId);
      setDutyStations(response.data);
    } catch (error) {
      console.error("Error fetching duty stations:", error.message);
    }
  };

  const handleFormSubmit = async (values) => {
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

      const response = await updateTransfer(tenantId, transferId, formValues);

      if (response.status === 200) {
        setNotification({
          open: true,
          message: "Transfer updated successfully!",
          severity: "success",
        });
        setTimeout(() => {
          navigate("/transfer/list");

        }, 300);
      } else {
        setNotification({
          open: true,
          message: `Error updating transfer. Status code: ${response.status}`,
          severity: "error",
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: `Error updating transfer: ${error.message}`,
        severity: "error",
      });
    }
  };

  const checkoutSchema = yup.object().shape({
    dutyStationId: yup.string().required("Duty Station is required"),
    transferType: yup.string().required("Transfer Type is required"),
    comment: yup.string(),
    employeeId: yup.string().required("Employee ID is required"),
  });

  if (!transferId) {
    return (
      <NotPageHandle
        message="Transfer ID is missing. Redirecting to List Transfer..."
        navigateTo="/transfer/list"
      />
    );
  }

  return (
    <Box m="20px">
      <Header subtitle="Update Transfer Details" />
      <Formik
        initialValues={transfer}
        validationSchema={checkoutSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
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
              <FormControl sx={{ gridColumn: "span 2" }}>
                <InputLabel>Duty Station</InputLabel>
                <Select
                  name="dutyStationId"
                  value={values.dutyStationId}
                  onChange={(e) =>
                    setFieldValue("dutyStationId", e.target.value)
                  }
                  onBlur={handleBlur}
                  error={touched.dutyStationId && Boolean(errors.dutyStationId)}
                >
                  {dutyStations.map((station) => (
                    <MenuItem key={station.id} value={station.id}>
                      {station.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {touched.dutyStationId && errors.dutyStationId}
                </FormHelperText>
              </FormControl>

              <FormControl sx={{ gridColumn: "span 2" }}>
                <InputLabel>Transfer Type</InputLabel>
                <Select
                  name="transferType"
                  value={values.transferType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.transferType && Boolean(errors.transferType)}
                >
                  {Object.values(TransferType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {touched.transferType && errors.transferType}
                </FormHelperText>
              </FormControl>

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
                label="Comment"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.comment}
                name="comment"
                error={touched.comment && Boolean(errors.comment)}
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
              <Button type="submit" color="primary" variant="contained">
                Update Transfer
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
    </Box>
  );
};

export default EditTransfer;
