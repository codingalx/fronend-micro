import { Box, Button, MenuItem, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../common/Header";
import {   departmentTypesEndpoint,
  departmentEndpoint, } from "../../../configuration/organizationApi";
  import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 



const nonSelectableStyle = {
  border: "none",
  boxShadow: "none",
  WebkitTouchCallout: "none" /* iOS Safari */,
  WebkitUserSelect: "none" /* Safari */,
  KhtmlUserSelect: "none" /* Konqueror HTML */,
  MozUserSelect: "none" /* Old versions of Firefox */,
  MsUserSelect: "none" /* Internet Explorer/Edge */,
  userSelect:
    "none" /* Non-prefixed version, currently supported by Chrome, Opera and Firefox */,
  pointerEvents: "none" /* Disabling pointer events to prevent focus */,
};

const validationSchema = yup.object().shape({
  establishedDate: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .required("required"),
  departmentName: yup.string().required("required"),
});

const EditDepartment = () => {
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;



  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const id = location.state.id;
  const [departmentTypes, setDepartmentTypes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const { url, headers } = departmentTypesEndpoint(authState.accessToken);
    axios
      .get(`${url}/${tenantId}/get-all`, { headers })
      .then((response) => {
        setDepartmentTypes(response.data);
      })
      .catch((error) => {
        setError(error.message);
        setError("There was an error fetching department types!");
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { url, headers } = departmentEndpoint(authState.accessToken);
      try {
        const response = await axios.get(`${url}/${tenantId}/get/${id}`, {
          headers,
        });
        const data = response.data;
        setTenant({ ...data, departmentType: data.departmentTypeId });
        setLoading(false);
      } catch (error) {
        setError("There was an error fetching the department!");
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = (values, { setSubmitting }) => {
    const { url, headers } = departmentEndpoint(authState.accessToken);

    const data = {
      ...values,
      departmentTypeId: values.departmentType,
    };

    axios
      .put(`${url}/${tenantId}/update/${id}`, data, { headers })
      .then((response) => {
        console.log(response.data);
        {
          navigate('/manage_organization_info', { state: { activeTab: 9 } }); 
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
        subtitle="Edit an existing department profile"
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
                error={!!touched.departmentName && !!errors.departmentName}
                helperText={touched.departmentName && errors.departmentName}
                type="text"
                id="departmentName"
                name="departmentName"
                value={values.departmentName}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                select
                name="departmentType"
                label="Department Type"
                value={values.departmentType}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              >
                {departmentTypes.map((type, index) => (
                  <MenuItem key={index} value={type.id}>
                    {type.departmentTypeName}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Established Date"
                onBlur={handleBlur}
                error={!!touched.establishedDate && !!errors.establishedDate}
                helperText={touched.establishedDate && errors.establishedDate}
                sx={{ gridColumn: "span 2" }}
                type="date"
                id="establishedDate"
                name="establishedDate"
                value={values.establishedDate}
                onChange={handleChange}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
              >
                Update Department
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EditDepartment;
