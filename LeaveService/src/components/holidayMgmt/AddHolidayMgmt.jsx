import { Box, Button, MenuItem, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState, useContext } from "react";
import axios from "axios";

// the following is importing config file to get endpoints stored in one point
import {
  holidayManagementEndpoint,
  budgetYearEndpoint,
  holidayEndpoint,
} from "../../../configuration/LeaveApi";
import Header from "../common/Header";
import ManageHolidayMgmt from "./ManageHolidayMgmt";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 



const validationSchema = yup.object().shape({
  holidayName: yup
    .string()
    .required("Please select an option from the dropdown menu."),
  budgetYear: yup
    .string()
    .required("Please select an option from the dropdown menu."),
});

const AddHolidayMgmt = () => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;
  const [refreshKey, setRefreshKey] = useState(0);


  const date = new Date();

  function toDateInputValue(dateObject) {
    const local = new Date(dateObject);
    local.setMinutes(dateObject.getMinutes() - dateObject.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
  }

  const [budgetYears, setBudegetYears] = useState([]);
  const [budgetNames, setBudgetNames] = useState([]);

  useEffect(() => {
    const { url, headers } = budgetYearEndpoint(authState.accessToken);
    axios
      .get(`${url}/${tenantId}/get-all`, { headers })
      .then((response) => {
        setBudegetYears(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  useEffect(() => {
    const { url, headers } = holidayEndpoint(authState.accessToken);
    axios
      .get(`${url}/${tenantId}/get-all`, { headers })
      .then((response) => {
        setBudgetNames(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = (values, { setSubmitting ,resetForm}) => {
    const { url, headers } = holidayManagementEndpoint(authState.accessToken);

    // Ensure the departmentTypeId is used instead of the department type name
    const data = {
      ...values,
      budgetYearId: values.budgetYear,
      holidayId: values.holidayName,
      date: values.holidayDate,
    };

    axios
      .post(`${url}/${tenantId}/add`, data, { headers })
      .then((response) => {
        console.log(response.data);
        console.log("Success:", data);

        setSuccessMessage(true);
        setSubmitting(false);
        resetForm();
        setRefreshKey(prev => prev + 1); 
      })
      .catch((error) => {
        console.error("There was an error!", error);
        setSubmitting(false);
      });
  };

  const isNonMobile = useMediaQuery("(min-width:600px)");

  return (
    <Box m="20px" className="insert-tenant">
      <Header
        subtitle="Create a new holiday managemnt profile"
      />
      <Formik
        initialValues={{
          budgetYear: "",
          holidayName: "",
          holidayDate: toDateInputValue(date),
        }}
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
                name="budgetYear"
                label="Budget Year"
                value={values.budgetYear}
                onChange={handleChange}
                error={!!touched.budgetYear && !!errors.budgetYear}
                helperText={touched.budgetYear && errors.budgetYear}
                sx={{ gridColumn: "span 2" }}
              >
                {budgetYears.map((type, index) => (
                  <MenuItem key={index} value={type.id}>
                    {type.budgetYear}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                name="holidayName"
                label="Holiday Name"
                value={values.holidayName}
                onChange={handleChange}
                error={!!touched.holidayName && !!errors.holidayName}
                helperText={touched.holidayName && errors.holidayName}
                sx={{ gridColumn: "span 2" }}
              >
                {budgetNames.map((type, index) => (
                  <MenuItem key={index} value={type.id}>
                    {type.holidayName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Holiday Date"
                onBlur={handleBlur}
                error={!!touched.holidayDate && !!errors.holidayDate}
                helperText={touched.holidayDate && errors.holidayDate}
                sx={{ gridColumn: "span 2" }}
                type="date"
                id="holidayDate"
                name="holidayDate"
                value={values.holidayDate}
                onChange={handleChange}
              />
            </Box>
            <Box display="start" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
              >
                Create New Holiday Management
              </Button>
            </Box>

            {successMessage && (
              <span display="flex" className="success-message">
                Holiday Management is created successfully!
              </span>
            )}
            <ManageHolidayMgmt  refreshKey ={refreshKey}/>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddHolidayMgmt;
