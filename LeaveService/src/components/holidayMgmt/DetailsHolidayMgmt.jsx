import { Box, Button, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  holidayManagementEndpoint,
  budgetYearEndpoint,
  holidayEndpoint,
} from "../../../configuration/LeaveApi";
import Header from "../common/Header";
import { useNavigate } from "react-router-dom";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

const DetailsHolidayMgmt = () => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [initialValues, setInitialValues] = useState({
    budgetYear: "",
    holidayName: "",
    holidayDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const id = location.state.id;
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    const { url: holdaymgtUrl, headers } = holidayManagementEndpoint(
      authState.accessToken
    );
    const { url: budgetYearUrl } = budgetYearEndpoint(authState.accessToken);
    const { url: holidaysUrl } = holidayEndpoint(authState.accessToken);
    axios
      .get(`${holdaymgtUrl}/${tenantId}/get/${id}`, { headers })
      .then((response) => {
        const budgetYearId = response.data.budgetYearId;
        const holidayId = response.data.holidayId;
        const fetchedDate = response.data.date;
        axios
          .get(`${budgetYearUrl}/${tenantId}/get/${budgetYearId}`, { headers })
          .then((budgetYearResponse) => {
            const budgetYear = budgetYearResponse.data.budgetYear;
            axios
              .get(`${holidaysUrl}/${tenantId}/get/${holidayId}`, {
                headers,
              })
              .then((holidaysResponse) => {
                const holidayName = holidaysResponse.data.holidayName;
                setInitialValues({
                  budgetYear,
                  holidayName,
                  holidayDate: fetchedDate,
                });
                setLoading(false);
              })
              .catch((holidaysError) => {
                setError("Error fetching holidayName.");
              });
          })
          .catch((budgetYearError) => {
            setError("Error fetching budget year value.");
          });
      })
      .catch((error) => {
        setError("There was an error!");
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box m="20px" className="insert-tenant">
      <Header
        subtitle="Details of an existing holiday management profile"
      />

      <Formik initialValues={initialValues}>
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
                name="budgetYear"
                id="budgetYear"
                label="Budget Year"
                value={values.budgetYear}
                sx={{ gridColumn: "span 2" }}
                InputProps={{
                  readOnly: true,
                }}
                onMouseDown={(e) => e.preventDefault()}
              />
              <TextField
                name="holidayName"
                id="holidayName"
                label="Holiday Name"
                value={values.holidayName}
                sx={{ gridColumn: "span 2" }}
                InputProps={{
                  readOnly: true,
                }}
                onMouseDown={(e) => e.preventDefault()}
              />
              <TextField
                fullWidth
                label="Holiday Date"
                sx={{ gridColumn: "span 2" }}
                id="holidayDate"
                name="holidayDate"
                value={values.holidayDate}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  readOnly: true,
                }}
                onMouseDown={(e) => e.preventDefault()}
              />
            </Box>

            <Box display="flex" justifyContent="start" mt="20px">
              <Button
                variant="contained"
                sx={{ mr: 2 }}
                onClick={() => navigate(`/add_Leave_Info`,{ state: { activeTab: 2 } })}
                
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

export default DetailsHolidayMgmt;
