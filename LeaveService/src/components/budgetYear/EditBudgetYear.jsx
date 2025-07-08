import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, Form } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { budgetYearEndpoint } from "../../../configuration/LeaveApi";
import Header from "../common/Header";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const EditBudgetYear = () => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const id = location.state.id;

  const [initialValues, setInitialValues] = useState({
    budgetYear: "",
    description: "",
    isActive: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { url, headers } = budgetYearEndpoint(authState.accessToken);
      try {
        const response = await axios.get(`${url}/${tenantId}/get/${id}`, {
          headers,
        });
        const data = response.data;
        console.log("data", data);
        setInitialValues({
          budgetYear: data.budgetYear || "",
          description: data.description || "",
          isActive: data.active === true ? true : false,
        });
        setLoading(false);
      } catch (error) {
        setError("There was an error fetching the holidays!");
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = (values, { setSubmitting }) => {
    const { url, headers } = budgetYearEndpoint(authState.accessToken);

    const data = {
      ...values,
      active: values.isActive ? true : false,
    };

    axios
      .put(`${url}/${tenantId}/update/${id}`, data, { headers })
      .then((response) => {
        console.log(response.data);
        {
          navigate('/add_Leave_Info', { state: { activeTab: 0 } }); //

        }
        setSubmitting(false);
      })
      .catch((error) => {
        setError(error.message);
        setError("There was an error updating the holidays!");
        setSubmitting(false);
      });
  };

  const isNonMobile = useMediaQuery("(min-width:600px)");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box m="20px" className="insert-tenant">
      <Header
        title="EDIT BUDGET YEAR"
        subtitle="Edit an existing budget year profile"
      />

      <Formik
        enableReinitialize
        onSubmit={handleSubmit}
        initialValues={initialValues}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          isSubmitting,
          handleChange,
          setFieldValue,
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
                label="Budget Year Name"
                onBlur={handleBlur}
                error={!!touched.budgetYear && !!errors.budgetYear}
                helperText={touched.budgetYear && errors.budgetYear}
                type="text"
                id="budgetYear"
                name="budgetYear"
                value={values.budgetYear}
                onChange={handleChange}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                label="Budget Year Description"
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
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.isActive}
                      onChange={(event) => {
                        setFieldValue("isActive", event.target.checked);
                      }}
                      name="isActive"
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body1">
                      Active Year
                      {values.isActive && <span> ✔ </span>}
                    </Typography>
                  }
                />
              </FormGroup>
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
              >
                Update Budget Year
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EditBudgetYear;
