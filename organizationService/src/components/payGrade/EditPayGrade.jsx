import { Box, Button, MenuItem, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { jobGradeEndpoint, payGradeEndpoint } from "../../../configuration/organizationApi";
import Header from "../common/Header";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';


const validationSchema = yup.object().shape({
  jobGrade: yup
    .string()
    .required("Please select an option from the dropdown menu."),
  salaryStep: yup
    .string()
    .required("Please select an option from the dropdown menu."),
  initialSalary: yup.string().required("required"),
  maximumSalary: yup.string().required("required"),
  salary: yup.string().required("required"),
  description: yup.string().required("required"),
});

// the following is used for view only on the TextField, to look more beautiful
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

const EditPayGrade = () => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const id = location.state.id;

  // after update redirect to the list all component
  const navigate = useNavigate();
  const [jobGrades, setJobGrades] = useState([]);

  useEffect(() => {
    const { url, headers } = jobGradeEndpoint(authState.accessToken);
    axios
      .get(`${url}/${tenantId}/get-all`, { headers })
      .then((response) => {
        setJobGrades(response.data);
      })
      .catch((error) => {
        setError(error.message);
        setError("There was an error fetching department types!");
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { url, headers } = payGradeEndpoint(authState.accessToken);
      try {
        const response = await axios.get(`${url}/${tenantId}/get/${id}`, {
          headers: headers,
        });
        const data = response.data;
        setTenant({ ...data, jobGrade: data.jobGradeId });
        setLoading(false);
      } catch (error) {
        setError("There was an error fetching the department!");
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = (values, { setSubmitting }) => {
    const { url, headers } = payGradeEndpoint(authState.accessToken);

    const data = {
      ...values,
      jobGradeId: values.jobGrade,
    };

    axios
      .put(`${url}/${tenantId}/update-pay-grade/${id}`, data, { headers })
      .then((response) => {
        console.log(response.data);
        {
          navigate('/manage_organization_info', { state: { activeTab: 5 } }); //

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
        subtitle="Edit an existing pay grade profile"
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
                select
                name="jobGrade"
                label="Job Grade"
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                value={values.jobGrade}
                sx={{ gridColumn: "span 2" }}
              >
                {/* here the key for displaying the department type form another API display on the select */}
                {jobGrades.map((type, index) => (
                  <MenuItem key={index} value={type.id}>
                    {type.jobGradeName}
                  </MenuItem>
                ))}
              </TextField>
              
              <TextField
                select
                name="salaryStep"
                label="Salary Step"
                value={values.salaryStep}
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                sx={{ gridColumn: "span 2" }}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={9}>9</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Initial Salary"
                onBlur={handleBlur}
                error={!!touched.initialSalary && !!errors.initialSalary}
                helperText={touched.initialSalary && errors.initialSalary}
                type="number"
                id="initialSalary"
                name="initialSalary"
                value={values.initialSalary}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Maximum Salary"
                onBlur={handleBlur}
                error={!!touched.maximumSalary && !!errors.maximumSalary}
                helperText={touched.maximumSalary && errors.maximumSalary}
                type="number"
                id="maximumSalary"
                name="maximumSalary"
                value={values.maximumSalary}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Salary"
                onBlur={handleBlur}
                error={!!touched.salary && !!errors.salary}
                helperText={touched.salary && errors.salary}
                type="number"
                id="salary"
                name="salary"
                value={values.salary}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                label="Job Grade Description"
                multiline
                type="text"
                value={values.description}
                onChange={handleChange}
                id="description"
                name="description"
                onBlur={handleBlur}
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
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
                Update Pay Grade
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EditPayGrade;
