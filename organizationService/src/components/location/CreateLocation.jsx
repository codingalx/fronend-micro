import { Box, Button, MenuItem, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import SelectedKeyContext from "../department/SelectedKeyContext";
import { locationsEndpoint, locationsTypeEndpoint } from "../../../configuration/organizationApi";
import Header from "../common/Header";
import ListLocation from "./ListLocation";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 



const validationSchema = yup.object().shape({
  locationName: yup.string().required("required"),
  locationType: yup
    .string()
    .required("Please select an option from the dropdown menu."),
});

const CreateLocation = () => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;
  const { selectedKey, setSelectedKey } = useContext(SelectedKeyContext);
  const [localSelectedKey, setLocalSelectedKey] = useState(selectedKey);
  const [locationTypes, setlocationTypes] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);


  const handleSelect = (key) => {
    setSelectedKey(key); 
    setLocalSelectedKey(key);
  };

  useEffect(() => {
    const { url, headers } = locationsTypeEndpoint(authState.accessToken);
    axios
      .get(`${url}/${tenantId}/get-all`, { headers })
      .then((response) => {
        

        if (Array.isArray(response.data)) {
       
        setlocationTypes(response.data);

      } else {
        setlocationTypes([]);
        console.error("Expected an array but got:", response.data);
      }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, [selectedKey]);

  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = (values, { setSubmitting,resetForm }) => {
    const { url, headers } = locationsEndpoint(authState.accessToken);

    const data = {
      ...values,
      locationTypeId: values.locationType,
    };

    const endpoint = localSelectedKey
      ? `${url}/${tenantId}/${localSelectedKey}/sub-locations`
      : `${url}/${tenantId}/add-location`;

    axios
      .post(endpoint, data, { headers })
      .then((response) => {
        console.log(response.data);
        setSuccessMessage(true);
        setSubmitting(false);
        setSelectedKey(null);
        setLocalSelectedKey(null); // Reset local state
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
        subtitle="Create a new location profile"
      />

      <Formik
        initialValues={{
          locationName: "",
          locationType: "",
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
                label="Location Name"
                onBlur={handleBlur}
                error={!!touched.locationName && !!errors.locationName}
                helperText={touched.locationName && errors.locationName}
                type="text"
                id="locationName"
                name="locationName"
                value={values.locationName}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                select
                name="locationType"
                label="Location Type"
                value={values.locationType}
                onChange={handleChange}
                error={!!touched.locationType && !!errors.locationType}
                helperText={touched.locationType && errors.locationType}
                sx={{ gridColumn: "span 2" }}
              >
                {locationTypes.map((type, index) => (
                  <MenuItem key={index} value={type.id}>
                    {type.locationTypeName}
                  </MenuItem>
                ))}
              </TextField>



  
            </Box>
            <Box display="start" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
              >
                Create New Location
              </Button>
            </Box>

            {successMessage && (
              <span display="flex" className="success-message">
                Location created successfully!
              </span>
            )}
          <ListLocation refreshKey ={refreshKey} />
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateLocation;
