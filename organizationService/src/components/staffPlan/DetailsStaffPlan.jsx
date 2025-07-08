import { Box, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  staffPlanEndpoint,
  jobGradeEndpoint,
  jobRegistrationsEndpoint,
} from "../../../configuration/organizationApi";
import Header from "../common/Header";


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
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';

const DetailsStaffPlan = () => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const id = location.state.id;


  const [displayData, setDisplayData] = useState(null);

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

        setDisplayData({
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

  const isNonMobile = useMediaQuery("(min-width:600px)");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box m="20px" className="insert-tenant">
      <Header
        title="DETAILS FOR STAFF PLAN"
        subtitle="Details for an existing staff plan profile"
      />

      <Formik initialValues={displayData}>
        {({ values }) => (
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
                value={values.jobTitle}
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
                value={values.quantity}
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default DetailsStaffPlan;
