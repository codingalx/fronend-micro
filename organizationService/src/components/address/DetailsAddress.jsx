import { Box, Button, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { locationsEndpoint, addressEndpoint  } from "../../../configuration/organizationApi";
import Header from "../common/Header";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

const DetailsAddress = () => {
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
      const { url: aurl, headers } = addressEndpoint(authState.accessToken);
      const { url: lurl } = locationsEndpoint(authState.accessToken);
      try {
        const response = await axios.get(`${aurl}/${tenantId}/get/${id}`, {
          headers,
        });
        const data = response.data;

        const locationNameResponse = await axios.get(
          `${lurl}/${tenantId}/get/${data.locationId}`,
          {
            headers,
          }
        );

        const locationNames = locationNameResponse.data;
        setTenant({
          ...data,
          locationName: locationNames.locationName,
        });
        setLoading(false);
      } catch (error) {
        setError("There was an error fetching the address!");
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
        title="DETAILS OF ADDRESS"
        subtitle="Details an existing address profile"
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
                label="Address"
                InputProps={{
                  readOnly: true,
                }}
                onMouseDown={(e) => e.preventDefault()}
                value={values.locationName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Block Number"
                InputProps={{
                  readOnly: true,
                }}
                onMouseDown={(e) => e.preventDefault()}
                value={values.blockNo}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="House No."
                InputProps={{
                  readOnly: true,
                }}
                onMouseDown={(e) => e.preventDefault()}
                value={values.houseNumber}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Floor Number"
                InputProps={{
                  readOnly: true,
                }}
                onMouseDown={(e) => e.preventDefault()}
                value={values.floor}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Office Room Number"
                InputProps={{
                  readOnly: true,
                }}
                onMouseDown={(e) => e.preventDefault()}
                value={values.officeNumber}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Office Tel. Number"
                InputProps={{
                  readOnly: true,
                }}
                onMouseDown={(e) => e.preventDefault()}
                value={values.officeTelephone}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Mobile Number"
                InputProps={{
                  readOnly: true,
                }}
                onMouseDown={(e) => e.preventDefault()}
                value={values.mobileNumber}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Email Address"
                InputProps={{
                  readOnly: true,
                }}
                onMouseDown={(e) => e.preventDefault()}
                value={values.email}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                label="Website"
                InputProps={{
                  readOnly: true,
                }}
                onMouseDown={(e) => e.preventDefault()}
                value={values.website}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="P.O.Box Number"
                InputProps={{
                  readOnly: true,
                }}
                onMouseDown={(e) => e.preventDefault()}
                value={values.poBox}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button
                variant="contained"
                sx={{ mr: 2 }}
                onClick={() => navigate(`/manage_organization`,{ state: { activeTab: 3,id } })}
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

export default DetailsAddress;


