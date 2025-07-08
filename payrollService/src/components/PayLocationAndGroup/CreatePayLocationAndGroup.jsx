import { useState, useEffect } from "react";
import { Box, Button, TextField, Snackbar, Alert } from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import Header from "../common/Header";
import {
  createpayLocationGroup,
  getAllpayEmployeeEarningDeduction,
  getAllpayLocationGroup,
} from "../../../Api/payrollApi";
import GetAllPayLocationAndGroup from "./GetAllPayLocationAndGroup";

const CreatePayLocationAndGroup = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const [paylocationGroup, setPaylocationGroup] = useState(0);
    const [erningEmployeeErningDeduction, setErningEmployeeErningDeduction] = useState(0);


  useEffect(() => {
    fetchAllpayLocationGroup();
    fetchAllEmployeeErningDeduction();
  }, []);

  const fetchAllpayLocationGroup = async () => {
    try {
      const response = await getAllpayLocationGroup();
      const data = response.data;
      setPaylocationGroup(data);
    } catch (error) {
      console.error(
        "Error fetching fetch all pay location group:",
        error.message
      );
    }
  };
   const fetchAllEmployeeErningDeduction = async () => {
    try {
      const response = await getAllpayEmployeeEarningDeduction();
      const data = response.data;
      setErningEmployeeErningDeduction(data);
    } catch (error) {
      console.error(
        "Error fetching fetch all employee erning dedeuction:",
        error.message
      );
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const paylocationGroupExist = paylocationGroup.some(
        (paylocationgroup) =>
          paylocationgroup.payLocation === values.payLocation &&
          paylocationGroup.payGroup
      );

      if (paylocationGroupExist) {
        setNotification({
          open: true,
          message:
            " pay location group already exists. Please use a different one.",
          severity: "warning",
        });
        return;
      }

      await createpayLocationGroup(values);
      setNotification({
        open: true,
        message: "pay location group created successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to create pay location group . Please try again.",
        severity: "error",
      });
    }
  };

  const initialValues = {
    payLocation: "",
    payGroup: "",
    description: "",
  };

  const checkoutSchema = yup.object().shape({
    payLocation: yup.string().required("payLocation is required"),
    payGroup: yup.string().required("payGroup is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create Pay Location and Group" />
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
              <TextField
                fullWidth
                type="text"
                label="payLocation"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.payLocation}
                name="payLocation"
                error={!!touched.payLocation && !!errors.payLocation}
                helperText={touched.payLocation && errors.payLocation}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                type="text"
                label="payGroup"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.payGroup}
                name="payGroup"
                error={!!touched.payGroup && !!errors.payGroup}
                helperText={touched.payGroup && errors.payGroup}
                sx={{ gridColumn: "span 2" }}
              />
                 <TextField
                              fullWidth
                              type="text"
                              label="description"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.description}
                              name="description"
                              error={!!touched.description && !!errors.description}
                              helperText={touched.description && errors.description}
                              sx={{ gridColumn: "span 2" }}
                            />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create PayLocationAndGroup
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
      <GetAllPayLocationAndGroup refreshKey={refreshKey} />
    </Box>
  );
};

export default CreatePayLocationAndGroup;
