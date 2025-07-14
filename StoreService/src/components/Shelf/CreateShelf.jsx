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
import Header from "../../common/Header";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import {  getAllStores, getAllStoreCategories, createShelf } from "../../Api/storeApi";
import ListShelf from "./ListShelf";

const CreateShelf = () => {
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

    const [categories, setCategories] = useState([]);
        const [storeShelfs, setStoreShelfs] = useState([]);





  useEffect(() => {
    fetchAllSore();
    fetchAllCategory();
    // fetchAllStoreShelf();
  }, []);

  const fetchAllSore = async () => {
    try {
      const response = await getAllStores(tenantId);
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching store:", error.message);
    }
  };

  const fetchAllCategory = async () => {
    try {
      const response = await getAllStoreCategories(tenantId);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  //   const fetchAllStoreShelf = async () => {
  //   try {
  //     const response = await getAllShelves(tenantId);
  //     setStoreShelfs(response.data);
  //   } catch (error) {
  //     console.error("Error fetching store shelf:", error.message);
  //   }
  // };


  const handleFormSubmit = async (values, { resetForm }) => {
    try {

  //     const shelfCodeExistance = storeShelfs.some(
  //       (storeShelf) => storeShelf.shelfCode === values.shelfCode
  //   );

  //   if (shelfCodeExistance) {
  //     setNotification({
  //         open: true,
  //         message: "shelf code already exists. Please use a different one.",
  //         severity: "warning",
  //     });
  //     return;
  // }
      await createShelf(tenantId, values);
      setNotification({
        open: true,
        message: "create store shelf successfully!",
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
  shelfCode: "",
  storeName: "",
  storeType: "",
  storeCategoryId: "",
  storeId: ""
  };

  const checkoutSchema = yup.object().shape({
    shelfCode: yup.string().required("shelfCode  is required"),
    storeName: yup.string().required("store name is required"),
    storeType: yup.string().required("storestoreType is required"),
    storeCategoryId: yup.string().required("storeCategory date is required"),
    storeId: yup.string().required("store  is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create store shelf " />
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
                  !!touched.storeCategoryId && !!errors.storeCategoryId
                }
              >
                <InputLabel id="storeCategoryId-label">
                  Select store category 
                </InputLabel>
                <Select
                  labelId="storeCategoryId-label"
                  value={values.storeCategoryId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="storeCategoryId"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select select store category </em>
                  </MenuItem>
                  {categories.map((categorie) => (
                    <MenuItem key={categorie.id} value={categorie.id}>
                      {categorie.name}
                    </MenuItem>
                  ))}
                </Select>
                {touched.storeCategoryId && errors.storeCategoryId && (
                  <FormHelperText>{errors.storeCategoryId}</FormHelperText>
                )}
              </FormControl>

            

             

           
              <TextField
                fullWidth
             type="text"
                label="shelfCode"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.shelfCode}
                name="shelfCode"
                error={!!touched.shelfCode && !!errors.shelfCode}
                helperText={touched.shelfCode && errors.shelfCode}
                sx={{ gridColumn: "span 2" }}
              />

              <FormControl fullWidth sx={{ gridColumn: "span 2", mb: 2 }}>
                <InputLabel id="storeType-label">select storeType</InputLabel>
                <Select
                  labelId="storeType-label"
                  value={values.storeType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "storeType" }}
                  name="storeType" // Corrected name
                  error={!!touched.storeType && !!errors.storeType} // Corrected error handling
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
                {touched.storeType && errors.storeType && (
                  <FormHelperText error>{errors.storeType}</FormHelperText>
                )}
              </FormControl>


             


          
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                label="storeName "
                InputLabelProps={{ shrink: true }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.storeName}
                name="storeName"
                error={!!touched.storeName && !!errors.storeName}
                helperText={touched.storeName && errors.storeName}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Sore Shelf
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <ListShelf refreshKey={refreshKey} />

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

export default CreateShelf;
