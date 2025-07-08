import { Box, Button, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { holidayEndpoint } from "../../../configuration/LeaveApi";
import Header from "../common/Header";
import { useNavigate } from "react-router-dom";
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
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const DetailsHoliday = () => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [holidays, setHolidays] = useState({
    holidayName:"",
    description:""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate()
  const id = location.state.id;

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

  const isNonMobile = useMediaQuery("(min-width:600px)");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box m="20px" className="insert-tenant">
      <Header
        subtitle="Details an existing holiday profile"
      />

      <Formik initialValues={holidays}>
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
                label="Holiday Name"
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                value={values.holidayName}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                label="Holiday Description"
                multiline
                rows={5}
                value={values.description}
                InputProps={{
                  readOnly: true,
                  style: nonSelectableStyle,
                }}
                onMouseDown={(e) => e.preventDefault()}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>



            <Box display="flex" justifyContent="start" mt="20px">
              <Button
                variant="contained"
                sx={{ mr: 2 }}
                onClick={() => navigate(`/add_Leave_Info`,{ state: { activeTab: 1 } })}
                
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

export default DetailsHoliday;
