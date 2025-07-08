import { Box, Button, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState, useContext } from "react";
import axios from "axios";
import { holidayEndpoint } from "../../../configuration/LeaveApi";
import Header from "../common/Header";
import ManageHoliday from "./ManageHoliday";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const validationSchema = yup.object().shape({
  holidayName: yup.string().required("required"),
  description: yup.string().required("required"),
});



const AddHoliday = () => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;

  const [successMessage, setSuccessMessage] = useState(false);
  const [existedMessage, setExistedMessage] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);


  const handleSubmit = (values, { setSubmitting,resetForm }) => {
    const { url, headers } = holidayEndpoint(authState.accessToken);

    axios
      .post(`${url}/${tenantId}/add`, values, { headers })
      .then((response) => {
        console.log("Holiday created successfully!");
        console.log(response.data);
        setExistedMessage(false);
        setSuccessMessage(true);
        setSubmitting(false);
        resetForm();
        setRefreshKey(prev => prev + 1); 
      })
      .catch((error) => {
        console.error("There was an error!", error);
        setSubmitting(false);
        if (error.response.status === 500) {
          console.error("An internal server error occurred. Existed");
        }
        setExistedMessage(true);
      });
  };

  const isNonMobile = useMediaQuery("(min-width:600px)");

  return (
    <Box m="20px" className="insert-tenant">
      <Header
        subtitle="Create a new holiday profile"
      />

      <Formik
        initialValues={{
          holidayName: "",
          description: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleBlur, handleChange }) => (
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
                onBlur={handleBlur}
                error={!!touched.holidayName && !!errors.holidayName}
                helperText={touched.holidayName && errors.holidayName}
                type="text"
                id="holidayName"
                name="holidayName"
                value={values.holidayName}
                onChange={handleChange}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                label="Holiday Description"
                multiline
                rows={5}
                onChange={handleChange}
                value={values.description}
                name="description"
                onBlur={handleBlur}
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Holiday
              </Button>
            </Box>

            {successMessage && (
              <span display="flex" className="success-message">
                Holiday created successfully!
              </span>
            )}

            {existedMessage && (
              <span display="flex" className="success-message">
                Holiday already existed, try different name!
              </span>
            )}
                <ManageHoliday refreshKey ={refreshKey} />
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddHoliday;
