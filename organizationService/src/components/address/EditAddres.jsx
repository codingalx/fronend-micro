import { Box, Button, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { addressEndpoint, locationsEndpoint } from "../../../configuration/organizationApi";
import Header from "../common/Header";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const validationSchema = yup.object().shape({
  locationName: yup.string().required("required"),
});

const EditAddres = () => {
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const id = location.state.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { url: aurl, headers: headers } = addressEndpoint(
        authState.accessToken
      );

      const { url: lurl } = locationsEndpoint(authState.accessToken);

      try {
        const response = await axios.get(`${aurl}/${tenantId}/get/${id}`, {
          headers,
        });
        const data = response.data;

        const locationNameResponse = await axios.get(
          `${lurl}/${tenantId}/get/${data.locationId}`,
          {
            headers,
          }
        );

        const locationNames = locationNameResponse.data;
        setTenant({
          ...data,
          locationName: locationNames.locationName,
        });
        setLoading(false);
      } catch (error) {
        setError("There was an error fetching the address!");
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = (values, { setSubmitting }) => {
    const { url, headers } = addressEndpoint(authState.accessToken);

    const data = {
      ...values,
    };

    axios
      .put(`${url}/${tenantId}/edit-address/${id}`, data, { headers })
      .then((response) => {
        console.log(response.data);
        {
          navigate('/manage_organization', { state: { activeTab: 4 ,id } }); //

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
        title="EDIT ADDRESS"
        subtitle="Edit an existing address profile"
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
                label="Address"
                InputProps={{
                  readOnly: true,
                }}
                onMouseDown={(e) => e.preventDefault()}
                type="text"
                id="locationName"
                name="locationName"
                value={values.locationName}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Block Number"
                onBlur={handleBlur}
                error={!!touched.blockNo && !!errors.blockNo}
                helperText={touched.blockNo && errors.blockNo}
                type="text"
                id="blockNo"
                name="blockNo"
                value={values.blockNo}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="House No."
                onBlur={handleBlur}
                error={!!touched.houseNumber && !!errors.houseNumber}
                helperText={touched.houseNumber && errors.houseNumber}
                type="text"
                id="houseNumber"
                name="houseNumber"
                value={values.houseNumber}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Floor Number"
                onBlur={handleBlur}
                error={!!touched.floor && !!errors.floor}
                helperText={touched.floor && errors.floor}
                type="text"
                id="floor"
                name="floor"
                value={values.floor}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Office Room Number"
                onBlur={handleBlur}
                error={!!touched.officeNumber && !!errors.officeNumber}
                helperText={touched.officeNumber && errors.officeNumber}
                type="text"
                id="officeNumber"
                name="officeNumber"
                value={values.officeNumber}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Office Tel. Number"
                onBlur={handleBlur}
                error={!!touched.officeTelephone && !!errors.officeTelephone}
                helperText={touched.officeTelephone && errors.officeTelephone}
                type="text"
                id="officeTelephone"
                name="officeTelephone"
                value={values.officeTelephone}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Mobile Number"
                onBlur={handleBlur}
                error={!!touched.mobileNumber && !!errors.mobileNumber}
                helperText={touched.mobileNumber && errors.mobileNumber}
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                value={values.mobileNumber}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Email Address"
                onBlur={handleBlur}
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                type="text"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                label="Website"
                onBlur={handleBlur}
                error={!!touched.website && !!errors.website}
                helperText={touched.website && errors.website}
                type="text"
                id="website"
                name="website"
                value={values.website}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="P.O.Box Number"
                onBlur={handleBlur}
                error={!!touched.poBox && !!errors.poBox}
                helperText={touched.poBox && errors.poBox}
                type="text"
                id="poBox"
                name="poBox"
                value={values.poBox}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
              >
                Update Address
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EditAddres;
