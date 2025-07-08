import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import Header from "../common/Header";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import {
  createGatePassInformation,
  getAllItems,
  getAllStores,
} from "../../Api/storeMovementAp";
import GetAllGatePassInformation from "./GetAllGatePassInformation";

const CreateGatePassInformation = () => {
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
  const [stores, setStores] = useState([]);


  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchAllSore();
 
    fetchAllItem();
  }, []);

  const fetchAllSore = async () => {
    try {
      const response = await getAllStores(tenantId);
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching store:", error.message);
    }
  };

 

  const fetchAllItem = async () => {
    try {
      const response = await getAllItems(tenantId);
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error.message);
    }
  };

const handleFormSubmit = async (values, { resetForm }) => {
  // Adjust values based on movement type
  const adjustedValues = {
    ...values,
    movementTypeNo: values.movementType === "TRANSFER" ? null : values.movementTypeNo,
    requestedBy: values.movementType !== "TRANSFER" ? null : values.requestedBy,
  };

  try {
    await createGatePassInformation(tenantId, adjustedValues);
    setNotification({
      open: true,
      message: "Gate pass information is created successfully!",
      severity: "success",
    });
    resetForm();
    setRefreshKey((prev) => prev + 1);
  } catch (error) {
    console.error("Failed to submit form data:", error);
    setNotification({
      open: true,
      message: error.response.data || "Failed to submit. Please try again.",
      severity: "error",
    });
  }
};
 
  const initialValues = {
    movementType: "",
    gatePassNo: "",
    movementTypeNo: "",
    requestedBy: null,
    storeId: "",
    itemId: "",
    transferType: "",
    securityOfficer: "",
    driverName: "",
    department: "",
    modeOfTransport: "",
    acceptedDate: "",
    plateNo: "",
    transporters: "",
    remark: "",
  };

  const checkoutSchema = yup.object().shape({
    movementType: yup.string().required("movementType  is required"),
    gatePassNo: yup.string().required("gate Pass Number is required"),
    storeId: yup.string().required("store name is required"),
    itemId: yup.string().required("Item name is required"),
    acceptedDate: yup.string().required("accepted date is required"),
    movementTypeNo: yup.string().required("movement Type No  is required"),
    // requestedBy: yup.string().required("requestedBy   is required"),
    transferType: yup.string().required("asset movementType  is required"),
    securityOfficer: yup.string().required("security officier  is required"),
    department: yup.string().required("department   is required"),
    plateNo: yup.string().required("plate Number   is required"),
        modeOfTransport: yup.string().required("modeOfTransport   is required"),

      
    
  });

  return (
    <Box m="20px">
      <Header subtitle="Create good receiving note " />
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
                error={!!touched.storeId && !!errors.storeId}
              >
                <InputLabel id="criterial-label">Select Store name</InputLabel>
                <Select
                  labelId="store-label"
                  value={values.storeId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="storeId"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select Store Name</em>
                  </MenuItem>
                  {stores.map((store) => (
                    <MenuItem key={store.id} value={store.id}>
                      {store.storeName}
                    </MenuItem>
                  ))}
                </Select>
                {touched.storeId && errors.storeId && (
                  <FormHelperText>{errors.storeId}</FormHelperText>
                )}
              </FormControl>

         

              <FormControl
                sx={{
                  flexGrow: 1,
                  flexShrink: 1,
                  minWidth: 0,
                  gridColumn: "span 2",
                }}
                error={!!touched.itemId && !!errors.itemId}
              >
                <InputLabel id="item-label">Select Items</InputLabel>
                <Select
                  labelId="item-label"
                  value={values.itemId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="itemId"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select item Name </em>
                  </MenuItem>
                  {items.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.itemName}
                    </MenuItem>
                  ))}
                </Select>
                {touched.itemId && errors.itemId && (
                  <FormHelperText>{errors.itemId}</FormHelperText>
                )}
              </FormControl>

              <TextField
                fullWidth
                type="text"
                label="gate Pass No"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.gatePassNo}
                name="gatePassNo"
                error={!!touched.gatePassNo && !!errors.gatePassNo}
                helperText={touched.gatePassNo && errors.gatePassNo}
                sx={{ gridColumn: "span 2" }}
              />

              <FormControl fullWidth sx={{ gridColumn: "span 2", mb: 2 }}>
                <InputLabel id="movementType-label">
                  please select movement type
                </InputLabel>
                <Select
                  labelId="movementType-label"
                  value={values.movementType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "movementType" }}
                  name="movementType" // Corrected name
                  error={!!touched.movementType && !!errors.movementType} // Corrected error handling
                  sx={{
                    flexGrow: 1,
                    flexShrink: 1,
                    minWidth: 0,
                    gridColumn: "span 2",
                  }}
                >

                  
                  <MenuItem value="SIV">SIV</MenuItem>
                  <MenuItem value="ISIV">ISIV</MenuItem>
                  <MenuItem value="TRANSFER">TRANSFER</MenuItem>
                </Select>
                {touched.movementType && errors.movementType && (
                  <FormHelperText error>{errors.movementType}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ gridColumn: "span 2", mb: 2 }}>
                <InputLabel id="transfer type-label">
                  please select transfer type
                </InputLabel>
                <Select
                  labelId="transferType-label"
                  value={values.transferType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "transferType" }}
                  name="transferType" // Corrected name
                  error={!!touched.transferType && !!errors.transferType} // Corrected error handling
                  sx={{
                    flexGrow: 1,
                    flexShrink: 1,
                    minWidth: 0,
                    gridColumn: "span 2",
                  }}
                >
                  <MenuItem value="PERMANENT">Permanent</MenuItem>
                  <MenuItem value="TEMPORARY">Temporary</MenuItem>
                </Select>
                {touched.transferType && errors.transferType && (
                  <FormHelperText error>{errors.transferType}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ gridColumn: "span 2", mb: 2 }}>
                <InputLabel id="transfer type-label">
                  please select mode of transport
                </InputLabel>
                <Select
                  labelId="modeOfTransport-label"
                  value={values.modeOfTransport}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "modeOfTransport" }}
                  name="modeOfTransport" // Corrected name
                  error={!!touched.modeOfTransport && !!errors.modeOfTransport} // Corrected error handling
                  sx={{
                    flexGrow: 1,
                    flexShrink: 1,
                    minWidth: 0,
                    gridColumn: "span 2",
                  }}
                >
                  <MenuItem value="CAR">Car</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
                {touched.modeOfTransport && errors.modeOfTransport && (
                  <FormHelperText error>
                    {errors.modeOfTransport}
                  </FormHelperText>
                )}
              </FormControl>

              <TextField
                fullWidth
                type="text"
                label="movementTypeNo"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.movementTypeNo}
                name="movementTypeNo"
                error={!!touched.movementTypeNo && !!errors.movementTypeNo}
                helperText={touched.movementTypeNo && errors.movementTypeNo}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="text"
                label="plateNo"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.plateNo}
                name="plateNo"
                error={!!touched.plateNo && !!errors.plateNo}
                helperText={touched.plateNo && errors.plateNo}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="text"
                label="securityOfficer"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.securityOfficer}
                name="securityOfficer"
                error={!!touched.securityOfficer && !!errors.securityOfficer}
                helperText={touched.securityOfficer && errors.securityOfficer}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="text"
                label="department"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.department}
                name="department"
                error={!!touched.department && !!errors.department}
                helperText={touched.department && errors.department}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="text"
                label="requestedBy"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.requestedBy}
                name="requestedBy"
                error={!!touched.requestedBy && !!errors.requestedBy}
                helperText={touched.requestedBy && errors.requestedBy}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="text"
                label="driverName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.driverName}
                name="driverName"
                error={!!touched.driverName && !!errors.driverName}
                helperText={touched.driverName && errors.driverName}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="text"
                label="transporters"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.transporters}
                name="transporters"
                error={!!touched.transporters && !!errors.transporters}
                helperText={touched.transporters && errors.transporters}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="date"
                label="Accepted Date"
                InputLabelProps={{ shrink: true }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.acceptedDate}
                name="acceptedDate"
                error={!!touched.acceptedDate && !!errors.acceptedDate}
                helperText={touched.acceptedDate && errors.acceptedDate}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="text"
                label="remark"
                InputLabelProps={{ shrink: true }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.remark}
                name="remark"
                error={!!touched.remark && !!errors.remark}
                helperText={touched.remark && errors.remark}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
              >
                Create Gate Pass Info
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <GetAllGatePassInformation refreshKey={refreshKey} />

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

export default CreateGatePassInformation;
