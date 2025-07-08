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
    createStoreIssueVouncher,
  getAllStoreRequisitions,
  getAllStores,
  getStoreIssueVouncherById,
  updateStoreIssueVouncher,
} from "../../Api/storeMovementAp";
import { useLocation,useNavigate } from "react-router-dom";

const UpdateStoreIssueVoucher = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
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

  const [refreshKey, setRefreshKey] = useState(0);
  const [stores, setStores] = useState([]);
  const [storeRequitions, setStoreRequitions] = useState([]);


  useEffect(() => {
    fetchAllSore();
    fetchAllStoreRequision();
    fetchStoreIsuueVouncherById();
  }, []);

  const fetchAllSore = async () => {
    try {
      const response = await getAllStores(tenantId);
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching store:", error.message);
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
    const [storeIssueVenture, setStoreIssueVenture] = useState({
    storeId: "",
    storeRequisitionId: "",
    receiver: "",
    department: "",
    requisitionDate: "",
    type: "",
    siv_NO: "",
  });

   const fetchStoreIsuueVouncherById = async () => {
            try {
                const response = await getStoreIssueVouncherById(tenantId,id);
                setStoreIssueVenture(response.data);
           
             } catch (error) {
              console.error("Error fetching store vouncheer:", error.message);
    }
        };

  

  const handleFormSubmit = async (values, { resetForm }) => {
    try {

      await updateStoreIssueVouncher(tenantId,id, values);
      setNotification({
        open: true,
        message: "store issue vouncher created successfully!",
        severity: "success",
      });
      resetForm();
       navigate('/storeMovent/create_storeIssued_voucher'); 
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to store issue vouncher created. Please try again.",
        severity: "error",
      });
    }
  };



  const checkoutSchema = yup.object().shape({
    storeId: yup.string().required("store name is required"),
    department: yup.string().required("departement name is required"),
    storeRequisitionId: yup.string().required("store requiestion is required"),
    receiver: yup.string().required("receiver name is required"),
    requisitionDate: yup.string().required("requiestion date is required"),
    type: yup.string().required("type  is required"),
    siv_NO: yup.string().required("siv number  is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Update store Issue vouncher " />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={storeIssueVenture}
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
                label="receiver"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.receiver}
                name="receiver"
                error={!!touched.receiver && !!errors.receiver}
                helperText={touched.receiver && errors.receiver}
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

              <FormControl fullWidth sx={{ gridColumn: "span 2", mb: 2 }}>
                <InputLabel id="type-label">Item Type</InputLabel>
                <Select
                  labelId="type-label"
                  value={values.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "type" }}
                  name="type" // Corrected name
                  error={!!touched.type && !!errors.type} // Corrected error handling
                  sx={{
                    flexGrow: 1,
                    flexShrink: 1,
                    minWidth: 0,
                    gridColumn: "span 2",
                  }}
                >

                 
                  <MenuItem value="INTERNAL">Intenal</MenuItem>
                  <MenuItem value="MERCHANDISE">Merchandise</MenuItem>
                
                </Select>
                {touched.type && errors.type && (
                  <FormHelperText error>{errors.type}</FormHelperText>
                )}
              </FormControl>

              <TextField
                fullWidth
                type="text"
                label="siv_NO"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.siv_NO}
                name="siv_NO"
                error={!!touched.siv_NO && !!errors.siv_NO}
                helperText={touched.siv_NO && errors.siv_NO}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                                         fullWidth
                                         variant="outlined"
                                         type="date"
                                         label="requisition Date"
                                         InputLabelProps={{ shrink: true }}
                                         onBlur={handleBlur}
                                         onChange={handleChange}
                                         value={values.requisitionDate}
                                         name="requisitionDate"
                                         error={!!touched.requisitionDate && !!errors.requisitionDate}
                                         helperText={touched.requisitionDate && errors.requisitionDate}
                                         sx={{ gridColumn: "span 2" }}
                                       />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update Sore Vouncher
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
    </Box>
  );
};

export default UpdateStoreIssueVoucher;
