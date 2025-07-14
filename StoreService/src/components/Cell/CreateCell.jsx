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
import { createCell } from "../../Api/storeApi";
import {  getAllStores, createShelf, getAllShelves } from "../../Api/storeApi";
import ListCell from "./ListCell";
import { useLocation,useNavigate } from "react-router-dom";

// import ListShelf from "./ListShelf";

const CreateCell = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
    const location = useLocation();
  const { shelfId } = location.state || {};
  const { storeId } = location.state || {};
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

    const [shelfs, setShelfs] = useState([]);
        const [storeShelfs, setStoreShelfs] = useState([]);

  useEffect(() => {
    fetchAllSore();
    fetchAllShelf();
  }, []);

  const fetchAllSore = async () => {
    try {
      const response = await getAllStores(tenantId);
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching store:", error.message);
    }
  };

  const fetchAllShelf = async () => {
    try {
      const response = await getAllShelves(tenantId,storeId);
      setShelfs(response.data);
    } catch (error) {
      console.error("Error fetching shelf:", error.message);
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

  //     const cellCodeExistance = storeShelfs.some(
  //       (storeShelf) => storeShelf.cellCode === values.cellCode
  //   );

  //   if (cellCodeExistance) {
  //     setNotification({
  //         open: true,
  //         message: "shelf code already exists. Please use a different one.",
  //         severity: "warning",
  //     });
  //     return;
  // }
      await createCell(tenantId, values);
      setNotification({
        open: true,
        message: "cell of the shell is  successfully created!",
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
  cellCode: "",
  shelfRow: "",
  storeType: "",
  shelfId: "",
  storeId: ""
  };

const checkoutSchema = yup.object().shape({
  cellCode: yup
    .string()
    .required("cellCode is required")
    .min(0, "cellCode must be at least 0 characters")
    .max(50, "cellCode must be at most 50 characters"),
  shelfRow: yup.string().required("shelfRow is required"),
  storeType: yup.string().required("storeType is required"),
  shelfId: yup.string().required("shelf date is required"),
  storeId: yup.string().required("store is required"),
});

  return (
    <Box m="20px">
      <Header subtitle="Create cell shelve for store " />
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
                  !!touched.shelfId && !!errors.shelfId
                }
              >
                <InputLabel id="shelfId-label">
                  Select store shelf 
                </InputLabel>
                <Select
                  labelId="shelfId-label"
                  value={values.shelfId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="shelfId"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select select store shelf </em>
                  </MenuItem>
                  {shelfs.map((shelf) => (
                    <MenuItem key={shelf.id} value={shelf.id}>
                      {shelf.shelfCode}
                    </MenuItem>
                  ))}
                </Select>
                {touched.shelfId && errors.shelfId && (
                  <FormHelperText>{errors.shelfId}</FormHelperText>
                )}
              </FormControl>

            

             

           
              <TextField
                fullWidth
             type="text"
                label="cellCode"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cellCode}
                name="cellCode"
                error={!!touched.cellCode && !!errors.cellCode}
                helperText={touched.cellCode && errors.cellCode}
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
                type="number"
                label="shelfRow "
                InputLabelProps={{ shrink: true }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.shelfRow}
                name="shelfRow"
                error={!!touched.shelfRow && !!errors.shelfRow}
                helperText={touched.shelfRow && errors.shelfRow}
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
      <ListCell refreshKey={refreshKey} />

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

export default CreateCell;
