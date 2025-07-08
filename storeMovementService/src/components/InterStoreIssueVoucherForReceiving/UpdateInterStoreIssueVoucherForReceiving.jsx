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
  getAllInterStoreIssueVoucherForIssue,
  getAllStoreRequisitions,
  getAllStores,
  getInterStoreIssueVoucherForReceivingById,
  updateInterStoreIssueVoucherForReceiving,
} from "../../Api/storeMovementAp";
import { useLocation, useNavigate } from "react-router-dom";

const UpdateInterStoreIssueVoucherForReceiving = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const [storeRequisitions, setStoreRequisitions] = useState([]);
  const [issueStore, setIssueStore] = useState([]);
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [receivingStore, setReceivingStore] = useState({
    receivingISIV_NO: "",
    fromStoreId: "",
    toStoreId: "",
    driverName: "",
    transporters: "",
    storeRequisitionId: "",
    approvedIssuedId: "",
    transferDate: "",
    plateNo: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchAllStores(),
          fetchAllStoreRequisitions(),
          fetchAllInterStoreIssuedVoucherB(),
        ]);
        
        if (id) {
          await fetchInterStoreIssueVoucherById();
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    
    fetchData();
  }, [id, tenantId]);

  const fetchAllStores = async () => {
    try {
      const response = await getAllStores(tenantId);
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching stores:", error.message);
    }
  };

  const fetchAllStoreRequisitions = async () => {
    try {
      const response = await getAllStoreRequisitions(tenantId);
      setStoreRequisitions(response.data);
    } catch (error) {
      console.error("Error fetching store requisitions:", error.message);
    }
  };

  const fetchInterStoreIssueVoucherById = async () => {
    try {
      const response = await getInterStoreIssueVoucherForReceivingById(tenantId, id);
      setReceivingStore(response.data);
    } catch (error) {
      console.error("Error fetching receiving store:", error.message);
    }
  };

  const fetchAllInterStoreIssuedVoucherB = async () => {
    try {
      const response = await getAllInterStoreIssueVoucherForIssue(tenantId);
      const approvedIssues = response.data.filter(issue => issue.status === "APPROVED");
      setIssueStore(approvedIssues);
    } catch (error) {
      console.error("Error fetching store issue voucher for issue:", error.message);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      await updateInterStoreIssueVoucherForReceiving(tenantId, id, values);
      setNotification({
        open: true,
        message: "Inter store issue voucher is updated successfully!",
        severity: "success",
      });
      resetForm();
      navigate('/storeMovent/create_inter_Store_receiving');
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: error.response?.data || "Failed to submit. Please try again.",
        severity: "error",
      });
    }
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
      <Header subtitle="Update InterStore IssueVoucher For Receiving" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={receivingStore}
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
                sx={{
                  flexGrow: 1,
                  flexShrink: 1,
                  minWidth: 0,
                  gridColumn: "span 2",
                }}
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
                sx={{
                  flexGrow: 1,
                  flexShrink: 1,
                  minWidth: 0,
                  gridColumn: "span 2",
                }}
                error={!!touched.storeRequisitionId && !!errors.storeRequisitionId}
              >
                <InputLabel id="store-requisition-label">
                  Select store requisition
                </InputLabel>
                <Select
                  labelId="store-requisition-label"
                  value={values.storeRequisitionId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="storeRequisitionId"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select store requisition number</em>
                  </MenuItem>
                  {storeRequisitions.map((requisition) => (
                    <MenuItem key={requisition.id} value={requisition.id}>
                      {requisition.srNo}
                    </MenuItem>
                  ))}
                </Select>
                {touched.storeRequisitionId && errors.storeRequisitionId && (
                  <FormHelperText>{errors.storeRequisitionId}</FormHelperText>
                )}
              </FormControl>

              <FormControl
                sx={{
                  flexGrow: 1,
                  flexShrink: 1,
                  minWidth: 0,
                  gridColumn: "span 2",
                }}
                error={!!touched.approvedIssuedId && !!errors.approvedIssuedId}
              >
                <InputLabel id="approved-issued-label">
                  Select approved issued voucher
                </InputLabel>
                <Select
                  labelId="approved-issued-label"
                  value={values.approvedIssuedId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="approvedIssuedId"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select approved issued voucher</em>
                  </MenuItem>
                  {issueStore.map((issue) => (
                    <MenuItem key={issue.id} value={issue.id}>
                      {issue.itemTransferNo}
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
                label="receivingISIV_NO"
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
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
              >
                Update Inter Store Receiving
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
    </Box>
  );
};

export default UpdateInterStoreIssueVoucherForReceiving;