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
  DialogActions,
  Grid,
  FormHelperText,
  Snackbar,
  Alert,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import Header from "../common/Header";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import {
  createFixedAsset,
  getAllstoreIssueVoucher,
  getAllItem,
  getAllRequision,
} from "../../Api/fixedAssetService";
import DepartementTree from "../common/DepartementTree";
import GetAllFixedAsset from "./GetAllFixedAsset";

const CreateFixedAsset = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const [items, setItems] = useState([]);
  const [storeIssueVenture, setStoreIssueVenture] = useState([]);
  const [storeRequisitions, setStoreRequisitions] = useState([]);

  const [openDialog, setOpenDialog] = useState(false); // Manage dialog visibility
  const [selectedDepartment, setSelectedDepartment] = useState({
    id: "",
    name: "",
  }); // State for selected department

  const handleDialogOpen = () => setOpenDialog(true);

  const handleDialogClose = () => setOpenDialog(false);

  const handleDepartmentSelect = (id, name) => {
    setSelectedDepartment({ id, name }); // Update selected department
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
    setOpenDialog(false); // Close the dialog
  };

  useEffect(() => {
    fetchAllItems();
    getAllVouncherIssueVenture();
    getAllStoreRequision();
  }, [selectedDepartment.id]);

  const fetchAllItems = async () => {
    try {
      const response = await getAllItem(tenantId);
      const data = response.data;
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error.message);
    }
  };

  const getAllVouncherIssueVenture = async () => {
    try {
      const response = await getAllstoreIssueVoucher(tenantId);
      const data = response.data;
      setStoreIssueVenture(data);
    } catch (error) {
      console.error("Error fetching Store Issue Venture:", error.message);
    }
  };

  const getAllStoreRequision = async () => {
    try {
      const response = await getAllRequision(tenantId);
      const data = response.data;
      setStoreRequisitions(data);
    } catch (error) {
      console.error("Error fetching store requiestion:", error.message);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    if (!selectedDepartment.id) {
      setNotification({
        open: true,
        message: "Please select a department before submitting.",
        severity: "warning",
      });
      return; // Prevent further submission if no department is selected
    }
    const formValues = {
      ...values,
      departmentId: selectedDepartment.id, // Include selected department ID
    };

    try {
      // Submit form data to the server
      const response = await createFixedAsset(tenantId, formValues);

      if (response.status === 201 || response.status === 200) {

        setNotification({
          open: true,
          message: "fixed assets created successfully!",
          severity: "success",
        });
                resetForm();
            setRefreshKey((prev) => prev + 1);

      } else {
        // Handle case where response status is not 201
        setNotification({
          open: true,
          message: "Failed to create fixed assets. Please try again.",
          severity: "error",
        });
      }
    } catch (error) {
      let errorMessage = "Failed to create fixed assets. Please try again.";

      // Check for response errors from the server
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage; // Adjust based on your error response structure
      } else {
        errorMessage = "An unexpected error occurred. Please try again.";
      }

      // Display error message in notification
      setNotification({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const initialValues = {
    itemId: "",
    departmentId: "",
    farNo: "",
    deliveryStatus: "",
    systemNumber: "",
    sivId: "",
    warrantyMonths: "",
    company: "",
    warranty: "",
    description: "",
    accountNumber: "",
    srId: "",
    revaluationCost: "",
    itemType: "",
  };

  const checkoutSchema = yup.object().shape({
    itemId: yup.string().required("item is required"),
    sivId: yup.string().required("siv is required"),
    srId: yup.string().required("sr is required"),
    deliveryStatus: yup.string().required("delivery status is required"),
    farNo: yup.string().required("far number is required"),
    systemNumber: yup.string().required("sytem number  is required"),
    warrantyMonths: yup.string().required("warranty mounths  is required"),
    company: yup.string().required("company name  is required"),
    warranty: yup.string().required("wranty is required"),
    revaluationCost: yup.string().required("revaluation const is required"),
    itemType: yup.string().required("item type const is required"),
    accountNumber: yup.string().required("account number is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create fixed assets" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
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
              <FormControl
                sx={{
                  flexGrow: 1,
                  flexShrink: 1,
                  minWidth: 0,
                  gridColumn: "span 2",
                }}
                error={!!touched.itemId && !!errors.itemId}
              >
                <InputLabel id="items-label">Select items</InputLabel>
                <Select
                  labelId="itemId-label"
                  value={values.itemId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="itemId"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select Items sr number</em>
                  </MenuItem>
                  {items.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.itemName}
                    </MenuItem>
                  ))}
                </Select>

                {touched.srNo && errors.srNo && (
                  <FormHelperText>{errors.srNo}</FormHelperText>
                )}
              </FormControl>

              <FormControl
                sx={{
                  flexGrow: 1,
                  flexShrink: 1,
                  minWidth: 0,
                  gridColumn: "span 2",
                }}
                error={!!touched.sivId && !!errors.sivId}
              >
                <InputLabel id="inter-label">
                  Select store Issue Venture
                </InputLabel>
                <Select
                  labelId="sivId-label"
                  value={values.sivId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="sivId"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select store Issue Venture</em>
                  </MenuItem>
                  {storeIssueVenture.map((interSoreIssue) => (
                    <MenuItem key={interSoreIssue.id} value={interSoreIssue.id}>
                      {interSoreIssue.siv_NO}
                    </MenuItem>
                  ))}
                </Select>

                {touched.sivId && errors.sivId && (
                  <FormHelperText>{errors.sivId}</FormHelperText>
                )}
              </FormControl>

              <FormControl
                sx={{
                  flexGrow: 1,
                  flexShrink: 1,
                  minWidth: 0,
                  gridColumn: "span 2",
                }}
                error={!!touched.srId && !!errors.srId}
              >
                <InputLabel id="inter-label">
                  Select store requiestion
                </InputLabel>
                <Select
                  labelId="srId-label"
                  value={values.srId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="srId"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select store requiestion</em>
                  </MenuItem>
                  {storeRequisitions.map((storeRequisition) => (
                    <MenuItem
                      key={storeRequisition.id}
                      value={storeRequisition.id}
                    >
                      {storeRequisition.srNo}
                    </MenuItem>
                  ))}
                </Select>

                {touched.srId && errors.srId && (
                  <FormHelperText>{errors.srId}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ gridColumn: "span 2", mb: 2 }}>
                <InputLabel id="delivery-status-label">
                  Delivery Status
                </InputLabel>
                <Select
                  labelId="delivery-status-label"
                  value={values.deliveryStatus}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "delivery status" }}
                  name="deliveryStatus" // Corrected name
                  error={!!touched.deliveryStatus && !!errors.deliveryStatus} // Corrected error handling
                  sx={{
                    flexGrow: 1,
                    flexShrink: 1,
                    minWidth: 0,
                    gridColumn: "span 2",
                  }}
                >
                  <MenuItem value=""></MenuItem>
                  <MenuItem value="IN_TRANSIT">In Transit</MenuItem>
                  <MenuItem value="DELIVERED">Delivered</MenuItem>
                  <MenuItem value="RETURNED">Returned</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                </Select>
                {touched.deliveryStatus && errors.deliveryStatus && (
                  <FormHelperText error>{errors.deliveryStatus}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ gridColumn: "span 2", mb: 2 }}>
                <InputLabel id="itemType-label">Item Type</InputLabel>
                <Select
                  labelId="itemType-label"
                  value={values.itemType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "itemType" }}
                  name="itemType" // Corrected name
                  error={!!touched.itemType && !!errors.itemType} // Corrected error handling
                  sx={{
                    flexGrow: 1,
                    flexShrink: 1,
                    minWidth: 0,
                    gridColumn: "span 2",
                  }}
                >
                  <MenuItem value=""></MenuItem>
                  <MenuItem value="NEW">New</MenuItem>
                  <MenuItem value="PREVIOUS">Previous</MenuItem>
                  <MenuItem value="USED">Used</MenuItem>
                </Select>
                {touched.itemType && errors.itemType && (
                  <FormHelperText error>{errors.itemType}</FormHelperText>
                )}
              </FormControl>

              <TextField
                fullWidth
                type="number"
                label="warranty Months"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.warrantyMonths}
                name="warrantyMonths"
                error={!!touched.warrantyMonths && !!errors.warrantyMonths}
                helperText={touched.warrantyMonths && errors.warrantyMonths}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="number"
                label="revaluation Cost"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.revaluationCost}
                name="revaluationCost"
                error={!!touched.revaluationCost && !!errors.revaluationCost}
                helperText={touched.revaluationCost && errors.revaluationCost}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="text"
                label="far No"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.farNo}
                name="farNo"
                error={!!touched.farNo && !!errors.farNo}
                helperText={touched.farNo && errors.farNo}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="text"
                label="Sytem Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.systemNumber}
                name="systemNumber"
                error={!!touched.systemNumber && !!errors.systemNumber}
                helperText={touched.systemNumber && errors.farNsystemNumbero}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="text"
                label="Company"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.company}
                name="company"
                error={!!touched.company && !!errors.company}
                helperText={touched.company && errors.company}
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
                label="warranty"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.warranty}
                name="warranty"
                error={!!touched.warranty && !!errors.warranty}
                helperText={touched.warranty && errors.warranty}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="text"
                label="account Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.accountNumber}
                name="accountNumber"
                error={!!touched.accountNumber && !!errors.accountNumber}
                helperText={touched.accountNumber && errors.accountNumber}
                sx={{ gridColumn: "span 2" }}
              />

                <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 2" }}
              />


        
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Session
              </Button>
            </Box>
          </form>
        )}
      </Formik>

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
            <GetAllFixedAsset refreshKey={refreshKey} />
      
      

    </Box>
  );
};

export default CreateFixedAsset;
