import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik, Form } from "formik";
import Header from "../../common/Header";
import { updateCell, getCellById, getStoreById, getShelfById } from "../../Api/storeApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import { useLocation, useNavigate } from "react-router-dom";
import NoPageHandle from "../../common/NoPageHandle";

const UpdateCell = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;
  const location = useLocation();
  const navigate = useNavigate();
  const { cellId, shelfId, storeId, cellData } = location.state || {};

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState("");
  const [shelfCode, setShelfCode] = useState("");
  const [initialValues, setInitialValues] = useState({
    cellCode: "",
    shelfRow: "",
    storeType: "",
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const cellResponse = cellData 
        ? { data: cellData } 
        : await getCellById(tenantId, shelfId, cellId);
      
      const storeResponse = await getStoreById(tenantId, storeId);
      const shelfResponse = await getShelfById(tenantId, storeId, shelfId);
      
      setInitialValues({
        cellCode: cellResponse.data.cellCode,
        shelfRow: cellResponse.data.shelfRow,
        storeType: cellResponse.data.storeType,
      });
      
      setStoreName(storeResponse.data.storeName);
      setShelfCode(shelfResponse.data.shelfCode);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setNotification({
        open: true,
        message: "Failed to load cell data",
        severity: "error",
      });
      setLoading(false);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      const payload = {
        cellCode: values.cellCode,
        shelfRow: values.shelfRow,
        storeType: initialValues.storeType,
        shelfId,
        storeId,
      };

      await updateCell(tenantId, cellId, payload);
      
      setNotification({
        open: true,
        message: "Cell updated successfully!",
        severity: "success",
      });
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      console.error("Failed to update cell:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to update cell. Please try again.",
        severity: "error",
      });
    }
  };

  const checkoutSchema = yup.object().shape({
    cellCode: yup.string().required("Cell code is required"),
    shelfRow: yup.string().required("Shelf row is required"),
  });

  if (loading) {
    return (
      <Box m="20px" display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const handleNavigate = () => {
    navigate('/store/store_setup', { state: { id, activeTab: 3 } });
  };

  if (!cellId || !shelfId || !storeId) {
    return (
      <NoPageHandle
        message="No store selected for update."
        navigateTo={handleNavigate}
      />
    );
  }

  return (
    <Box m="20px">
      <Header subtitle="Update Cell" />
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
        }) => (
          <Form onSubmit={handleSubmit}>
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
                label="Cell Code"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cellCode}
                name="cellCode"
                error={!!touched.cellCode && !!errors.cellCode}
                helperText={touched.cellCode && errors.cellCode}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="text"
                label="Shelf Row"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.shelfRow}
                name="shelfRow"
                error={!!touched.shelfRow && !!errors.shelfRow}
                helperText={touched.shelfRow && errors.shelfRow}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                label="Shelf Code"
                value={shelfCode}
                InputProps={{ readOnly: true }}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                label="Store Name"
                value={storeName}
                InputProps={{ readOnly: true }}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                label="Store Type"
                value={initialValues.storeType}
                InputProps={{ readOnly: true }}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>

            <input type="hidden" name="shelfId" value={shelfId} />
            <input type="hidden" name="storeId" value={storeId} />
            <input type="hidden" name="storeType" value={initialValues.storeType} />

            <Box display="flex" justifyContent="start" mt="20px" gap={2}>
              <Button 
                type="submit" 
                color="secondary" 
                variant="contained"
              >
                Update Cell
              </Button>
            </Box>
          </Form>
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

export default UpdateCell;