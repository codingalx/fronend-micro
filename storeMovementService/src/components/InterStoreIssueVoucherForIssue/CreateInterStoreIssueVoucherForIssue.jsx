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
} from "../../Api/storeMovementAp";
import GetAllInterStoreIssueVoucherForIssue from "./GetAllInterStoreIssueVoucherForIssue";

const CreateInterStoreIssueVoucherForIssue = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
    const [storeRequitions, setStoreRequitions] = useState([]);
  
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



  useEffect(() => {
    fetchAllSore();
    fetchAllStoreRequision();
  }, []);

  const fetchAllSore = async () => {
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
      message: "inter store issue vouncher for issue is created successfully!",
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
 const fetchAllStoreRequision = async () => {
    try {
      const response = await getAllStoreRequisitions(tenantId);
      setStoreRequitions(response.data);
    } catch (error) {
      console.error("Error fetching store Requision:", error.message);
    }
  };


  const initialValues = {
   itemTransferNo: "",
  fromStoreId: "",
  toStoreId: "",
  storeRequisitionId: "",
  plateNo: "",
  transferDate: "",
  driverName: "",
  remark: ""
  };

  const checkoutSchema = yup.object().shape({
  itemTransferNo: yup.string().required("Item Transfer Number is required"),
  fromStoreId: yup.string().required("From Store name is required"),
  toStoreId: yup.string().required("To Store name is required"),
  storeRequisitionId: yup.string().required("Store Requisition ID is required"),
  plateNo: yup.string().required("Plate Number is required"),
  transferDate: yup.string().required("Transfer Date is required"),
  driverName: yup.string().required("Driver Name is required"),
  
});

  return (
    <Box m="20px">
      <Header subtitle="Create InterStore IssueVoucher For Issue" />
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
                              error={
                                !!touched.storeRequisitionId && !!errors.storeRequisitionId
                              }
                            >
                              <InputLabel id="store requistion-label">
                                Select store requistion name
                              </InputLabel>
                              <Select
                                labelId="storeRequistion-label"
                                value={values.storeRequisitionId}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name="storeRequisitionId"
                                fullWidth
                              >
                                <MenuItem value="">
                                  <em>Select store requiestion number</em>
                                </MenuItem>
                                {storeRequitions.map((storeRequition) => (
                                  <MenuItem key={storeRequition.id} value={storeRequition.id}>
                                    {storeRequition.srNo}
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
                label="item Transfer Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.itemTransferNo}
                name="itemTransferNo"
                error={!!touched.itemTransferNo && !!errors.itemTransferNo}
                helperText={touched.itemTransferNo && errors.itemTransferNo}
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
                label="tansfer Date"
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
      <GetAllInterStoreIssueVoucherForIssue refreshKey={refreshKey} />

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

export default CreateInterStoreIssueVoucherForIssue;
