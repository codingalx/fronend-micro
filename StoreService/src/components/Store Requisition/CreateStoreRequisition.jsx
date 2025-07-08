import React, { useState, useEffect, useRef } from "react";
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
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import Header from "../../common/Header";
import { createStoreRequisition } from "../../Api/storeApi";
import { getAllItems } from "../../Api/storeApi";
import { getAllStores } from "../../Api/storeApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import ListStoreRequisition from "./ListStoreRequisition";


const CreateStoreRequisition = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;
  const fileInputRef = useRef(null);
    const [refreshKey, setRefreshKey] = useState(0);
  

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [items, setItems] = useState([]);
  const [stores, setStores] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingStores, setLoadingStores] = useState(false);

  useEffect(() => {
    fetchAllItem();
    fetchAllStores();
  }, []);

     const fetchAllItem = async () => {
      try {
        const response = await getAllItems(tenantId);
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error.message);
      }
    };

         const fetchAllStores = async () => {
      try {
        const response = await getAllStores(tenantId);
        setStores(response.data);
      } catch (error) {
        console.error("Error fetching items:", error.message);
      }
    };




  const handleFileChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    setFieldValue("file", file || null); // Set to null if no file selected
  };

 const handleFormSubmit = async (values, { resetForm }) => {
  try {
    const formData = new FormData();

    const requisitionData = {
      srNo: values.srNo,
      requisitionDate: values.requisitionDate,
      requestedBy: values.requestedBy,
      type: values.type,
      itemId: values.itemId,
      requestStoreId: values.requestStoreId,
      quantity: values.quantity
    };

    // Check the requisition data
    console.log("Requisition Data:", requisitionData);

    formData.append("requisition", new Blob([JSON.stringify(requisitionData)], { 
      type: "application/json" 
    }));

    if (values.file) {
      formData.append('file', values.file);
    }

    // Log formData for debugging
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    await createStoreRequisition(tenantId, formData);

    setNotification({
      open: true,
      message: "Store requisition created successfully!",
      severity: "success",
    });
    resetForm();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setRefreshKey(prev => prev + 1);
  } catch (error) {
    console.error("Failed to submit form data:", error);
    setNotification({
      open: true,
      message: error.response?.data?.message || "Failed to create store requisition. Please try again.",
      severity: "error",
    });
  }
};

   const initialValues = {
    srNo: "",
    requisitionDate: new Date().toISOString().split('T')[0], // Today's date
    requestedBy: "",
    type: "",
    itemId: "",
    requestStoreId: "",
    quantity: 0,
    file: null,
  };

  const checkoutSchema = yup.object().shape({
    srNo: yup.string().required("Serial number is required"),
    requisitionDate: yup
      .string()
      .required("Requisition date is required")
      .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
    requestedBy: yup.string().required("Requested by is required"),
    type: yup.string().required("Type is required"),
    itemId: yup.string().required("item is required"),
    requestStoreId: yup.string().required("Store is required"),
    quantity: yup.number()
      .min(1, "Quantity must be at least 1")
      .required("Quantity is required"),
    file: yup
      .mixed()
      .nullable()
      .test("fileSize", "File is too large (max 10MB)", (value) => 
        !value || (value && value.size <= 10485760)
      )
      .test(
        "fileType", 
        "Only PDF, DOC, DOCX, JPG, PNG files are allowed", 
        (value) => !value || (
          value.type === "application/pdf" || 
          value.type === "application/msword" ||
          value.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          value.type === "image/jpeg" ||
          value.type === "image/png"
        )
      ),
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box m="20px">
      <Header subtitle="Create Store Requisition" />
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


                            <FormControl
                              sx={{
                                flexGrow: 1,
                                flexShrink: 1,
                                minWidth: 0,
                                gridColumn: "span 2",
                              }}
                              error={
                                !!touched.requestStoreId && !!errors.requestStoreId
                              }
                            >
                              <InputLabel id="requestStore-label">
                                Select store name please 
                              </InputLabel>
                              <Select
                                labelId="item-label"
                                value={values.requestStoreId}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name="requestStoreId"
                                fullWidth
                              >
                                <MenuItem value="">
                                  <em>Select store name </em>
                                </MenuItem>
                                {stores.map((store) => (
                                  <MenuItem key={store.id} value={store.id}>
                                    {store.storeName}
                                  </MenuItem>
                                ))}
                              </Select>
                              {touched.requestStoreId && errors.requestStoreId && (
                                <FormHelperText>{errors.requestStoreId}</FormHelperText>
                              )}
                            </FormControl>
              <TextField
                fullWidth
                type="text"
                label="Serial Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.srNo}
                name="srNo"
                error={!!touched.srNo && !!errors.srNo}
                helperText={touched.srNo && errors.srNo}
                sx={{ gridColumn: "span 2" }}
              />

             
              <TextField
                fullWidth
                type="date"
                label="Requisition Date"
                value={values.requisitionDate}
                onChange={handleChange}
                onBlur={handleBlur}
                name="requisitionDate"
                error={!!touched.requisitionDate && !!errors.requisitionDate}
                helperText={touched.requisitionDate && errors.requisitionDate}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  readOnly: true, // Makes the field non-editable
                }}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Requested By"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.requestedBy}
                name="requestedBy"
                error={!!touched.requestedBy && !!errors.requestedBy}
                helperText={touched.requestedBy && errors.requestedBy}
                sx={{ gridColumn: "span 2" }}
              />

              <FormControl 
                fullWidth 
                error={!!touched.type && !!errors.type}
                sx={{ gridColumn: "span 2" }}
              >
                <InputLabel id="type-select-label">Type</InputLabel>
                <Select
                  labelId="type-select-label"
                  id="type"
                  name="type"
                  value={values.type}
                  label="Type"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <MenuItem value="INTERNAL">Internal</MenuItem>
                  <MenuItem value="MERCHANDISE">Merchandise</MenuItem>
                </Select>
                {touched.type && errors.type && (
                  <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 1.5 }}>
                    {errors.type}
                  </Box>
                )}
              </FormControl>

          

              <TextField
                fullWidth
                type="number"
                label="Quantity"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.quantity}
                name="quantity"
                error={!!touched.quantity && !!errors.quantity}
                helperText={touched.quantity && errors.quantity}
                sx={{ gridColumn: "span 2" }}
                inputProps={{ min: 1 }}
              />

              <Box sx={{ gridColumn: "span 4" }}>
                <TextField
                  fullWidth
                  type="file"
                  inputRef={fileInputRef}
                  onChange={(e) => handleFileChange(e, setFieldValue)}
                  error={!!touched.file && !!errors.file}
                  helperText={touched.file && errors.file || "Optional file upload"}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ 
                    accept: ".pdf,.doc,.docx,.jpg,.png" 
                  }}
                />
              </Box>
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button 
                type="submit" 
                color="secondary" 
                variant="contained"
              >
                Create Requisition
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
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={notification.severity}
          elevation={6}
        >
          {notification.message}
        </Alert>
      </Snackbar>
            <ListStoreRequisition refreshKey={refreshKey} />

    </Box>
  );
};

export default CreateStoreRequisition;