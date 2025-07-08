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
import { useState } from "react";
import axios from "axios";
import { budgetYearEndpoint } from "../../../configuration/LeaveApi";
import Header from "../common/Header";
import ManageBudgetYear from "./ManageBudgetYear";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 




const validationSchema = yup.object().shape({
  budgetYear: yup.string().required("required"),
  description: yup.string().required("required"),
});

const AddBudgetYear = () => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;
  const [refreshKey, setRefreshKey] = useState(0);


  const [successMessage, setSuccessMessage] = useState(false);
  const [existedMessage, setExistedMessage] = useState(false);

  const handleSubmit = (values, { setSubmitting,resetForm }) => {
    const { url, headers } = budgetYearEndpoint(authState.accessToken);
    const dataToSubmit = {
      ...values,
      active: values.isActive,
    };

    axios
      .post(`${url}/${tenantId}/add`, dataToSubmit, { headers })
      .then((response) => {
        console.log("Budget year created successfully!");
        console.log("Response: ", response.data);
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
        setSubmitting(false);
        setExistedMessage(true);
      });
  };

  const isNonMobile = useMediaQuery("(min-width:600px)");

  return (
    <Box m="20px" className="insert-tenant">
      <Header
        subtitle="Create a new budget year profile"
      />

      <Formik
        initialValues={{
          budgetYear: "",
          description: "",
          isActive: false, 
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
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
                fullWidth
                label="Budget Year"
                onBlur={handleBlur}
                error={!!touched.budgetYear && !!errors.budgetYear}
                helperText={touched.budgetYear && errors.budgetYear}
                type="text"
                id="budgetYear"
                name="budgetYear"
                value={values.budgetYear}
                onChange={handleChange}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                label="Budget Year Description"
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

              <FormGroup>
                <FormControlLabel
                
                  control={
                    <Checkbox
                      checked={values.isActive}
                      onChange={(event) => {
                        setFieldValue("isActive", event.target.checked);
                      }}
                      name="isActive"
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body1">
                      Active Year
                      {values.isActive && <span> ✔ </span>}
                    </Typography>
                  }
                />

              </FormGroup>
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Budget Year
              </Button>
            </Box>
            {successMessage && (
              <span display="flex" className="success-message">
                Budget Year created successfully!
              </span>
            )}

            {existedMessage && (
              <span display="flex" className="success-message">
                Budget Year already existed, try different name!
              </span>
            )}
            <ManageBudgetYear refreshKey ={refreshKey} />

          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddBudgetYear;
