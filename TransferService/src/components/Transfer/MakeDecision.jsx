import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Snackbar,
  Alert,
} from "@mui/material";
import * as yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Formik } from "formik";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import Header from "../common/Header";
import NotPageHandle from "../common/NotPageHandle";

const MakeDecision = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const transferId = location.state?.transferId;
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

  if (!transferId || !tenantId) {
    return (
      <NotPageHandle
        message="Missing required parameters: tenantId or transferId. Redirecting to List Transfer..."
        navigateTo="/transfer/list"
      />
    );
  }

  const handleFormSubmit = async (values) => {
    const requestUrl = `http://172.20.136.101:8000/api/transfer/transfers/${tenantId}/approve/${transferId}`;
    const requestBody = {
      decision: values.decision,
      comment: values.comment,
    };

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setNotification({
          open: true,
          message: "Authorization token is missing. Please log in again.",
          severity: "error",
        });
        navigate("/transfer/list");
        return;
      }

      const response = await fetch(requestUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        setNotification({
          open: true,
          message: "Decision updated successfully!",
          severity: "success",
        });
        setTimeout(() => {
          navigate("/transfer/list");
        }, 200);
      } else if (response.status === 401) {
        setNotification({
          open: true,
          message: "Unauthorized. Please log in again.",
          severity: "error",
        });
        navigate("/transfer/list");
      } else {
        const errorData =
          response.headers.get("Content-Length") > 0
            ? await response.json()
            : {};
        setNotification({
          open: true,
          message: `Error updating decision: ${
            errorData.message || response.statusText
          }`,
          severity: "error",
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: `Error updating decision: ${error.message}`,
        severity: "error",
      });
    }
  };

  return (
    <Box m="20px">
      <Header subtitle="Make Decision" />
      <Formik
        initialValues={{
          decision: "",
          comment: "",
        }}
        validationSchema={yup.object().shape({
          decision: yup.string().required("Decision is required"),
          comment: yup.string().required("Comment is required"),
        })}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Decision</InputLabel>
              <Select
                name="decision"
                value={values.decision}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.decision && Boolean(errors.decision)}
              >
                <MenuItem value="APPROVED">APPROVED</MenuItem>
                <MenuItem value="PENDING">PENDING</MenuItem>
                <MenuItem value="REJECTED">REJECTED</MenuItem>
              </Select>
              <FormHelperText>
                {touched.decision && errors.decision}
              </FormHelperText>
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              name="comment"
              label="Comment"
              value={values.comment}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.comment && Boolean(errors.comment)}
              helperText={touched.comment && errors.comment}
              
            />

            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" variant="contained" color="primary">
                Submit Decision
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MakeDecision;
