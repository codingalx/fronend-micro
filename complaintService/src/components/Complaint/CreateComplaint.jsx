import { useState, useEffect } from "react";
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
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import { addComplaint, getEmployeeByEmployeeId } from "../../Api/ComplaintApi";
import { getAllComplaintTypes } from "../../Api/ComplaintTypeApi";
import Header from "../../common/Header";
import { addComplaintHandling } from "../../Api/ComplaintHandlingApi";
import ListComplaintByEmployee from "./ListComplaintByEmployee";

const CreateComplaint = () => {
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [complaintTypes, setComplaintTypes] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [authState] = useAtom(authAtom);
  const username = authState.username;
  const tenantId = authState.tenantId;
  const [handlingLoading, setHandlingLoading] = useState(false);

  useEffect(() => {
    fetchComplaintTypes();
    fetchEmployeeDetails();
  }, []);

  const fetchComplaintTypes = async () => {
    try {
      const response = await getAllComplaintTypes(tenantId);
      setComplaintTypes(response);
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to fetch complaint types.",
        severity: "error",
      });
    }
  };

  const fetchEmployeeDetails = async () => {
    try {
      const response = await getEmployeeByEmployeeId(tenantId, username);
      const fullName = `${response.firstName} ${response.middleName || ""} ${
        response.lastName
      }`.trim();
      setEmployeeName(fullName);
      setEmployeeId(response.id);
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to fetch employee details.",
        severity: "error",
      });
    }
  };

  const complaintSchema = Yup.object().shape({
    employeeName: Yup.string().required("Employee Name is required"),
    complaintTypeId: Yup.string().required("Complaint Type is required"),
    description: Yup.string().required("Description is required"),
    complaintDate: Yup.date().required("Complaint Date is required"),
    remark: Yup.string(),
    attachments: Yup.mixed()
      .test("fileSize", "Total file size is too large (max 10MB)", (value) => {
        if (!value || value.length === 0) return true;
        const totalSize = Array.from(value).reduce(
          (acc, file) => acc + file.size,
          0
        );
        return totalSize <= 10485760;
      })
      .test("fileType", "Only PDF files are allowed", (value) => {
        if (!value || value.length === 0) return true;
        return Array.from(value).every(
          (file) => file.type === "application/pdf"
        );
      }),
    departmentId: Yup.string().required("Department is required"),
  });

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      // Ensure employeeId is included in the data
      const complaintData = {
        ...values,
        employeeId,
      };

      // Prepare FormData
      const formData = new FormData();
      formData.append(
        "request",
        new Blob([JSON.stringify(complaintData)], { type: "application/json" })
      );

      // Append attachments if present
      if (values.attachments && values.attachments.length > 0) {
        Array.from(values.attachments).forEach((file) => {
          formData.append("attachments", file);
        });
      }

      // Use the updated addComplaint function
      const complaintResponse = await addComplaint(tenantId, formData);

      // 2. Get complaintId from response
      const complaintId = complaintResponse?.data?.id || complaintResponse?.id;

      if (!complaintId) {
        throw new Error("Complaint ID not found in response.");
      }

      setHandlingLoading(true);

      // 3. Create Complaint Handling
      await addComplaintHandling(tenantId, {
        complaintId,
        departmentId: values.departmentId,
      });

      setNotification({
        open: true,
        message: "Complaint and Complaint Handling created successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to create complaint and handling. Please try again.",
        severity: "error",
      });
    } finally {
      setHandlingLoading(false);
    }
  };

  const handleFileChange = (e, setFieldValue) => {
    setFieldValue("attachments", e.target.files);
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  // Fetch departments for the department dropdown
  const [departments, setDepartments] = useState([]);
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { listDepartments } = await import(
          "../../Api/ComplaintHandlingApi"
        );
        const response = await listDepartments(tenantId);
        setDepartments(response.data);
      } catch (error) {
        // Optionally show error
      }
    };
    if (tenantId) fetchDepartments();
  }, [tenantId]);

  return (
    <Box m="20px">
      <Header subtitle="Create Complaint" />
      <Formik
        initialValues={{
          employeeName: employeeName,
          complaintTypeId: "",
          description: "",
          complaintDate: "",
          remark: "",
          attachments: null,
          departmentId: "",
        }}
        validationSchema={complaintSchema}
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
          setFieldValue,
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
                sx={{ gridColumn: "span 2" }}
              />
              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
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
              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel id="department-label">Department</InputLabel>
                <Select
                  labelId="department-label"
                  name="departmentId"
                  value={values.departmentId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.departmentId && !!errors.departmentId}
                  label="Department"
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.departmentName}
                    </MenuItem>
                  ))}
                </Select>
                {touched.departmentId && errors.departmentId && (
                  <Box color="red" fontSize="12px">
                    {errors.departmentId}
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
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description"
                name="description"
                value={values.description}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 2" }}
              />

<Button
  variant="contained"
  component="label"
  color="primary"
  sx={{
    gridColumn: "span 2", // Changed to span 2 columns
    padding: '12px 20px',
    fontSize: '16px',
    borderRadius: '8px',
    height:'70px',
    '&:hover': {
      backgroundColor: 'darkblue', // Change to a darker shade on hover
    },
  }}
>
  Upload Attachments (PDF only, max total 10MB)
  <input
    type="file"
    hidden
    multiple
    accept="application/pdf"
    onChange={(e) => handleFileChange(e, setFieldValue)}
  />
</Button>
            

              <TextField
                fullWidth
                label="Remark"
                name="remark"
                value={values.remark}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.remark && !!errors.remark}
                helperText={touched.remark && errors.remark}
                sx={{ gridColumn: "span 2" }}
              />

              {values.attachments && values.attachments.length > 0 && (
                <Box>
                  <p>
                    Selected Files:{" "}
                    {Array.from(values.attachments)
                      .map((file) => file.name)
                      .join(", ")}
                  </p>
                </Box>
              )}
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={handlingLoading}
              >
                {handlingLoading ? "Creating..." : "Create Complaint"}
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
      {/* Display the list of complaints by employee */}
      <ListComplaintByEmployee refreshKey={refreshKey} />
    </Box>
  );
};

export default CreateComplaint;
