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
import Header from "../common/Header";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import {
  decisionGatePassInformation,
  decisionInterStoreIssueVoucherForIssue,
  
} from "../../Api/storeMovementAp";

import { useLocation, useNavigate } from "react-router-dom";



const DecisionInterStoreIssueVoucherForIssue = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = location.state || {};
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

 



 



const handleFormSubmit = async (values, { resetForm }) => {

  try {
    await decisionInterStoreIssueVoucherForIssue(tenantId,id, values);
    setNotification({
      open: true,
      message: "inter store issue vouncher  is decided successfully!",
      severity: "success",
    });
    resetForm();
        navigate('/storeMovent/create_inter_Store_Issue'); //
  } catch (error) {
    console.error("Failed to submit form data:", error);
    setNotification({
      open: true,
      message: error.response.data || "Failed to submit. Please try again.",
      severity: "error",
    });
  }
};
 
  const initialValues = {
   
     status: "",
  remark: ""
  };


  const checkoutSchema = yup.object().shape({

    status: yup.string().required("Status  is required"),
    remark: yup.string().required("remark   is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Make Decison of inter store issue vouncher " />
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
            
              <FormControl fullWidth sx={{ gridColumn: "span 2", mb: 2 }}>
                <InputLabel id="status type-label">
                  please select status
                </InputLabel>
                <Select
                  labelId="status-label"
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "status" }}
                  name="status" // Corrected name
                  error={!!touched.status && !!errors.status} // Corrected error handling
                  sx={{
                    flexGrow: 1,
                    flexShrink: 1,
                    minWidth: 0,
                    gridColumn: "span 2",
                  }}
                >
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                   <MenuItem value="REJECTED">Rejected</MenuItem>
                </Select>
                {touched.status && errors.status && (
                  <FormHelperText error>
                    {errors.status}
                  </FormHelperText>
                )}
              </FormControl>

  

            

              <TextField
                fullWidth
                type="text"
                label="remark"
                InputLabelProps={{ shrink: true }}
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
              >
                Decision Gate Pass Info
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

export default DecisionInterStoreIssueVoucherForIssue;
