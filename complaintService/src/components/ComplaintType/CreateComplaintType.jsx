import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Snackbar, Alert } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import { addComplaintType } from "../../Api/ComplaintTypeApi";
import Header from "../../common/Header";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import ListComplaintType from "./ListComplaintType";

const CreateComplaintType = () => {
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [nameError, setNameError] = useState(""); // For duplicate name error

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
  });

  const handleFormSubmit = async (values, { resetForm }) => {
    setNameError("");
    try {
      await addComplaintType(tenantId, values);
      setNotification({
        open: true,
        message: "Complaint type created successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      // Check for 409 Conflict error (duplicate name)
      if (
        error?.response?.status === 409 &&
        error?.response?.data &&
        typeof error.response.data === "string" &&
        error.response.data.includes("already exists")
      ) {
        setNameError("A complaint type with this name already exists.");
        setNotification({
          open: true,
          message: "A complaint type with this name already exists.",
          severity: "error",
        });
      } else {
        setNotification({
          open: true,
          message: "Failed to create complaint type. Please try again.",
          severity: "error",
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box m="20px">
      <Header subtitle="Create Complaint Type" />
      <Formik
        initialValues={{ name: "", description: "" }}
        validationSchema={validationSchema}
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
                label="Name"
                name="name"
                value={values.name}
                onBlur={handleBlur}
                onChange={(e) => {
                  setNameError("");
                  handleChange(e);
                }}
                error={!!touched.name && (!!errors.name || !!nameError)}
                helperText={touched.name && (errors.name || nameError)}
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
                Create Complaint Type
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

      {/* Display the list of complaint types */}
      <ListComplaintType refreshKey={refreshKey} />
    </Box>
  );
};

export default CreateComplaintType;
