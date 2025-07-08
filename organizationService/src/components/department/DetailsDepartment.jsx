import { Box, TextField,Button } from "@mui/material";
import { Formik, Form } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {   departmentTypesEndpoint,
  departmentEndpoint, } from "../../../configuration/organizationApi";
  import Header from "../common/Header";
;
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

const DetailsDepartment = () => {
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
      const { url: deptURL, headers } = departmentEndpoint(
        authState.accessToken
      );
      const { url: typeURL } = departmentTypesEndpoint(authState.accessToken);
      try {
        // Fetch the department details
        const responseDept = await axios.get(
          `${deptURL}/${tenantId}/get/${id}`,
          {
            headers,
          }
        );
        const dataDept = responseDept.data;

        // Fetch the department type details using the departmentTypeId from the department details
        const responseDeptType = await axios.get(
          `${typeURL}/${tenantId}/get/${dataDept.departmentTypeId}`,
          {
            headers,
          }
        );
        const dataDeptType = responseDeptType.data;
        setTenant({
          ...dataDept,
          departmentType: dataDeptType.departmentTypeName,
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
        title="DETAILS DEPARTMENT"
        subtitle="Details for an existing department profile"
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
                id="departmentName"
                name="departmentName"
                value={values.departmentName}
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

              <TextField
                fullWidth
                label="Established Date"
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                sx={{ gridColumn: "span 2" }}
                type="date"
                id="establishedDate"
                name="establishedDate"
                value={values.establishedDate}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button
                variant="contained"
                sx={{ mr: 2 }}
                onClick={() => navigate(`/manage_organization_info`,{ state: { activeTab: 9} })}
                
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

export default DetailsDepartment;
