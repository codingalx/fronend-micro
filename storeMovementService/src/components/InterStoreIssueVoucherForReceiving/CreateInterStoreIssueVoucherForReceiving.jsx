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
  createInterStoreIssueVoucherForIssue,
  getAllStoreRequisitions,
  getAllStores,
  getAllInterStoreIssueVoucherForIssue
} from "../../Api/storeMovementAp";
import GetAllInterStoreIssueVoucherForReceiving from "./GetAllInterStoreIssueVoucherForReceiving";

const CreateInterStoreIssueVoucherForReceiving = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
    const [refreshKey, setRefreshKey] = useState(0);
  const [storeRequitions, setStoreRequitions] = useState([]);
  const [storeIssueVouncherIssueApproved, setStoreIssueVouncherIssueApproved] = useState([]);
       const { id } = location.state || {};
       

  const fetchAllGatePassInformation = async () => {
    try {
      const response = await getAllInterStoreIssueVoucherForIssue(tenantId);
      const approvedIssues = response.data.filter(issue => issue.status === "APPROVED");
      setStoreIssueVouncherIssueApproved(approvedIssues);
    } catch (error) {
      console.error("Error fetching store issue voucher for issue:", error.message);
    }
  };

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [stores, setStores] = useState([]);

  useEffect(() => {
    fetchAllStores();
    fetchAllStoreRequision();
    fetchAllGatePassInformation();
  }, []);

  const fetchAllStores = async () => {
    try {
      const response = await getAllStores(tenantId);
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching store:", error.message);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      await createInterStoreIssueVoucherForIssue(tenantId, values);
      setNotification({
        open: true,
        message: "Inter store issue voucher for issue is created successfully!",
        severity: "success",
      });
      resetForm();
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: error.response.data || "Failed to submit. Please try again.",
        severity: "error",
      });
    }
  };

  const fetchAllStoreRequision = async () => {
    try {
      const response = await getAllStoreRequisitions(tenantId);
      setStoreRequitions(response.data);
    } catch (error) {
      console.error("Error fetching store requisition:", error.message);
    }
  };

  const initialValues = {
    receivingISIV_NO: "",
    fromStoreId: "",
    toStoreId: "",
    driverName: "",
    transporters: "",
    storeRequisitionId: "",
    approvedIssuedId: "",
    transferDate: "",
    plateNo: "",
  };

  const checkoutSchema = yup.object().shape({
    receivingISIV_NO: yup.string().required("Receiving ISIV_NO Number is required"),
    fromStoreId: yup.string().required("From Store name is required"),
    toStoreId: yup.string().required("To Store name is required"),
    approvedIssuedId: yup.string().required("Approved Issued is required"),
    transporters: yup.string().required("Transporters name is required"),
    storeRequisitionId: yup.string().required("Store Requisition ID is required"),
    plateNo: yup.string().required("Plate Number is required"),
    transferDate: yup.string().required("Transfer Date is required"),
    driverName: yup.string().required("Driver Name is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create InterStore Issue Voucher For Receiving" />
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
  sx={{ gridColumn: "span 2" }}
  error={!!touched.approvedIssuedId && !!errors.approvedIssuedId}
>
  <InputLabel id="approvedIssued-label">Select Approved Issue</InputLabel>
  <Select
    labelId="approvedIssued-label"
    value={values.approvedIssuedId}
    onChange={(e) => {
      const selectedId = e.target.value;
      const selectedIssue = storeIssueVouncherIssueApproved.find(issue => issue.id === selectedId);
      
      // Update the form values with the selected issue's data
      if (selectedIssue) {
        handleChange({
          target: {
            name: "approvedIssuedId",
            value: selectedId
          }
        });
        
        handleChange({
          target: {
            name: "fromStoreId",
            value: selectedIssue.fromStoreId || ""
          }
        });
        
        handleChange({
          target: {
            name: "toStoreId",
            value: selectedIssue.toStoreId || ""
          }
        });
        
        handleChange({
          target: {
            name: "driverName",
            value: selectedIssue.driverName || ""
          }
        });
        
        handleChange({
          target: {
            name: "storeRequisitionId",
            value: selectedIssue.storeRequisitionId || ""
          }
        });
        
        handleChange({
          target: {
            name: "transferDate",
            value: selectedIssue.transferDate || ""
          }
        });
        
        handleChange({
          target: {
            name: "plateNo",
            value: selectedIssue.plateNo || ""
          }
        });
      } else {
        // If no selection, just update the approvedIssuedId
        handleChange(e);
      }
    }}
    onBlur={handleBlur}
    name="approvedIssuedId"
    fullWidth
  >
    <MenuItem value="">
      <em>Select Approved Issue</em>
    </MenuItem>
    {storeIssueVouncherIssueApproved.map((issue) => (
      <MenuItem key={issue.id} value={issue.id}>
        {issue.itemTransferNo} {/* Show itemTransferNo in the dropdown */}
      </MenuItem>
    ))}
  </Select>
  {touched.approvedIssuedId && errors.approvedIssuedId && (
    <FormHelperText>{errors.approvedIssuedId}</FormHelperText>
  )}
</FormControl>

    <TextField
                fullWidth
                type="text"
                label="Receiving ISIV Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.receivingISIV_NO}
                name="receivingISIV_NO"
                error={!!touched.receivingISIV_NO && !!errors.receivingISIV_NO}
                helperText={touched.receivingISIV_NO && errors.receivingISIV_NO}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="text"
                label="Transporters"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.transporters}
                name="transporters"
                error={!!touched.transporters && !!errors.transporters}
                helperText={touched.transporters && errors.transporters}
                sx={{ gridColumn: "span 2" }}
              />

              
              <FormControl
                sx={{ gridColumn: "span 2" }}
                error={!!touched.fromStoreId && !!errors.fromStoreId}
              >
                <InputLabel id="fromStoreId-label">Select from which store</InputLabel>
                <Select
                  labelId="fromStoreId-label"
                  value={values.fromStoreId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="fromStoreId"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select from which store</em>
                  </MenuItem>
                  {stores.map((store) => (
                    <MenuItem key={store.id} value={store.id}>
                      {store.storeName}
                    </MenuItem>
                  ))}
                </Select>
                {touched.fromStoreId && errors.fromStoreId && (
                  <FormHelperText>{errors.fromStoreId}</FormHelperText>
                )}
              </FormControl>

              <FormControl
                sx={{ gridColumn: "span 2" }}
                error={!!touched.toStoreId && !!errors.toStoreId}
              >
                <InputLabel id="toStoreId-label">Select to which store</InputLabel>
                <Select
                  labelId="toStoreId-label"
                  value={values.toStoreId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="toStoreId"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select to which store</em>
                  </MenuItem>
                  {stores.map((store) => (
                    <MenuItem key={store.id} value={store.id}>
                      {store.storeName}
                    </MenuItem>
                  ))}
                </Select>
                {touched.toStoreId && errors.toStoreId && (
                  <FormHelperText>{errors.toStoreId}</FormHelperText>
                )}
              </FormControl>

              <FormControl
                sx={{ gridColumn: "span 2" }}
                error={!!touched.storeRequisitionId && !!errors.storeRequisitionId}
              >
                <InputLabel id="storeRequisition-label">Select store requisition name</InputLabel>
                <Select
                  labelId="storeRequisition-label"
                  value={values.storeRequisitionId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="storeRequisitionId"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select store requisition number</em>
                  </MenuItem>
                  {storeRequitions.map((storeRequisition) => (
                    <MenuItem key={storeRequisition.id} value={storeRequisition.id}>
                      {storeRequisition.srNo}
                    </MenuItem>
                  ))}
                </Select>
                {touched.storeRequisitionId && errors.storeRequisitionId && (
                  <FormHelperText>{errors.storeRequisitionId}</FormHelperText>
                )}
              </FormControl>


          
              <TextField
                fullWidth
                type="text"
                label="Plate Number"
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
                label="Driver Name"
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
                type="date"
                label="Transfer Date"
                InputLabelProps={{ shrink: true }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.transferDate}
                name="transferDate"
                error={!!touched.transferDate && !!errors.transferDate}
                helperText={touched.transferDate && errors.transferDate}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Gate Pass Info
              </Button>
            </Box>
          </form>
        )}
      </Formik>
       <GetAllInterStoreIssueVoucherForReceiving refreshKey={refreshKey} />

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

export default CreateInterStoreIssueVoucherForReceiving;