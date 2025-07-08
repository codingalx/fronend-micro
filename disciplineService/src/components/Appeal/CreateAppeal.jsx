import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Snackbar, Alert } from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik, Form } from "formik";
import Header from "../../common/Header";
import { createAppeal, getAllAppeals } from "../../Api/disciplineApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import { useLocation, useNavigate } from "react-router-dom";
import NoPageHandle from "../../common/NoPageHandle";
import ListAppeal from "./ListAppeal";

const CreateAppeal = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appeals, setAppeals] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
  

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { offenseName, disciplineId } = state || {};

  useEffect(() => {
    fetchAllAppeals();
  }, []);

  const fetchAllAppeals = async () => {
    try {
      const response = await getAllAppeals(tenantId);
      setAppeals(response.data);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error("Error fetching appeals:", error);
      setNotification({
        open: true,
        message: "Failed to fetch existing appeals",
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
      
      if (!disciplineId) {
        throw new Error("No discipline record found");
      }

      const appealExists = appeals.some(appeal => appeal.disciplineId === disciplineId);

      if (appealExists) {
        setNotification({
          open: true,
          message: "You have already submitted an appeal for this discipline",
          severity: "warning",
        });
        return;
      }

      await createAppeal(tenantId, {
        disciplineId: disciplineId,
        remark: values.remark,
      });
      
      setNotification({
        open: true,
        message: "Appeal created successfully!",
        severity: "success",
      });
      resetForm();
      setAppeals(await getAllAppeals(tenantId));
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to create appeal. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    offenseName: offenseName || "",
    remark: "",
  };

  const checkoutSchema = yup.object().shape({
    remark: yup.string().required("Remark is required"),
  });

  if (!disciplineId) {
    return (
      <NoPageHandle
        message="No discipline record selected to create appeal"
        navigateTo="/discipline/list-discipline-for-user"
      />
    );
  }

  return (
    <Box m="20px">
      <Header subtitle="Create Appeal" />
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
                {loading ? "Submitting..." : "Create Appeal"}
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
        <ListAppeal refreshKey={refreshKey} disciplineId={disciplineId} />

    </Box>
  );
};

export default CreateAppeal;