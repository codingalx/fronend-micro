import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  TextField,
  Snackbar,
  Alert,
  Typography,
  Paper,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import Header from "../Header";
import { useNavigate, useLocation } from "react-router-dom";

import {
  getInspectionById,
  updatePurchaseInspection,
  updateOtherInspection,
  getAllItems,
} from "../../Api/ItemServiceApi";
import NotPageHandle from "../common/NoPageHandle";

const UpdateInspection = () => {
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const location = useLocation();
  const navigate = useNavigate();
  const { inspectionId, name } = location.state || {};
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inspectionType, setInspectionType] = useState("purchase");
  const [initialValues, setInitialValues] = useState(null);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const purchaseValidationSchema = Yup.object().shape({
    commercialInvoice: Yup.string().required("Commercial Invoice is required"),
    storeName: Yup.string().required("Store Name is required"),
    inspectionNumber: Yup.number()
      .required("Inspection Number is required")
      .min(1, "Must be positive"),
    inspectionDate: Yup.date().required("Inspection Date is required"),
    itemId: Yup.string().required("Item is required"),
  });

  const otherValidationSchema = Yup.object().shape({
    commercialInvoice: Yup.string().required("Commercial Invoice is required"),
    storeName: Yup.string().required("Store Name is required"),
    inspectionNumber: Yup.number()
      .required("Inspection Number is required")
      .min(1, "Must be positive"),
    inspectionDate: Yup.date().required("Inspection Date is required"),
    itemId: Yup.string().required("Item is required"),
    donor: Yup.string().required("Donor is required"),
    invoiceType: Yup.string().required("Invoice Type is required"),
    producer: Yup.string().required("Producer is required"),
  });

  useEffect(() => {
    fetchData();
  }, [inspectionId, tenantId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const itemsResponse = await getAllItems(tenantId);
      setItems(itemsResponse?.data || []);

      if (inspectionId) {
        const inspectionResponse = await getInspectionById(
          tenantId,
          inspectionId
        );
        const inspectionData = inspectionResponse.data;

        const type = inspectionData.purchaseOrderNumber ? "purchase" : "other";
        setInspectionType(type);

        const formattedData = {
          ...inspectionData,
          wayBillDate: inspectionData.wayBillDate
            ? new Date(inspectionData.wayBillDate)
            : null,
          inspectionDate: inspectionData.inspectionDate
            ? new Date(inspectionData.inspectionDate)
            : null,
          deliveryDate: inspectionData.deliveryDate
            ? new Date(inspectionData.deliveryDate)
            : null,
        };

        setInitialValues(formattedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setNotification({
        open: true,
        message: "Failed to load inspection data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formattedValues = {
        ...values,
        wayBillDate: values.wayBillDate
          ? values.wayBillDate.toISOString()
          : null,
        inspectionDate: values.inspectionDate
          ? values.inspectionDate.toISOString()
          : null,
        deliveryDate: values.deliveryDate
          ? values.deliveryDate.toISOString()
          : null,
      };

      if (inspectionType === "purchase") {
        await updatePurchaseInspection(tenantId, inspectionId, formattedValues);
      } else {
        await updateOtherInspection(tenantId, inspectionId, formattedValues);
      }

      setNotification({
        open: true,
        message: `Inspection updated successfully!`,
        severity: "success",
      });

      // Redirect back after 2 seconds
      setTimeout(() => navigate(-1), 2000);
    } catch (error) {
      console.error("Error updating inspection:", error);
      setNotification({
        open: true,
        message: "Failed to update inspection",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const handleInspectionTypeChange = (event) => {
    setInspectionType(event.target.value);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!inspectionId) {
    return (
      <NotPageHandle
        message="No Inspection ID provided"
        navigateTo="/item/create-inspection"
      />
    );
  }

  return (
    <Box m="20px">
      <Container maxWidth="lg">
        <Header
          subtitle={`Update ${inspectionType === "purchase" ? "Purchase" : "Other"} Inspection`}
        />

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Inspection Type</FormLabel>
            <RadioGroup
              row
              aria-label="inspection-type"
              name="inspectionType"
              value={inspectionType}
              onChange={handleInspectionTypeChange}
            >
              <FormControlLabel
                value="purchase"
                control={<Radio />}
                label="Purchase Inspection"
                disabled={!!inspectionId} // Disable if editing existing inspection
              />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other Inspection"
                disabled={!!inspectionId} // Disable if editing existing inspection
              />
            </RadioGroup>
          </FormControl>
        </Paper>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Formik
            initialValues={initialValues}
            validationSchema={
              inspectionType === "purchase"
                ? purchaseValidationSchema
                : otherValidationSchema
            }
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              setFieldValue,
              isSubmitting,
            }) => (
              <Form>
                <Grid container spacing={3}>
                  {/* Common Fields Section */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Basic Information
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="commercialInvoice"
                      label="Commercial Invoice"
                      variant="outlined"
                      error={
                        touched.commercialInvoice &&
                        Boolean(errors.commercialInvoice)
                      }
                      helperText={
                        touched.commercialInvoice && errors.commercialInvoice
                      }
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="storeName"
                      label="Store Name"
                      variant="outlined"
                      error={touched.storeName && Boolean(errors.storeName)}
                      helperText={touched.storeName && errors.storeName}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="inspectionNumber"
                      label="Inspection Number"
                      type="number"
                      variant="outlined"
                      error={
                        touched.inspectionNumber &&
                        Boolean(errors.inspectionNumber)
                      }
                      helperText={
                        touched.inspectionNumber && errors.inspectionNumber
                      }
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="workOrderNumber"
                      label="Work Order Number"
                      type="number"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      error={touched.itemId && Boolean(errors.itemId)}
                    >
                      <InputLabel>Item</InputLabel>
                      <Select
                        name="itemId"
                        value={values.itemId}
                        onChange={handleChange}
                        label="Item"
                      >
                        {items.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.itemName} ({item.itemCode})
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.itemId && errors.itemId && (
                        <Typography variant="caption" color="error">
                          {errors.itemId}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Dates Section */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Dates
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label="Way Bill Date"
                      value={values.wayBillDate}
                      onChange={(date) => setFieldValue("wayBillDate", date)}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth variant="outlined" />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label="Inspection Date"
                      value={values.inspectionDate}
                      onChange={(date) => setFieldValue("inspectionDate", date)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="outlined"
                          error={
                            touched.inspectionDate &&
                            Boolean(errors.inspectionDate)
                          }
                          helperText={
                            touched.inspectionDate && errors.inspectionDate
                          }
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label="Delivery Date"
                      value={values.deliveryDate}
                      onChange={(date) => setFieldValue("deliveryDate", date)}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth variant="outlined" />
                      )}
                    />
                  </Grid>

                  {/* Type-specific Fields */}
                  {inspectionType === "purchase" ? (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                          Purchase Information
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Field
                          as={TextField}
                          fullWidth
                          name="purchaseOrderNumber"
                          label="Purchase Order Number"
                          type="number"
                          variant="outlined"
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Field
                          as={TextField}
                          fullWidth
                          name="contractNumber"
                          label="Contract Number"
                          type="number"
                          variant="outlined"
                        />
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                          Other Information
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Field
                          as={TextField}
                          fullWidth
                          name="donor"
                          label="Donor"
                          variant="outlined"
                          error={touched.donor && Boolean(errors.donor)}
                          helperText={touched.donor && errors.donor}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Field
                          as={TextField}
                          fullWidth
                          name="invoiceType"
                          label="Invoice Type"
                          variant="outlined"
                          error={
                            touched.invoiceType && Boolean(errors.invoiceType)
                          }
                          helperText={touched.invoiceType && errors.invoiceType}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Field
                          as={TextField}
                          fullWidth
                          name="producer"
                          label="Producer"
                          variant="outlined"
                          error={touched.producer && Boolean(errors.producer)}
                          helperText={touched.producer && errors.producer}
                        />
                      </Grid>
                    </>
                  )}

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        color="primary"
                        size="large"
                        onClick={() => navigate(-1)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        size="large"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Updating..." : "Update Inspection"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </LocalizationProvider>
      </Container>

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

export default UpdateInspection;
