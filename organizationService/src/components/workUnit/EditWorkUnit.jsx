import { Box, Button, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { workUnitEndpoint } from "../../../configuration/organizationApi";
import Header from "../common/Header";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import NotFoundHandle from "../common/NotFoundHandle";


const EditWorkUnit = () => {
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
      const { url, headers } = workUnitEndpoint(authState.accessToken);
      try {
        const response = await axios.get(`${url}/${tenantId}/get/${id}`, {
          headers: headers,
        });
        const data = response.data;
        setTenant({ ...data, departmentType: data.departmentTypeId });
        setLoading(false);
      } catch (error) {
        setError("There was an error fetching the job grade!");
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = (values, { setSubmitting }) => {
    const { url, headers } = workUnitEndpoint(authState.accessToken);

    const data = {
      ...values,
      departmentTypeId: values.departmentType,
    };

    axios
      .put(`${url}/${tenantId}/update/${id}`, data, { headers })
      .then((response) => {
        console.log(response.data);
        // You can display a success message or redirect to another page
        {
          // After updating, redirect to the ListAll component
          navigate('/manage_organization_info', { state: { activeTab: 2 } }); //
        }
        setSubmitting(false);
      })
      .catch((error) => {
        setError(error.message);
        setError("There was an error updating the work unit!");
        setSubmitting(false);
      });
  };

  const isNonMobile = useMediaQuery("(min-width:600px)");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (!id) {
    return <NotFoundHandle message="No work unit selected for updation." navigateTo="/manage_organization_info" />;
  }


  return (
    <Box m="20px" className="insert-tenant">
      <Header
        subtitle="Edit an existing work unit profile"
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
                label="Job Category Name"
                onBlur={handleBlur}
                error={!!touched.workUnitName && !!errors.workUnitName}
                helperText={touched.workUnitName && errors.workUnitName}
                type="text"
                id="workUnitName"
                name="workUnitName"
                value={values.workUnitName}
                onChange={handleChange}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                label="Job Category Description"
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
                Update Job Category
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EditWorkUnit;
