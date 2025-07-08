import React from 'react';
import { useState ,useEffect } from 'react';
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
import { createItem ,getAllItems , getItemsByCategory } from '../../Api/ItemServiceApi';
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import Header from '../Header';
import ListItems from './ItemList';

const CreateItem = () => {
      const [authState] = useAtom(authAtom);
      const tenantId = authState.tenantId;

  const [items, setItems] = useState([]);
      const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success",
        });
  const initialValues = {
    category: '',
    subCategory: '',
    stockMovementType: '',
    itemCode: '',
    itemName: '',
    itemProperty: '',
    plateNumber: 0,
    modelNumber: 0,
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    itemCategory: 'FIXED_ASSET',
    bachNumber: '',
    serialNumber: '',
    expireDate: null,
    purchasedDate: null,
    serviceDate: null,
    minimumLevel: '',
    maximumLevel: '',
    recordLevel: '',
    safetyStock: '',
    partNumber: 0,
    taxType: '',
    intendedPurpose: '',
    measureUnit: '',
    measurePackage: ''
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

      await createItem(tenantId, formattedValues);
            setRefreshKey((prev) => prev + 1);

      resetForm();
      setNotification
        ({ 
            open: true,
             message: 'Item created successfully!',
              severity: 'success'
             });

    } catch (error) {
      console.error('Error creating item:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const itemCategories = [
    { value: 'FIXED_ASSET', label: 'Fixed Asset' },
    { value: ' NON_FIXED_ASSET', label: 'NON_FIXED_ASSET' },
    { value: 'MERCHANDISED', label: 'MERCHANDISED' }
  ];
 
     
  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };
    const [refreshKey, setRefreshKey] = useState(0);
  

 

  return (
    <Box m="20px">
    <Container maxWidth="lg">
     
   <Header subtitle= "Create New Item" />
 

        
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
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
                        {isSubmitting ? 'Creating...' : 'Create Item'}
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
               <ListItems refreshKey = {refreshKey} />
    </Box>
    
  );
};

export default CreateItem;