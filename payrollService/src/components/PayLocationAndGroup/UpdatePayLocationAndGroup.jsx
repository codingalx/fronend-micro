import { useState, useEffect } from "react";
import { Box, Button, TextField, Snackbar, Alert } from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import Header from "../common/Header";
import {
  createpayLocationGroup,
  getAllpayLocationGroup,
  getpayLocationGroupById,
  updatepayLocationGroup,
} from "../../../Api/payrollApi";
import { useLocation,useNavigate } from "react-router-dom";

const UpdatePayLocationAndGroup = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
    const location = useLocation();
    const { id } = location.state || {};
      const navigate = useNavigate();

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [paylocationGroup, setPaylocationGroup] = useState(0);
    const [paylocationGroupSingle, setPaylocationGroupSingle] = useState({
         payLocation: "",
    payGroup: "",
    description: "",
    });


  useEffect(() => {
    fetchAllpayLocationGroup();
    fetchpayLocationGroup();
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

   const fetchpayLocationGroup = async () => {
    try {
      const response = await getpayLocationGroupById(id);
      const data = response.data;
      setPaylocationGroupSingle(data);
    } catch (error) {
      console.error(
        "Error fetching fetch  pay location group:",
        error.message
      );
    }
  };


  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const paylocationGroupExist = paylocationGroup.some(
        (paylocationgroup) =>
         ( paylocationgroup.payLocation === values.payLocation &&
          paylocationGroup.payGroup  && paylocationGroup.id !== id)
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

      await updatepayLocationGroup(id,values);
      setNotification({
        open: true,
        message: "pay location group created successfully!",
        severity: "success",
      });
      resetForm();
        navigate('/payroll/create_paylocation_group'); 

    
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to create pay location group . Please try again.",
        severity: "error",
      });
    }
  };



  const checkoutSchema = yup.object().shape({
    payLocation: yup.string().required("payLocation is required"),
    payGroup: yup.string().required("payGroup is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Update Pay Location and Group" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={paylocationGroupSingle}
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
     
    </Box>
  );
};

export default UpdatePayLocationAndGroup;
