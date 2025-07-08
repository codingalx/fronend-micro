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
  Typography,
  Chip,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import Header from "../../common/Header";
import { updateStoreRequisition, getStoreRequisitionById, getAllItems, getAllStores } from "../../Api/storeApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import { useLocation, useNavigate } from "react-router-dom";
import NoPageHandle from "../../common/NoPageHandle";

const UpdateStoreRequisition = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;
  const fileInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { requisitionId } = location.state || {};

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [items, setItems] = useState([]);
  const [stores, setStores] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingStores, setLoadingStores] = useState(false);
  const [initialValues, setInitialValues] = useState({
    srNo: "",
    requisitionDate: new Date().toISOString().split('T')[0],
    requestedBy: "",
    type: "INTERNAL",
    itemCode: "",
    requestStoreId: "",
    quantity: 0,
    file: null,
    currentFileName: null,
  });

  useEffect(() => {
    fetchAllItems();
    fetchAllStores();
    if (requisitionId) {
      fetchRequisition();
    }
  }, [requisitionId]);

  const fetchRequisition = async () => {
    try {
      const response = await getStoreRequisitionById(tenantId, requisitionId);
      const requisition = response.data;
      
      setInitialValues({
        srNo: requisition.srNo,
        requisitionDate: requisition.requisitionDate,
        requestedBy: requisition.requestedBy,
        type: requisition.type,
        itemCode: requisition.itemCode,
        requestStoreId: requisition.requestStoreId,
        quantity: requisition.quantity,
        file: null,
        currentFileName: requisition.fileName || null,
      });
    } catch (error) {
      console.error("Error fetching requisition:", error);
      setNotification({
        open: true,
        message: "Failed to fetch requisition data",
        severity: "error",
      });
    }
  };

  const fetchAllItems = async () => {
    setLoadingItems(true);
    try {
      const response = await getAllItems(tenantId);
      if (response?.data && Array.isArray(response.data)) {
        const transformedItems = response.data.map(item => ({
          id: item.id,
          label: item.itemCode || `Item ${item.id}`,
          code: item.itemCode,
          name: item.itemName
        }));
        setItems(transformedItems);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoadingItems(false);
    }
  };

  const fetchAllStores = async () => {
    setLoadingStores(true);
    try {
      const response = await getAllStores(tenantId);
      if (response?.data && Array.isArray(response.data)) {
        const transformedStores = response.data.map(store => ({
          id: store.id,
          label: store.storeName || `Store ${store.id}`,
        }));
        setStores(transformedStores);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoadingStores(false);
    }
  };

  const handleFileChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    setFieldValue("file", file || null);
    setFieldValue("currentFileName", file ? file.name : null);
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      
      const requisitionData = {
        srNo: values.srNo,
        requisitionDate: values.requisitionDate,
        requestedBy: values.requestedBy,
        type: values.type,
        itemCode: values.itemCode,
        requestStoreId: values.requestStoreId,
        quantity: values.quantity
      };
      
      formData.append("requisition", new Blob([JSON.stringify(requisitionData)], { 
        type: "application/json" 
      }));
      
      if (values.file) {
        formData.append('file', values.file);
      }

      await updateStoreRequisition(tenantId, requisitionId, formData);
      
      setNotification({
        open: true,
        message: "Store requisition updated successfully!",
        severity: "success",
      });
      setTimeout(() => navigate(-1), 1000);
                navigate('/store/create-store-requisition');

    } catch (error) {
      console.error("Failed to update requisition:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to update store requisition.",
        severity: "error",
      });
    }
  };

  const checkoutSchema = yup.object().shape({
    srNo: yup.string().required("Serial number is required"),
    requisitionDate: yup
      .string()
      .required("Requisition date is required")
      .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
    requestedBy: yup.string().required("Requested by is required"),
    type: yup.string().required("Type is required"),
    itemCode: yup.string().required("Item is required"),
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
     const handleNavigate = () => {
        navigate('/store/create-store-requisition');
    }


  if (!requisitionId) {
    return (
      <NoPageHandle
        message="No requisition selected for update."
        navigateTo={handleNavigate}
      />
    );
  }

  return (
    <Box m="20px">
      <Header subtitle="Update Store Requisition" />
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
                sx={{ gridColumn: "span 2" }}
                 InputProps={{
                  readOnly: true, // Makes the field non-editable
                }}
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

              <Autocomplete
                sx={{ gridColumn: "span 2" }}
                options={items}
                loading={loadingItems}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                value={items.find(item => item.id === values.itemCode) || null}
                onChange={(event, newValue) => {
                  setFieldValue("itemCode", newValue?.id || "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Item Code"
                    error={!!touched.itemCode && !!errors.itemCode}
                    helperText={touched.itemCode && errors.itemCode}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingItems ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />

              <Autocomplete
                sx={{ gridColumn: "span 2" }}
                options={stores}
                loading={loadingStores}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                value={stores.find(store => store.id === values.requestStoreId) || null}
                onChange={(event, newValue) => {
                  setFieldValue("requestStoreId", newValue?.id || "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Store"
                    error={!!touched.requestStoreId && !!errors.requestStoreId}
                    helperText={touched.requestStoreId && errors.requestStoreId}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingStores ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />

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
                {values.currentFileName && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Current file:
                    </Typography>
                    <Chip 
                      label={values.currentFileName} 
                      variant="outlined"
                      onDelete={() => {
                        setFieldValue("currentFileName", null);
                        setFieldValue("file", null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    />
                  </Box>
                )}
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
                Update Requisition
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
    </Box>
  );
};

export default UpdateStoreRequisition;