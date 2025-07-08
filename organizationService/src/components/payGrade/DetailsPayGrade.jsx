import { Box, Button, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { payGradeEndpoint, jobGradeEndpoint } from "../../../configuration/organizationApi";
import Header from "../common/Header";
import { useNavigate } from "react-router-dom";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';

const nonSelectableStyle = {
  border: "none",
  background: "transparent",
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

const DetailsPayGrade = () => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const id = location.state.id;
  const navigate = useNavigate();

  /*
  this is for department type and department combine and
  find exact department type and display on the given TextField */
  useEffect(() => {
    const fetchData = async () => {
      const { url: payGradeURL, headers } = payGradeEndpoint(
        authState.accessToken
      );
      const { url: jobGradeURL } = jobGradeEndpoint(authState.accessToken);
      try {
        // Fetch the department details
        const responseDept = await axios.get(
          `${payGradeURL}/${tenantId}/get/${id}`,
          {
            headers,
          }
        );
        const dataDept = responseDept.data;

        // Fetch the department type details using the departmentTypeId from the department details
        const responseDeptType = await axios.get(
          `${jobGradeURL}/${tenantId}/get/${dataDept.jobGradeId}`,
          {
            headers,
          }
        );
        const dataDeptType = responseDeptType.data;

        // Set the tenant state with the department details and the departmentTypeName from the department type details
        setTenant({
          ...dataDept,
          jobGrade: dataDeptType.jobGradeName,
        });
        setLoading(false);
      } catch (error) {
        setError("There was an error fetching the data!");
      }
    };

    fetchData();
  }, [id]);
  /* end */

  const isNonMobile = useMediaQuery("(min-width:600px)");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box m="20px" className="insert-tenant">
      <Header
        title="DETAILS OF PAY GRADE"
        subtitle="Details for an existing pay grade profile"
      />

      <Formik initialValues={tenant}>
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
                label="Job Grade"
                value={values.jobGrade}
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Salary Step"
                value={values.salaryStep}
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Initial Salary"
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                type="number"
                value={values.initialSalary}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Maximum Salary"
                type="number"
                value={values.maximumSalary}
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Salary"
                type="number"
                value={values.salary}
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                label="Job Grade Description"
                multiline
                type="text"
                value={values.description}
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>

            <Box display="flex" justifyContent="start" mt="20px">
              <Button
                variant="contained"
                sx={{ mr: 2 }}
                onClick={() => navigate(`/manage_organization_info`,{ state: { activeTab: 5 } })}
                
              >
                Cancel
              </Button>
            </Box>

          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default DetailsPayGrade;



