import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import Header from "../common/Header";
import { createInternshipPayment, listInternshipPayments } from "../../../configuration/TrainingApi";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import ListInternshipPayment from "./ListInternshipPayment";


const CreateInterbshipPayment = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const interStudentId = location?.state?.id;
        const [authState] = useAtom(authAtom);
        const tenantId = authState.tenantId

  const [refreshKey, setRefreshKey] = useState(0);
  const [internPayment, setInternPayment] = useState([]);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    fetchAllInternPayment();
  }, [refreshKey]);

  const fetchAllInternPayment = async () => {
    try {
      const response = await listInternshipPayments(tenantId);
      setInternPayment(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    const isAlreadyPaid = internPayment.some(
      (payment) => payment.internId === interStudentId
    );

    if (isAlreadyPaid) {
      setError("Payment has already been made for this student.");
      setSnackbarOpen(true);
      return;
    }

    try {
      await createInternshipPayment(tenantId,values);
      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError(error.response.data || "Conflict: Payment already exists.");
      } else {
        setError("Failed to submit form data.");
      }
      setSnackbarOpen(true);
    }
  };

  const initialValues = {
    referenceLetter: "",
    startDate: "",
    endDate: "",
    paymentAmount: "",
    internId: interStudentId,
    remark: "",
  };

  const checkoutSchema = yup.object().shape({
    referenceLetter: yup.string().required("Reference letter cannot be blank"),
    startDate: yup.date().nullable().required("Start date cannot be null"),
    endDate: yup
      .date()
      .nullable()
      .required("End date cannot be null")
      .min(
        yup.ref("startDate"),
        "End date must be after or the same day as start date"
      ),
    paymentAmount: yup
      .number()
      .nullable()
      .required("Payment amount cannot be null")
      .min(0, "Payment amount must be non-negative"),
    remark: yup.string().nullable(),
  });

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box m="20px">
      <Header subtitle="Create payment for the student" />

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
          resetForm,
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
                label="Reference Letter"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.referenceLetter}
                name="referenceLetter"
                error={!!touched.referenceLetter && !!errors.referenceLetter}
                helperText={touched.referenceLetter && errors.referenceLetter}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="number"
                label="Payment Amount"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.paymentAmount}
                name="paymentAmount"
                error={!!touched.paymentAmount && !!errors.paymentAmount}
                helperText={touched.paymentAmount && errors.paymentAmount}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.startDate}
                name="startDate"
                error={!!touched.startDate && !!errors.startDate}
                helperText={touched.startDate && errors.startDate}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="date"
                label="End Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.endDate}
                name="endDate"
                error={!!touched.endDate && !!errors.endDate}
                helperText={touched.endDate && errors.endDate}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
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
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Submit
              </Button>
              <Button
                type="button"
                color="primary"
                variant="contained"
                onClick={() => resetForm()}
                style={{ marginLeft: "10px" }}
              >
                Reset
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
      <ListInternshipPayment refreshKey={refreshKey} />
    </Box>
  );
};

export default CreateInterbshipPayment;
