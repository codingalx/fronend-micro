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
    createGoodReceivingNote,
  getAllInspections,
  getAllItems,
  getAllStores,
} from "../../Api/storeMovementAp";
import GetAllGoodReceivingNote from "./GetAllGoodReceivingNote";

const CreateGoodReceivingNote = () => {
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

    const [inspections, setInspections] = useState([]);
    const [items, setItems] = useState([]);



  useEffect(() => {
    fetchAllSore();
    fetchAllItemInspection();
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

  const fetchAllItemInspection = async () => {
    try {
      const response = await getAllInspections(tenantId);
      setInspections(response.data);
    } catch (error) {
      console.error("Error fetching item inspections:", error.message);
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
    try {
      await createGoodReceivingNote(tenantId, values);
      setNotification({
        open: true,
        message: "create good receiving note created successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to . Please try again.",
        severity: "error",
      });
    }
  };

  const initialValues = {
    type: "",
    inspectionId: "",
    storeId: "",
    receivedDate: "",
    supplierName: "",
    entryType: "",
    assetType: "",
    itemId: "",
    grn_NO: "",
  };

  const checkoutSchema = yup.object().shape({
    type: yup.string().required("type  is required"),
    inspectionId: yup.string().required("Inspection is required"),
    storeId: yup.string().required("store name is required"),
    itemId: yup.string().required("Item name is required"),
    receivedDate: yup.string().required("received date is required"),
    entryType: yup.string().required("entry Type  is required"),
    grn_NO: yup.string().required("grn  number  is required"),
    supplierName: yup.string().required("supplier Name  is required"),
    assetType: yup.string().required("asset Type  is required"),
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
                error={
                  !!touched.inspectionId && !!errors.inspectionId
                }
              >
                <InputLabel id="inspection-label">
                  Select inpection 
                </InputLabel>
                <Select
                  labelId="inspection-label"
                  value={values.inspectionId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="inspectionId"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select select inspection </em>
                  </MenuItem>
                  {inspections.map((inspection) => (
                    <MenuItem key={inspection.id} value={inspection.id}>
                      {inspection.id}
                    </MenuItem>
                  ))}
                </Select>
                {touched.inspectionId && errors.inspectionId && (
                  <FormHelperText>{errors.inspectionId}</FormHelperText>
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
                  !!touched.itemId && !!errors.itemId
                }
              >
                <InputLabel id="item-label">
                  Select Items 
                </InputLabel>
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
                label="supplier Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.supplierName}
                name="supplierName"
                error={!!touched.supplierName && !!errors.supplierName}
                helperText={touched.supplierName && errors.supplierName}
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


               <FormControl fullWidth sx={{ gridColumn: "span 2", mb: 2 }}>
                <InputLabel id="type-label">asset Type</InputLabel>
                <Select
                  labelId="assetType-label"
                  value={values.assetType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "assetType" }}
                  name="assetType" // Corrected name
                  error={!!touched.assetType && !!errors.assetType} // Corrected error handling
                  sx={{
                    flexGrow: 1,
                    flexShrink: 1,
                    minWidth: 0,
                    gridColumn: "span 2",
                  }}
                >  
  
                  <MenuItem value="FIXED_ASSET">Fixed Asset</MenuItem>
                  <MenuItem value="NON_FIXED_ASSET">Non Fixed asset</MenuItem>
                </Select>
                {touched.assetType && errors.assetType && (
                  <FormHelperText error>{errors.assetType}</FormHelperText>
                )}
              </FormControl>


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
  
                  <MenuItem value="GRN">GRN</MenuItem>
                  <MenuItem value="MRN">MRN</MenuItem>
                </Select>
                {touched.type && errors.type && (
                  <FormHelperText error>{errors.type}</FormHelperText>
                )}
              </FormControl> 

              <FormControl fullWidth sx={{ gridColumn: "span 2", mb: 2 }}>
                <InputLabel id="entryType-label">entry Type</InputLabel>
                <Select
                  labelId="entryType-label"
                  value={values.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "entryType" }}
                  name="entryType" // Corrected name
                  error={!!touched.entryType && !!errors.entryType} // Corrected error handling
                  sx={{
                    flexGrow: 1,
                    flexShrink: 1,
                    minWidth: 0,
                    gridColumn: "span 2",
                  }}
                >  
  
                  <MenuItem value="DEPARTMENT">Departement</MenuItem>
                  <MenuItem value="STOCK">Stock</MenuItem>
                </Select>
                {touched.entryType && errors.entryType && (
                  <FormHelperText error>{errors.entryType}</FormHelperText>
                )}
              </FormControl> 


    
    

              <TextField
                fullWidth
                type="text"
                label="grn_NO"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.grn_NO}
                name="grn_NO"
                error={!!touched.grn_NO && !!errors.grn_NO}
                helperText={touched.grn_NO && errors.grn_NO}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="outlined"
                type="date"
                label="Receivable Date"
                InputLabelProps={{ shrink: true }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.receivedDate}
                name="receivedDate"
                error={!!touched.receivedDate && !!errors.receivedDate}
                helperText={touched.receivedDate && errors.receivedDate}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Sore Vouncher
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <GetAllGoodReceivingNote refreshKey={refreshKey} />

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

export default CreateGoodReceivingNote;
