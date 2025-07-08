import {
  Alert,
  Box,
  Button,
  Snackbar,
  TextField,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { createReference } from "../../Api/employeeApi";
import ListReference from "./ListReference";
import { useState } from "react";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import NotFoundHandle from "../common/NotFoundHandle";







const CreateReference = ({ id }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const employerId = id;

   const [authState] = useAtom(authAtom); // Access the shared authentication state
    const tenantId = authState.tenantId


     const [refreshKey, setRefreshKey] = useState(0);
  
      const handleCloseSnackbar = () => {
        setNotification({ ...notification, open: false });
      };
     const [notification, setNotification] = useState({
       open: false,
       message: "",
       severity: "success",
     });
 


  const handleFormSubmit = async (values,{resetForm}) => {
    try {
      console.log("Form data:", values);
      await createReference(tenantId,employerId, values); 
      setNotification({
        open: true,
        message: "Reference created successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey(prev => prev + 1); 

    } catch (error) {
      console.error("Failed to submit form data:", error);
    }
  };

  const initialValues = {
    fullName: "",
    workAddress: "",
    email: "",
    phoneNumber: "",
    description: "",
    jobTitle: "",
  };

  const checkoutSchema = yup.object().shape({
    fullName: yup.string().required("Full name cannot be blank"),
    workAddress: yup.string().required("Work address cannot be blank"),
    email: yup.string().email("Invalid email address").required("Email cannot be blank"),
    phoneNumber: yup.string().matches(/^\d{10}$/, "Invalid phone number").required("Phone number cannot be blank"),
    description: yup.string(),
    jobTitle: yup.string().required("Job title cannot be blank"),
  });

  if (!id) {
    return <NotFoundHandle message="No employee  selected for creation of Refernce." navigateTo="/employee/list" />;
  }

  return (
    <Box m="20px">
     
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
                label="Full Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fullName}
                name="fullName"
                error={!!touched.fullName && !!errors.fullName}
                helperText={touched.fullName && errors.fullName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Work Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.workAddress}
                name="workAddress"
                error={!!touched.workAddress && !!errors.workAddress}
                helperText={touched.workAddress && errors.workAddress}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Phone Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phoneNumber}
                name="phoneNumber"
                error={!!touched.phoneNumber && !!errors.phoneNumber}
                helperText={touched.phoneNumber && errors.phoneNumber}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Job Title"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.jobTitle}
                name="jobTitle"
                error={!!touched.jobTitle && !!errors.jobTitle}
                helperText={touched.jobTitle && errors.jobTitle}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Reference
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      <Snackbar
              open={notification.open}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
                {notification.message}
              </Alert>
            </Snackbar>
            
      <ListReference employerId={employerId} refreshKey={refreshKey} />

    </Box>
  );
};

export default CreateReference;
