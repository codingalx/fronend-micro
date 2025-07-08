import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { leaveSettingsEndpoint, leaveTypesEndpoint } from "../../../configuration/LeaveApi";
import Header from "../common/Header";
import { useNavigate } from "react-router-dom";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

const validationSchema = yup.object().shape({
  leaveType: yup
    .string()
    .required("Please select an option from the dropdown menu."),
  gender: yup
    .string()
    .required("Please select an option from the dropdown menu."),
  employmentType: yup
    .string()
    .required("Please select an option from the dropdown menu."),
  minimumDays: yup.string().required("required"),
  maximumDays: yup.string().required("required"),
  remark: yup.string().required("required"),
});

const detailsLeaveSettings = () => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [initialValues, setInitialValues] = useState(null);
  const location = useLocation();
  const navigate = useNavigate()
  const { id } = location.state;

  useEffect(() => {
    const { url: leaveTypeUrl, headers } = leaveTypesEndpoint(
      authState.accessToken
    );
    const { url: leaveSettingsUrl } = leaveSettingsEndpoint(
      authState.accessToken
    );
    axios
      .get(`${leaveTypeUrl}/${tenantId}/get-all`, { headers })
      .then((response) => {})
      .catch((error) => {
        console.error("There was an error!", error);
      });

    axios
      .get(`${leaveSettingsUrl}/${tenantId}/get/${id}`, { headers })
      .then((response) => {
        const leaveDatas = response.data;
        axios
          .get(`${leaveTypeUrl}/${tenantId}/get/${response.data.leaveTypeId}`, {
            headers,
          })
          .then((response) => {
            const leaveTypeName = response.data.leaveTypeName;
            setInitialValues({
              ...leaveDatas,
              leaveTypeName,
            });
          });
      })
      .catch((error) => {
        console.error("There was an error fetching the leave settings!", error);
      });
  }, [id]);

  const isNonMobile = useMediaQuery("(min-width:600px)");

  if (!initialValues) {
    return <div>Loading...</div>;
  }

  return (
    <Box m="20px" className="edit-tenant">
      <Header
        subtitle="Edit existing leave settings"
      />
      <Formik initialValues={initialValues} validationSchema={validationSchema}>
        {({ values, handleBlur }) => (
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
                name="leaveType"
                label="Leave Type"
                value={values.leaveTypeName}
                sx={{ gridColumn: "span 2" }}
                InputProps={{
                  readOnly: true,
                }}
                onMouseDown={(e) => e.preventDefault()}
              ></TextField>
              <TextField
                label="Gender"
                name="gender"
                value={values.gender}
                sx={{ gridColumn: "span 2" }}
                InputProps={{
                  readOnly: true,
                }}
                onMouseDown={(e) => e.preventDefault()}
              ></TextField>
              <TextField
                label="Employee Type"
                name="employmentType"
                value={values.employmentType}
                sx={{ gridColumn: "span 2" }}
                InputProps={{
                  readOnly: true,
                }}
                onMouseDown={(e) => e.preventDefault()}
              ></TextField>
              <TextField
                fullWidth
                label="Minimum Days"
                onBlur={handleBlur}
                type="number"
                id="minimumDays"
                name="minimumDays"
                value={values.minimumDays}
                sx={{ gridColumn: "span 2" }}
                InputProps={{
                  readOnly: true,
                }}
                onMouseDown={(e) => e.preventDefault()}
              />
              <TextField
                fullWidth
                label="Maximum Days"
                onBlur={handleBlur}
                type="number"
                id="maximumDays"
                name="maximumDays"
                value={values.maximumDays}
                sx={{ gridColumn: "span 2" }}
                InputProps={{
                  readOnly: true,
                }}
                onMouseDown={(e) => e.preventDefault()}
              />
              <TextField
                fullWidth
                label="remark"
                multiline
                value={values.remark}
                name="remark"
                type="text"
                onBlur={handleBlur}
                sx={{ gridColumn: "span 2" }}
                InputProps={{
                  readOnly: true,
                }}
                onMouseDown={(e) => e.preventDefault()}
              />
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.toBalance}
                      name="toBalance"
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body1">
                      To Balance
                      {values.toBalance && <span> ✔ </span>}
                    </Typography>
                  }
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.escapeSaturday}
                      name="escapeSaturday"
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body1">
                      Escape Saturday
                      {values.escapeSaturday && <span> ✔ </span>}
                    </Typography>
                  }
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.escapeSunday}
                      name="escapeSunday"
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body1">
                      Escape Sunday
                      {values.escapeSunday && <span> ✔ </span>}
                    </Typography>
                  }
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.escapeHoliday}
                      name="escapeHoliday"
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body1">
                      Escape Holiday
                      {values.escapeHoliday && <span> ✔ </span>}
                    </Typography>
                  }
                />
              </FormGroup>
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button
                variant="contained"
                sx={{ mr: 2 }}
                onClick={() => navigate(`/add_Leave_Info`,{ state: { activeTab: 4 } })}
                
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

export default detailsLeaveSettings;
