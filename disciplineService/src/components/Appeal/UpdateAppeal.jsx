import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Snackbar, Alert } from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik, Form } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { updateAppeal, getAppeal } from "../../Api/disciplineApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import Header from "../../common/Header";
import NoPageHandle from "../../common/NoPageHandle";

const UpdateAppeal = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { appealId, offenseName } = location.state || {};
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const [loading, setLoading] = useState(true);
  const [appealData, setAppealData] = useState(null);

  useEffect(() => {
      fetchAppeal();
  }, []);

  const fetchAppeal = async () => {
    try {
      const response = await getAppeal(tenantId, appealId);
      setAppealData(response.data);
    } catch (error) {
      console.error("Error fetching appeal:", error);
      setNotification({
        open: true,
        message: "Failed to fetch appeal data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);
      
      if (!appealData) {
        throw new Error("No appeal data loaded");
      }

      await updateAppeal(tenantId, appealId, {
        disciplineId: appealData.disciplineId,
        remark: values.remark,
      });
      
      setNotification({
        open: true,
        message: "Appeal updated successfully!",
        severity: "success",
      });
      resetForm();
      const disciplineId = appealData.disciplineId;
      navigate("/discipline/create-appeal",{ state: { disciplineId} });
      
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to update appeal. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    offenseName: offenseName || appealData?.offenseName || "",
    remark: appealData?.remark || "",
  };

  const checkoutSchema = yup.object().shape({
    remark: yup.string().required("Remark is required"),
  });

  if (!appealId) {
    return (
      <NoPageHandle
        message="No appeal selected for update"
        navigateTo="/discipline/create-appeal"
      />
    );
  }

  if (loading && !appealData) {
    return <Box m="20px">Loading appeal data...</Box>;
  }

  return (
    <Box m="20px">
      <Header subtitle="Update Appeal" />
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
                variant="outlined"
                label="Offense Name"
                name="offenseName"
                value={values.offenseName}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Remark"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.remark}
                name="remark"
                error={!!touched.remark && !!errors.remark}
                helperText={touched.remark && errors.remark}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button 
                type="submit" 
                color="secondary" 
                variant="contained"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Appeal"}
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
        <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateAppeal;