import { Box, Button, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import axios from "axios";
import { locationsTypeEndpoint } from "../../../configuration/organizationApi";
import Header from "../common/Header";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import ListLocationType from "./ListLocationType";



const validationSchema = yup.object().shape({
  locationTypeName: yup.string().required("required"),
  description: yup.string().required("required"),
});

const CreateLocationType = () => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;
  const [refreshKey, setRefreshKey] = useState(0);


  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = (values, { setSubmitting,resetForm }) => {
    const { url, headers } = locationsTypeEndpoint(authState.accessToken);

    axios
      .post(`${url}/${tenantId}/add-location-type`, values, { headers })
      .then((response) => {
        console.log(response.data);
        setSuccessMessage(true);
        setSubmitting(false);
        resetForm();
        setRefreshKey(prev => prev + 1); 
      })
      .catch((error) => {
        console.error("There was an error!", error);
        setSubmitting(false);
      });
  };

  const isNonMobile = useMediaQuery("(min-width:600px)");

  return (
    <Box m="20px" className="insert-tenant">
      <Header
        subtitle="Create a new location type profile"
      />

      <Formik
        initialValues={{
          locationTypeName: "",
          description: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          isSubmitting,
          handleChange,
        }) => (
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
                label="Location Type Name"
                onBlur={handleBlur}
                error={!!touched.locationTypeName && !!errors.locationTypeName}
                helperText={touched.locationTypeName && errors.locationTypeName}
                type="text"
                id="locationTypeName"
                name="locationTypeName"
                value={values.locationTypeName}
                onChange={handleChange}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                label="Location Type Description"
                multiline
                rows={5}
                value={values.description}
                onChange={handleChange}
                name="description"
                onBlur={handleBlur}
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
              >
                Create New Location Type
              </Button>
            </Box>

            {successMessage && (
              <span display="flex" className="success-message">
                Location Type is created successfully!
              </span>
            )}
            <ListLocationType  refreshKey ={refreshKey}/>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateLocationType;
