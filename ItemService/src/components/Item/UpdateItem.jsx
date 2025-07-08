import React, { useEffect } from 'react';
import { useState } from 'react';
import { useLocation ,useNavigate} from 'react-router-dom';

import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Snackbar,
  Alert,
  Typography,
  Paper
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { updateItem,getItemById } from '../../Api/ItemServiceApi';
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import Header from '../Header';
import NotPageHandle from '../common/NoPageHandle';

const UpdateItem = () => {
      const [authState] = useAtom(authAtom);
      const tenantId = authState.tenantId;
      const location = useLocation();
      const navigate = useNavigate();

      const itemId = location?.state?.itemId;
      const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success",

        });
        useEffect(() => {
            itemData();
        }, [tenantId, itemId]);

        const [item, setItem] = useState(null);
        const itemData = async () => {
          
            try {
                const response = await getItemById(tenantId, itemId);
                setItem(response.data);
            } catch (error) {
                console.error("Error fetching item data:", error);
                setNotification({
                    open: true,
                    message: "Error fetching item data.",
                    severity: "warning",
                });
  
            }
  };
  const  initialValue = {
    category: item?.category || '',
    subCategory: item?.subCategory || '',
    stockMovementType: item?.stockMovementType || '',
    itemCode: item?.itemCode || '',
    itemName: item?.itemName || '',
    itemProperty: item?.itemProperty || '',
    plateNumber: item?.plateNumber || 0,
    modelNumber: item?.modelNumber || 0,
    quantity:       item?.quantity || 0,
    unitPrice:  item?.unitPrice || 0,
    totalPrice: item?.totalPrice || 0,
    itemCategory: item?.itemCategory || '',
    bachNumber: item?.bachNumber || '',
    serialNumber: item?.serialNumber || '',
    expireDate: item?.expireDate ? new Date(item.expireDate) : null,
    purchasedDate: item?.purchasedDate ? new Date(item.purchasedDate) : null,
    serviceDate: item?.serviceDate ? new Date(item.serviceDate) : null,
    minimumLevel: item?.minimumLevel || '',
    maximumLevel: item?.maximumLevel || '',
    recordLevel: item?.recordLevel || '',
    safetyStock: item?.safetyStock || '',
    partNumber:     item?.partNumber || 0,
    taxType: item?.taxType || '',
    intendedPurpose: item?.intendedPurpose || '',
    measureUnit: item?.measureUnit || '',
    measurePackage: item?.measurePackage || '',
                };

  const validationSchema = Yup.object().shape({
    itemCode: Yup.string().required('Item Code is required'),
    itemName: Yup.string().required('Item Name is required'),
    quantity: Yup.number().min(0, 'Quantity must be positive'),
    unitPrice: Yup.number().min(0, 'Unit price must be positive'),
    itemCategory: Yup.string().required('Item category is required'),
    stockMovementType: Yup.string().required('Stock movement type is required'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formattedValues = {
        ...values,
        expireDate: values.expireDate ? values.expireDate.toISOString() : null,
        purchasedDate: values.purchasedDate ? values.purchasedDate.toISOString() : null,
        serviceDate: values.serviceDate ? values.serviceDate.toISOString() : null
      };

      await updateItem(tenantId,itemId, formattedValues);
      resetForm();
      setNotification
        ({ 
            open: true,
             message: 'Item updated  successfully!',
              severity: 'success'
             });
            setTimeout(() => {
      navigate('/item/create-item');
    }, 1500);

    } catch (error) {
      console.error('Error creating item:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const itemCategories = [
    { value: 'FIXED_ASSET', label: 'Fixed Asset' },
    { value: 'CONSUMABLE', label: 'Consumable' },
    { value: 'INVENTORY', label: 'Inventory' }
  ];
     
  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

if(!itemId) {
  return <NotPageHandle message="No Item ID provided" navigateTo="/item/create-item"/>;  
}
  

  return (
    <Box m="20px">
    <Container maxWidth="lg">
     
   <Header subtitle= "Create New Item" />
        
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Formik
            initialValues={initialValue}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize

          >
            {({ values, errors, touched, handleChange, setFieldValue, isSubmitting }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Basic Information
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="itemCode"
                      label="Item Code"
                      variant="outlined"
                      error={touched.itemCode && Boolean(errors.itemCode)}
                      helperText={touched.itemCode && errors.itemCode}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="itemName"
                      label="Item Name"
                      variant="outlined"
                      error={touched.itemName && Boolean(errors.itemName)}
                      helperText={touched.itemName && errors.itemName}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Item Category</InputLabel>
                      <Select
                        name="itemCategory"
                        value={values.itemCategory}
                        onChange={handleChange}
                        label="Item Category"
                        error={touched.itemCategory && Boolean(errors.itemCategory)}
                      >
                        {itemCategories.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="itemProperty"
                      label="Item Property"
                      variant="outlined"
                    />
                  </Grid>
                    <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="stockMovementType"
                      label="Stock Movement Type"
                      variant="outlined"
                      
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="category"
                      label="Category"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="subCategory"
                      label="Sub Category"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Inventory Details
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="quantity"
                      label="Quantity"
                      type="number"
                      variant="outlined"
                      error={touched.quantity && Boolean(errors.quantity)}
                      helperText={touched.quantity && errors.quantity}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="unitPrice"
                      label="Unit Price"
                      type="number"
                      variant="outlined"
                      error={touched.unitPrice && Boolean(errors.unitPrice)}
                      helperText={touched.unitPrice && errors.unitPrice}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="totalPrice"
                      label="Total Price"
                      type="number"
                      variant="outlined"
                      disabled
                      value={values.quantity * values.unitPrice}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="minimumLevel"
                      label="Minimum Level"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="maximumLevel"
                      label="Maximum Level"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Identification Numbers
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="serialNumber"
                      label="Serial Number"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="bachNumber"
                      label="Batch Number"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="partNumber"
                      label="Part Number"
                      type="number"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="plateNumber"
                      label="Plate Number"
                      type="number"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="modelNumber"
                      label="Model Number"
                      type="number"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Important Dates
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label="Purchased Date"
                      value={values.purchasedDate}
                      onChange={(date) => setFieldValue('purchasedDate', date)}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth variant="outlined" />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label="Service Date"
                      value={values.serviceDate}
                      onChange={(date) => setFieldValue('serviceDate', date)}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth variant="outlined" />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label="Expire Date"
                      value={values.expireDate}
                      onChange={(date) => setFieldValue('expireDate', date)}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth variant="outlined" />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Additional Information
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="taxType"
                      label="Tax Type"
                      type="text"
                      variant="outlined"
                      error={touched.taxType && Boolean(errors.taxType)}
                      helperText={touched.taxType && errors.taxType}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="intendedPurpose"
                      label="Intended Purpose"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="measureUnit"
                      label="Measure Unit"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="measurePackage"
                      label="Measure Package"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        size="large"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Updating ...' : 'Upadate Item'}
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

export default UpdateItem;