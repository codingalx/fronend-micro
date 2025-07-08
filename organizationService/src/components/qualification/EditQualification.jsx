import { Box, Button, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { qualificationEndpoint } from "../../../configuration/organizationApi";
import Header from "../common/Header";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';


const EditQualification = () => {
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
      const { url, headers } = qualificationEndpoint(authState.accessToken);
      try {
        const response = await axios.get(`${url}/${tenantId}/get/${id}`, {
          headers,
        });
        const data = response.data;
        setTenant({ ...data, departmentType: data.departmentTypeId });
        setLoading(false);
      } catch (error) {
        setError("There was an error fetching the educational level!");
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = (values, { setSubmitting }) => {
    const { url, headers } = qualificationEndpoint(authState.accessToken);

    const data = {
      ...values,
      departmentTypeId: values.departmentType,
    };

    axios
      .put(`${url}/${tenantId}/update/${id}`, data, { headers })
      .then((response) => {
        console.log(response.data);
        {
          navigate('/manage_organization_info', { state: { activeTab: 4 } }); //
        }
        setSubmitting(false);
      })
      .catch((error) => {
        setError(error.message);
        setError("There was an error updating the qualification!");
        setSubmitting(false);
      });
  };

  const isNonMobile = useMediaQuery("(min-width:600px)");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box m="20px" className="insert-tenant">
      <Header
        subtitle="Edit an existing qualification profile"
      />

      <Formik initialValues={tenant} onSubmit={handleSubmit}>
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
                label="Qualification Name"
                onBlur={handleBlur}
                error={!!touched.qualification && !!errors.qualification}
                helperText={touched.qualification && errors.qualification}
                type="text"
                id="qualification"
                name="qualification"
                value={values.qualification}
                onChange={handleChange}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                label="Qualification Description"
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
                Update Qualification
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EditQualification;
