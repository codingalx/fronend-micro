import { Box, Button, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState, useContext } from "react";
import axios from "axios";
import { addUserEndpoint } from "../../apiConfig";
import AuthContext from "../Auth/AuthContext";
import Header from "../Header";

const validationSchema = yup.object().shape({
  employeeId: yup.string().required("required"),
});

const AddUser = () => {
  const { authState } = useContext(AuthContext);
  const tenantId = authState.tenantId; // Access tenantId from AuthContext

  if (!authState || !authState.accessToken) {
    console.error("authState or accessToken is undefined.");
    return <p>Error: Authorization details are missing.</p>;
  }

  const [successMessage, setSuccessMessage] = useState(false);
  const [existedMessage, setExistedMessage] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const { url, headers } = addUserEndpoint(authState.accessToken);
      const response = await axios.post(
        `${url}/${tenantId}/add?employeeId=${values.employeeId}`,
        values,
        { headers }
      );

      if (response.status === 201) {
        console.log("User created successfully!");
        setExistedMessage(false);
        resetForm();
        setSuccessMessage(true);
      } else {
        console.error("Error creating user. Status code:", response.status);
      }
    } catch (error) {
      console.error(
        "An error occurred while creating the user:",
        error.message
      );

      if (error.response) {
        if (error.response.status === 500 || error.response.status === 400) {
          console.error("An internal server error occurred. User existed.");
          // setExistedMessage(true);
        } else if (error.response.status === 401) {
          console.error("Authorization failed: Invalid or expired token.");
        } else if (error.response.status === 409) {
          console.error("User already existed.");
          setExistedMessage(true);
        } else {
          console.error("An unknown error occurred.");
        }
      } else {
        console.error("The error response is undefined.");
      }
    }
  };

  const isNonMobile = useMediaQuery("(min-width:600px)");

  return (
    <Box m="20px" className="insert-tenant">
      <Header title="Add User" />

      <Formik
        initialValues={{
          employeeId: "",
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
                label="Employee ID"
                onBlur={handleBlur}
                error={!!touched.employeeId && !!errors.employeeId}
                helperText={touched.employeeId && errors.employeeId}
                type="text"
                id="employeeId"
                name="employeeId"
                value={values.employeeId}
                onChange={handleChange}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>
            </Box>
            {successMessage && (
              <span display="flex" className="success-message">
                User created successfully!
              </span>
            )}
            {existedMessage && (
              <span display="flex" className="success-message">
                User already existed!
              </span>
            )}
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddUser;
