import { Box, Button, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { holidayEndpoint } from "../../../configuration/LeaveApi";
import Header from "../common/Header";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const EditHoliday = () => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [holidays, setHolidays] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const id = location.state.id;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { url, headers } = holidayEndpoint(authState.accessToken);
      try {
        const response = await axios.get(`${url}/${tenantId}/get/${id}`, {
          headers,
        });
        const data = response.data;
        setHolidays({
          ...data,
        });
        setLoading(false);
      } catch (error) {
        setError("There was an error fetching the holidays!");
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = (values, { setSubmitting }) => {
    const { url, headers } = holidayEndpoint(authState.accessToken);

    const data = {
      ...values,
    };

    axios
      .put(`${url}/${tenantId}/update/${id}`, data, { headers })
      .then((response) => {
        console.log(response.data);
        {
          navigate('/add_Leave_Info', { state: { activeTab: 1 } }); //

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
        title="EDIT HOLIDAY TYPE"
        subtitle="Edit an existing holiday profile"
      />

      <Formik initialValues={holidays} onSubmit={handleSubmit}>
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
                label="Holiday Name"
                onBlur={handleBlur}
                error={!!touched.holidayName && !!errors.holidayName}
                helperText={touched.holidayName && errors.holidayName}
                type="text"
                id="holidayName"
                name="holidayName"
                value={values.holidayName}
                onChange={handleChange}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                label="Holiday Description"
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
                Update Holiday
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EditHoliday;
