import { Box, Button, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  staffPlanEndpoint,
  jobGradeEndpoint,
  jobRegistrationsEndpoint,
} from "../../../configuration/organizationApi";
import Header from "../common/Header";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';

const validationSchema = yup.object().shape({
  quantity: yup.string().required("required"),
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

const EditStaffPlan = () => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const id = location.state.id;

  const navigate = useNavigate();

  // the following is best senario for edit purpose for nested api, speciall three api data fetch like the following from staff to job register then to job grade
  const [editData, setEditData] = useState({
    jobTitle: "",
    jobCode: "",
    jobGradeName: "",
    quantity: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const { url: SPURL, headers } = staffPlanEndpoint(authState.accessToken);
      try {
        const staffPlanResponse = await axios.get(
          `${SPURL}/${tenantId}/get/${id}`,
          {
            headers,
          }
        );
        const staffPlan = staffPlanResponse.data;

        const { url: JRURL } = jobRegistrationsEndpoint(authState.accessToken);

        // Assuming staffPlan contains jobRegistrationId and other details

        const jobRegistrationResponse = await axios.get(
          `${JRURL}/${tenantId}/get/${staffPlan.jobRegistrationId}`,
          { headers }
        );

        const jobRegistration = jobRegistrationResponse.data;
        const { url: JGURL } = jobGradeEndpoint(tenantId);
        const jobGradeResponse = await axios.get(
          `${JGURL}/${tenantId}/get/${jobRegistration.jobGradeId}`,
          { headers }
        );
        const jobGrade = jobGradeResponse.data;

        // Set the editData state with the fetched data
        setEditData({
          ...staffPlan,
          jobTitle: jobRegistration.jobTitle,
          jobCode: jobRegistration.jobCode,
          jobGradeName: jobGrade.jobGradeName,
        });
        setLoading(false);
      } catch (error) {
        setError(error.message);
        console.log(error.message);
      }
    };

    fetchData();
  }, [id]); // Add id as a dependency to refetch when it changes

  const handleSubmit = (values, { setSubmitting }) => {
    const { url, headers } = staffPlanEndpoint(authState.accessToken);

    const data = {
      ...values,
    };

    axios
      .put(`${url}/${tenantId}/update-staff-plan/${id}`, data, { headers })
      .then((response) => {
        {
          navigate('/manage_organization', { state: { activeTab: 3 ,id} }); //

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
        title="EDIT STAFF PLAN"
        subtitle="Edit an existing staff plan profile"
      />

      <Formik
        initialValues={editData}
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
                type="text"
                label="Job Title"
                value={values.jobTitle}
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Job Code"
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                value={values.jobCode}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                label="Job Grade"
                value={values.jobGradeName}
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Quantity"
                onBlur={handleBlur}
                error={!!touched.quantity && !!errors.quantity}
                helperText={touched.quantity && errors.quantity}
                type="number"
                id="quantity"
                name="quantity"
                value={values.quantity}
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
                Update Staff Plan
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EditStaffPlan;
