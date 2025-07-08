import { Box, TextField,Button } from "@mui/material";
import { Formik, Form } from "formik";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { getTenantsEndpoint, getImgTenantsEndpoint } from "../../../configuration/organizationApi";
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

const DetailsTenant = () => {
  const [authState] = useAtom(authAtom); 
  const [tenant, setTenant] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const id = location.state.id;
  const [imageSrc, setImageSrc] = useState("");
  

  useEffect(() => {
    const fetchData = async () => {
      const { url, headers } = getTenantsEndpoint(authState.accessToken);
      const response = await axios.get(`${url}/${id}`, { headers });
      setTenant(response.data);
    };

    const fetchImage = async () => {
      const { url, headers } = getImgTenantsEndpoint(authState.accessToken);
      try {
        const response = await axios.get(`${url}/${id}/get-logo`, {
          headers,
          responseType: "blob",
        });
        const imageUrl = URL.createObjectURL(response.data);
        setImageSrc(imageUrl);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchData();
    fetchImage();
  }, [authState, id]);

  const isNonMobile = true;

  return tenant ? (
    <Box m="20px" className="edit-tenant">
      <Header
        // title="DETAILS OF TENANT"
        subtitle="Details on an existing tenant profile"
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
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                label="Tenant Name"
                type="text"
                id="tenantName"
                name="tenantName"
                value={values.tenantName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                label="Abbreviated Name"
                type="text"
                id="abbreviatedName"
                name="abbreviatedName"
                value={values.abbreviatedName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                label="Established Year"
                type="date"
                id="establishedYear"
                name="establishedYear"
                value={values.establishedYear}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                id="input-with-icon-textfield"
                variant="standard"
                value="TENANT LOGO"
                InputProps={{
                  readOnly: true,
                  style: { nonSelectableStyle, height: "500px" },
                }}
                onMouseDown={(e) => e.preventDefault()}
                sx={{
                  backgroundImage: `url(${imageSrc})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  maxWidth: "100%",
                  height: "200px",
                  borderRadius: "5px",
                  border: "1px solid green",
                  gridColumn: "span 1",
                }}
              />
           
            </Box>

            <Box display="flex" justifyContent="start" mt="20px">
              <Button
                variant="contained"
                sx={{ mr: 2 }}
                onClick={() => navigate(`/manageteant`)}
              
              >
                Cancel
              </Button>
            </Box>

          </Form>
        )}
      </Formik>
    </Box>
  ) : null;
};

export default DetailsTenant;
