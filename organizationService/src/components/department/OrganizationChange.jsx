import { Box, Button, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import SelectedKeyContext from "./SelectedKeyContext";
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
import {
  departmentTypesEndpoint,
  departmentEndpoint,
} from "../../../configuration/organizationApi";
import AuthContext from "../../Auth/AuthContext";
import Header from "../common/Header";
import DepartmentTree from "../../Employee/DepartmentTree";

const OrganizationChange = () => {
  const { authState } = useContext(AuthContext);
  const tenantId = authState.tenantId;
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const id = location.state.id;
  const { selectedKey, setSelectedKey } = useContext(SelectedKeyContext);
  const [localSelectedKey, setLocalSelectedKey] = useState(selectedKey);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSelect = (key) => {
    setSelectedKey(key); // This should update the context
    setLocalSelectedKey(key); // Update local state
  };

  useEffect(() => {
    const fetchData = async () => {
      const { url: DURL, headers } = departmentEndpoint(authState.accessToken);
      try {
        console.log("Fetching department and address data...");
        const deptResponse = await axios.get(`${DURL}/${tenantId}/get/${id}`, {
          headers,
        });
        const deptData = deptResponse.data;
        if (!deptData || !deptData.departmentTypeId) {
          throw new Error("Invalid department data");
        }
        const { url: DTURL } = departmentTypesEndpoint(authState.accessToken);
        const deptTypeResponse = await axios.get(
          `${DTURL}/${tenantId}/get/${deptData.departmentTypeId}`,
          {
            headers,
          }
        );
        const deptTypeData = deptTypeResponse.data;
        if (!deptTypeData || !deptTypeData.departmentTypeName) {
          throw new Error("Invalid department type data");
        }
        const combinedData = {
          ...deptData,
          departmentTypeName: deptTypeData.departmentTypeName,
        };
        setTenant(combinedData);
        setLoading(false);
      } catch (error) {
        console.error("There was an error fetching the data: " + error.message);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = ({}) => {
    const { url, headers } = departmentEndpoint(authState.accessToken);
    axios
      .post(
        `${url}/${tenantId}/${id}/transfer/${localSelectedKey}`,
        {},
        {
          headers,
        }
      )
      .then((response) => {
        console.log(response.data);
        setSuccessMessage(true);
      })
      .catch((error) => {
        console.error(error.message); // Log the actual error message
        setError("There was an error updating the department!");
      });
  };

  const isNonMobile = useMediaQuery("(min-width:600px)");
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Box m="20px" className="insert-tenant">
        <Header
          title="STRUCTURE CHANGE"
          subtitle="Department sturcture change profile"
        />

        <Formik
          initialValues={
            tenant
              ? { ...tenant, changeAddress: tenant.changeAddress || "no" }
              : { changeAddress: "no" }
          }
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, isSubmitting }) => (
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
                  variant="standard"
                  InputProps={{
                    readOnly: true,
                    style: nonSelectableStyle,
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  label="Current Department Strucuture"
                  sx={{
                    gridColumn: "span 4",
                    "& .MuiInputBase-input": {
                      textAlign: "center",
                    },
                    "& .MuiInputLabel-root": {
                      position: "absolute",
                      left: "50%",
                      transform: "translateX(-50%)",
                      pointerEvents: "none",
                    },
                    "& .MuiInputLabel-shrink": {
                      transform: "translateX(-50%) scale(0.75)",
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Department Name"
                  InputProps={{
                    readOnly: true,
                    style: nonSelectableStyle,
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  value={values.departmentName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  InputProps={{
                    readOnly: true,
                    style: nonSelectableStyle,
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  label="Department Type"
                  value={values.departmentTypeName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="standard"
                  InputProps={{
                    readOnly: true,
                    style: nonSelectableStyle,
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  label="Do you want to Change Department Strucuture?"
                  sx={{
                    "& .MuiInputLabel-root": {
                      left: "50%",
                      transform: "translateX(-50%)",
                    },
                    "& .MuiInputBase-input": {
                      textAlign: "center",
                    },
                    gridColumn: "span 4",
                  }}
                />
                <TextField
                  fullWidth
                  label=" Choose new Department"
                  InputProps={{
                    inputComponent: DepartmentTree,
                    inputProps: {
                      selectedKey: localSelectedKey,
                      onSelect: handleSelect,
                      handleSelect: handleSelect,
                    },
                  }}
                  sx={{
                    gridColumn: "span 4",
                    height: "auto",
                    alignItems: "center",
                  }}
                />
              </Box>
              <Box display="flex" justifyContent="start" mt="20px">
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  Apply Department Change
                </Button>
              </Box>
              {successMessage && (
                <span display="flex" className="success-message">
                  Organization Change successfully performed!
                </span>
              )}
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default OrganizationChange;
