import { Box, TextField,Button } from "@mui/material";
import { Formik, Form } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { locationsEndpoint, locationsTypeEndpoint } from "../../../configuration/organizationApi";
import Header from "../common/Header";
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

const DetailsLocation = () => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state.id;

  useEffect(() => {
    const fetchData = async () => {
      const { url: lurl, headers } = locationsEndpoint(authState.accessToken);
      const { url: lturl } = locationsTypeEndpoint(authState.accessToken);
      try {
        // Fetch the department details
        const responseDept = await axios.get(`${lurl}/${tenantId}/get/${id}`, {
          headers,
        });
        const dataDept = responseDept.data;

        // Fetch the department type details using the locationTypeId from the department details
        const responseDeptType = await axios.get(
          `${lturl}/${tenantId}/get/${dataDept.locationTypeId}`,
          {
            headers,
          }
        );
        const dataDeptType = responseDeptType.data;

        // Set the tenant state with the department details and the locationTypeName from the department type details
        setTenant({
          ...dataDept,
          departmentType: dataDeptType.locationTypeName,
        });
        setLoading(false);
      } catch (error) {
        setError("There was an error fetching the data!");
      }
    };

    fetchData();
  }, [id]);

  const isNonMobile = useMediaQuery("(min-width:600px)");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box m="20px" className="insert-tenant">
      <Header
        title="DETAILS OF LOCATION"
        subtitle="Details for an existing location profile"
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
                fullWidth
                label="Department Name"
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                type="text"
                id="locationName"
                name="locationName"
                value={values.locationName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                name="departmentType"
                label="Department Type"
                value={values.departmentType}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>

            
            <Box display="flex" justifyContent="start" mt="20px">
              <Button
                variant="contained"
                sx={{ mr: 2 }}
                onClick={() => navigate(`/manage_organization_info`,{ state: { activeTab: 7 } })}
                
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

export default DetailsLocation;
