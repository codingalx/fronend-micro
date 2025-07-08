import { Box, Button, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import axios from "axios";
import { addTenantsEndpoint } from "../../../configuration/organizationApi";
import Header from "../common/Header";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


// Validation schema
const validationSchema = yup.object().shape({
  establishedYear: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .required("required"),
  tenantName: yup.string().required("required"),
  abbreviatedName: yup.string().required("required"),
});

const CreateTenant = () => {
  const [authState] = useAtom(authAtom); 

  if (!authState || !authState.accessToken) {
    console.error("authState or accessToken is undefined.");
    return <p>Error: Authorization details are missing.</p>;
  }

  const date = new Date();

  const toDateInputValue = (dateObject) => {
    const local = new Date(dateObject);
    local.setMinutes(dateObject.getMinutes() - dateObject.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
  };

  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null); // State for image preview
  const [successMessage, setSuccessMessage] = useState(false);
  const [existedMessage, setExistedMessage] = useState(false);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogo(file);

    // Generate preview URL
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      formData.append(
        "tenant",
        new Blob([JSON.stringify(values)], { type: "application/json" })
      );

      if (logo) {
        formData.append("logo", logo, logo.name);
      }

      const { url, headers } = addTenantsEndpoint(authState.accessToken);
      const response = await axios.post(url, formData, { headers });

      if (response.status === 201) {
        console.log("Tenant created successfully!");
        setExistedMessage(false);
        resetForm();
        setLogo(null);
        setLogoPreview(null); // Reset image preview
        setSuccessMessage(true);
      } else {
        console.error("Error creating tenant. Status code:", response.status);
      }
    } catch (error) {
      console.error(
        "An error occurred while creating the tenant:",
        error.message
      );

      if (error.response) {
        if (error.response.status === 500 || error.response.status === 400) {
          console.error("An internal server error occurred. Tenant existed.");
          setExistedMessage(true);
        }
      } else {
        console.error("The error response is undefined.");
      }
    }
  };

  const isNonMobile = useMediaQuery("(min-width:600px)");

  return (
    <Box m="20px" height="75vh" className="insert-tenant">
      <Header subtitle="Create a new tenant " />

      <Formik
        initialValues={{
          tenantName: "",
          abbreviatedName: "",
          establishedYear: toDateInputValue(date),
          logo: null,
          description: "",
          preparedBy: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleBlur, handleChange }) => (
          <Form>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 0" },
              }}
              className="form-group"
            >
              <TextField
                fullWidth
                label="Tenant Name"
                onBlur={handleBlur}
                error={!!touched.tenantName && !!errors.tenantName}
                helperText={touched.tenantName && errors.tenantName}
                type="text"
                id="tenantName"
                name="tenantName"
                value={values.tenantName}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Abbreviated Name"
                onBlur={handleBlur}
                error={!!touched.abbreviatedName && !!errors.abbreviatedName}
                helperText={touched.abbreviatedName && errors.abbreviatedName}
                sx={{ gridColumn: "span 2" }}
                type="text"
                id="abbreviatedName"
                name="abbreviatedName"
                value={values.abbreviatedName}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Established Year"
                onBlur={handleBlur}
                error={!!touched.establishedYear && !!errors.establishedYear}
                helperText={touched.establishedYear && errors.establishedYear}
                sx={{ gridColumn: "span 2" }}
                type="date"
                id="establishedYear"
                name="establishedYear"
                value={values.establishedYear}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                type="file"
                id="logo"
                name="logo"
                onChange={handleLogoChange}
                onBlur={handleBlur}
                error={!!touched.logo && !!errors.logo}
                helperText={touched.logo && errors.logo}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ gridColumn: "span 2" }}
                required
                label="Tenant Logo"
              />
              {logoPreview && (
                <Box sx={{ gridColumn: "span 4", textAlign: "center" }}>
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />
                </Box>
              )}
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Tenant
              </Button>
            </Box>
            {successMessage && (
              <span display="flex" className="success-message">
                Tenant created successfully!
              </span>
            )}
            {existedMessage && (
              <span display="flex" className="success-message">
                Tenant already existed, try a different name!
              </span>
            )}
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateTenant;
