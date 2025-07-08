import { Box, Button, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import {
  getTenantsEndpoint,
  updateTenantsEndpoint,
  getImgTenantsEndpoint,
} from "../../../configuration/organizationApi";

// import "../../css/globalStyles.css";
import Header from "../common/Header";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

const nonSelectableStyle = {
  border: "none",
  boxShadow: "none",
  WebkitTouchCallout: "none",
  WebkitUserSelect: "none",
  KhtmlUserSelect: "none",
  MozUserSelect: "none",
  MsUserSelect: "none",
  userSelect: "none",
  pointerEvents: "none",
};

const validationSchema = yup.object().shape({
  establishedYear: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .required("required"),
  tenantName: yup.string().required("required"),
  abbreviatedName: yup.string().required("required"),
});

const EditTenant = () => {
  const [authState] = useAtom(authAtom); 
  const navigate = useNavigate();

  const [tenant, setTenant] = useState(null);
  const location = useLocation();
  const id = location.state.id;

  const [logo, setLogo] = useState(null);
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { url, headers } = getTenantsEndpoint(authState.accessToken);
      const response = await axios.get(`${url}/${id}`, { headers });
      setTenant(response.data);
    };

    const fetchImage = async () => {
      const { url, headers } = getImgTenantsEndpoint(authState.accessToken);
      try {
        const response = await axios.get(`${url}/${id}/get-logo`, {
          headers,
          responseType: "blob",
        });
        const imageUrl = URL.createObjectURL(response.data);
        setImageSrc(imageUrl);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchData();
    fetchImage();
  }, [authState, id]);

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      console.log("values", values);

      formData.append(
        "tenant",
        new Blob([JSON.stringify(values)], { type: "application/json" })
      );
      if (logo) {
        formData.append("logo", logo, logo.name);
        formData.append("Content-Type", "multipart/form-data");
      }

      const { url, headers } = updateTenantsEndpoint(authState.accessToken);
      const response = await axios.put(`${url}/${values.id}`, formData, {
        headers,
      });

      if (response.status === 200) {
        console.log("Tenant updated successfully!");
        navigate("/manageteant");
        // window.location.reload();
      } else {
        console.error("Error updating tenant. Status code:", response.status);
      }
    } catch (error) {
      console.error(
        "An error occurred while updating the tenant:",
        error.message
      );
    }
  };

  const isNonMobile = true;
  return tenant ? (
    <Box m="20px" className="edit-tenant">
      <Header
        // title="EDIT TENANT"
        subtitle="Edit an existing tenant profile"
      />

      <Formik
        initialValues={tenant}
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
                sx={{ gridColumn: "span 2" }}
                type="text"
                id="tenantName"
                name="tenantName"
                value={values.tenantName}
                onChange={handleChange}
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

              {/* <TextField
                fullWidth
                type="text"
                label="Prepared By"
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                // InputLabelProps={{
                //   shrink: true, // forces label to stay on the border
                // }}
                onMouseDown={(e) => e.preventDefault()}
                onChange={handleChange}
                value={values.preparedBy}
                name="preparedBy"
                id="preparedBy"
                onBlur={handleBlur}
                error={!!touched.preparedBy && !!errors.preparedBy}
                helperText={touched.preparedBy && errors.preparedBy}
                sx={{ gridColumn: "span 2" }}
              /> */}
             
              <TextField
                id="input-with-icon-textfield"
                fullWidth
                className="file-output transparent-background no-bottom-border"
                variant="standard"
                InputProps={{
                  readOnly: true,
                  style: {
                    height: "500px",
                  },
                }}
                onMouseDown={(e) => e.preventDefault()}
                sx={{
                  backgroundImage: `url(${imageSrc})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  maxWidth: "100%",
                  height: "194px",
                  borderRadius: "5px",
                  border: "1px solid green",
                  gridColumn: isNonMobile ? undefined : "span 1",
                }}
              />
              <TextField
                type="file"
                fullWidth
                // className="file-input"
                label="New Tenant Logo"
                id="logo"
                name="logo"
                InputProps={{
                  style: {
                    height: "100%",
                    lineHeight: "medium",
                  },
                }}
                onChange={handleLogoChange}
                value={values.logo}
                onBlur={handleBlur}
                error={!!touched.logo && !!errors.logo}
                helperText={touched.logo && errors.logo}
                sx={{ gridColumn: "span 1" }}
                InputLabelProps={{
                  shrink: true, // forces label to stay on the border
                }}
              />
            </Box>
         

            <Box display="flex" justifyContent="start" mt="20px" gap ="10px">
            <Button type="submit" color="secondary" variant="contained">
                Update Tenant
              </Button>

              <Button
                variant="contained"
                sx={{ mr: 2 }}
                onClick={() => navigate(`/manageteant`)}
              
              >
                Cancel
              </Button>
            </Box>

          </Form>
        )}
      </Formik>
    </Box>
  ) : null;
};

export default EditTenant;
