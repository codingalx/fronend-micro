import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { leaveSettingsEndpoint, leaveTypesEndpoint } from "../../../configuration/LeaveApi";
import Header from "../common/Header";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

const validationSchema = yup.object().shape({
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

const genderToOption = {
  Male: "Male",
  Female: "Female",
};

const employeeTypeOption = {
  Permanent: "Permanent",
  Contract: "Contract",
};

const EditLeaveSettings = () => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [initialValues, setInitialValues] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
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
      .then((response) => {
        setLeaveTypes(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });

    axios
      .get(`${leaveSettingsUrl}/${tenantId}/get/${id}`, { headers })
      .then((response) => {
        setInitialValues(response.data);
        console.log("initialValues", response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the leave settings!", error);
      });
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const { url, headers } = leaveSettingsEndpoint(authState.accessToken);

    const data = {
      ...values,
      gender: values.gender,
      employmentType: values.employmentType,
      minimumDays: values.minimumDays,
      maximumDays: values.maximumDays,
      remark: values.remark,
      leaveTypeId: values.leaveTypeId,
      toBalance: values.toBalance,
      escapeSunday: values.escapeSunday,
      escapeSaturday: values.escapeSaturday,
      escapeHoliday: values.escapeHoliday,
    };

    console.log("Data being sent to API:", data); // Log the data being sent

    axios
      .put(`${url}/${tenantId}/update/${id}`, data, { headers })
      .then((response) => {
        if (response.status === 200) {
          navigate('/add_Leave_Info', { state: { activeTab: 4 } }); //
        }
        setSubmitting(false);
      })
      .catch((error) => {
        console.log("error", error.message);
        console.error("There was an error updating the leave settings!", error);
        setSubmitting(false);
      });
  };

  const isNonMobile = useMediaQuery("(min-width:600px)");

  if (!initialValues) {
    return <div>Loading...</div>;
  }

  return (
    <Box m="20px" className="edit-tenant">
      <Header
        subtitle="Edit existing leave settings"
      />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          isSubmitting,
          handleChange,
          setFieldValue,
        }) => (
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
                select
                name="leaveTypeId"
                label="Leave Type"
                value={values.leaveTypeId}
                onChange={handleChange}
                error={!!touched.leaveTypeId && !!errors.leaveTypeId}
                helperText={touched.leaveTypeId && errors.leaveTypeId}
                sx={{ gridColumn: "span 2" }}
                InputProps={{
                  readOnly: true,
                }}
                onMouseDown={(e) => e.preventDefault()}
              >
                {leaveTypes.map((type, index) => (
                  <MenuItem key={index} value={type.id}>
                    {type.leaveTypeName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Gender"
                name="gender"
                value={values.gender}
                onChange={handleChange}
                error={!!touched.gender && !!errors.gender}
                helperText={touched.gender && errors.gender}
                sx={{ gridColumn: "span 2" }}
              >
                {Object.keys(genderToOption).map((key) => (
                  <MenuItem key={key} value={key}>
                    {genderToOption[key]}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Employee Type"
                name="employmentType"
                value={values.employmentType}
                onChange={handleChange}
                error={!!touched.employmentType && !!errors.employmentType}
                helperText={touched.employmentType && errors.employmentType}
                sx={{ gridColumn: "span 2" }}
              >
                {Object.keys(employeeTypeOption).map((key) => (
                  <MenuItem key={key} value={key}>
                    {employeeTypeOption[key]}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Minimum Days"
                onBlur={handleBlur}
                error={!!touched.minimumDays && !!errors.minimumDays}
                helperText={touched.minimumDays && errors.minimumDays}
                type="number"
                id="minimumDays"
                name="minimumDays"
                value={values.minimumDays}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Maximum Days"
                onBlur={handleBlur}
                error={!!touched.maximumDays && !!errors.maximumDays}
                helperText={touched.maximumDays && errors.maximumDays}
                type="number"
                id="maximumDays"
                name="maximumDays"
                value={values.maximumDays}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="remark"
                multiline
                value={values.remark}
                onChange={handleChange}
                name="remark"
                type="text"
                onBlur={handleBlur}
                error={!!touched.remark && !!errors.remark}
                helperText={touched.remark && errors.remark}
                sx={{ gridColumn: "span 2" }}
              />
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.toBalance}
                      onChange={(event) => {
                        setFieldValue("toBalance", event.target.checked);
                      }}
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
                      onChange={(event) => {
                        setFieldValue("escapeSaturday", event.target.checked);
                      }}
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
                      onChange={(event) => {
                        setFieldValue("escapeSunday", event.target.checked);
                      }}
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
                      onChange={(event) => {
                        setFieldValue("escapeHoliday", event.target.checked);
                      }}
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

            <Box display="start" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
              >
                Update Leave Settings
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EditLeaveSettings;
