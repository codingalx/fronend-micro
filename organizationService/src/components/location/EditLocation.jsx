import { Box, Button, MenuItem, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { locationsEndpoint, locationsTypeEndpoint } from "../../../configuration/organizationApi";
import Header from "../common/Header";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const validationSchema = yup.object().shape({
  locationName: yup.string().required("required"),
});

const EditLocation = () => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const id = location.state.id;
  const [locationTypes, setLocationTypes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const { url, headers } = locationsTypeEndpoint(authState.accessToken);
    axios
      .get(`${url}/${tenantId}/get-all`, { headers })
      .then((response) => {
        setLocationTypes(response.data);
      })
      .catch((error) => {
        setError(error.message);
        setError("There was an error fetching department types!");
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { url, headers } = locationsEndpoint(authState.accessToken);
      try {
        const response = await axios.get(`${url}/${tenantId}/get/${id}`, {
          headers,
        });
        const data = response.data;
        setTenant({ ...data, locationType: data.locationTypeId });
        setLoading(false);
      } catch (error) {
        setError("There was an error fetching the department!");
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = (values, { setSubmitting }) => {
    const { url, headers } = locationsEndpoint(authState.accessToken);

    const data = {
      ...values,
      locationTypeId: values.locationType,
    };

    axios
      .put(`${url}/${tenantId}/update-location/${id}`, data, { headers })
      .then((response) => {
        console.log(response.data);
        {
          navigate('/manage_organization_info', { state: { activeTab: 7} }); //
        }
        setSubmitting(false);
      })
      .catch((error) => {
        setError(error.message);
        setError("There was an error updating the department!");
        setSubmitting(false);
      });
  };

  const isNonMobile = useMediaQuery("(min-width:600px)");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box m="20px" className="insert-tenant">
      <Header
        subtitle="Edit an existing location profile"
      />

      <Formik
        initialValues={tenant}
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
                label="Department Name"
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
                label="Department Type"
                value={values.locationType}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              >
                {locationTypes.map((type, index) => (
                  <MenuItem key={index} value={type.id}>
                    {type.locationTypeName}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
              >
                Update Location
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EditLocation;
