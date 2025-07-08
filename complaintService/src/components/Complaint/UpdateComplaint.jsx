import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  getComplaint,
  updateComplaint,
  getEmployeeById,
} from "../../Api/ComplaintApi";
import { getAllComplaintTypes } from "../../Api/ComplaintTypeApi";
import NotPageHandle from "../../common/NoPageHandle";
import Header from "../../common/Header";

const UpdateComplaint = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tenantId, complaintId } = location.state || {};
  const [initialValues, setInitialValues] = useState({
    employeeName: "",
    employeeId: "",
    complaintTypeId: "",
    description: "",
    complaintDate: "",
    remark: "",
  });
  const [complaintTypes, setComplaintTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const validationSchema = Yup.object().shape({
    employeeName: Yup.string().required("Employee Name is required"),
    complaintTypeId: Yup.string().required("Complaint Type is required"),
    description: Yup.string().required("Description is required"),
    complaintDate: Yup.date().required("Complaint Date is required"),
    remark: Yup.string(),
  });

  if (!tenantId || !complaintId) {
    return (
      <NotPageHandle
        message="No Complaint selected to update"
        navigateTo="/complaint/create-complaint"
      />
    );
  }

  const fetchComplaintData = async () => {
    try {
      const response = await getComplaint(tenantId, complaintId);
      const complaintData = response.data;

      // Fetch employee details
      const employeeResponse = await getEmployeeById(
        tenantId,
        complaintData.employeeId
      );
      const employeeName = `${employeeResponse.firstName} ${
        employeeResponse.middleName || ""
      } ${employeeResponse.lastName}`.trim();

      setInitialValues({
        ...complaintData,
        employeeName,
        complaintTypeId:
          complaintData.complaintTypeId || complaintData.complaintTypeID || "",
        remark: complaintData.remark || "",
      });
    } catch (error) {
      console.error("Error fetching complaint data:", error);
      setNotification({
        open: true,
        message: "Failed to load complaint data.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComplaintTypes = async () => {
    try {
      const response = await getAllComplaintTypes(tenantId);
      setComplaintTypes(response);
    } catch (error) {
      console.error("Error fetching complaint types:", error);
      setNotification({
        open: true,
        message: "Failed to fetch complaint types.",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchComplaintData();
    fetchComplaintTypes();
  }, [tenantId, complaintId]);

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const complaintData = {
        employeeId: initialValues.employeeId, // Send the actual employee ID
        complaintTypeId: values.complaintTypeId,
        description: values.description,
        complaintDate: values.complaintDate,
        remark: values.remark,
      };

      await updateComplaint(tenantId, complaintId, complaintData);

      setNotification({
        open: true,
        message: "Complaint updated successfully!",
        severity: "success",
      });
      resetForm();
      setTimeout(() => navigate("/complaint/create-complaint"), 20); // Redirect after success
    } catch (error) {
      console.error("Error updating complaint:", error);
      setNotification({
        open: true,
        message: "Failed to update complaint. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <p>Loading...</p>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header subtitle="Update Complaint" />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
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
                "& > div": { gridColumn: "span 2" },
              }}
            >
              <TextField
                fullWidth
                label="Employee Name"
                name="employeeName"
                value={values.employeeName}
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth>
                <InputLabel id="complaint-type-label">
                  Complaint Type
                </InputLabel>
                <Select
                  labelId="complaint-type-label"
                  name="complaintTypeId"
                  value={values.complaintTypeId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.complaintTypeId && !!errors.complaintTypeId}
                >
                  {complaintTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
                {touched.complaintTypeId && errors.complaintTypeId && (
                  <Box color="red" fontSize="12px">
                    {errors.complaintTypeId}
                  </Box>
                )}
              </FormControl>

              <TextField
                fullWidth
                type="date"
                label="Complaint Date"
                name="complaintDate"
                value={values.complaintDate}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.complaintDate && !!errors.complaintDate}
                helperText={touched.complaintDate && errors.complaintDate}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Remark"
                name="remark"
                value={values.remark}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.remark && !!errors.remark}
                helperText={touched.remark && errors.remark}
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={values.description}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update Complaint
              </Button>
            </Box>
          </form>
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

export default UpdateComplaint;
