import { Box, Button, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";import axios from "axios";
import { jobCategoriesEndpoint } from "../../../configuration/organizationApi";
import Header from "../common/Header";
import ListJobCategory from "./ListJobCategory";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

const validationSchema = yup.object().shape({
  jobCategoryName: yup.string().required("required"),
  description: yup.string().required("required"),
});

const CreateJobCategory = () => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId; // Access tenantId from AuthContext
  const [successMessage, setSuccessMessage] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);


  const handleSubmit = (values, { setSubmitting ,resetForm}) => {
    const { url, headers } = jobCategoriesEndpoint(authState.accessToken);

    axios
      .post(`${url}/${tenantId}/add`, values, { headers })
      .then((response) => {
        console.log(response.data);
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
        subtitle="Create a new job category profile"
      />

      <Formik
        initialValues={{
          jobCategoryName: "",
          description: "",
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
                fullWidth
                label="Job Category Name"
                onBlur={handleBlur}
                error={!!touched.jobCategoryName && !!errors.jobCategoryName}
                helperText={touched.jobCategoryName && errors.jobCategoryName}
                type="text"
                id="jobCategoryName"
                name="jobCategoryName"
                value={values.jobCategoryName}
                onChange={handleChange}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                label="Job Category Description"
                multiline
                rows={5}
                value={values.description}
                onChange={handleChange}
                name="description"
                onBlur={handleBlur}
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
              >
                Create New Job Category
              </Button>
            </Box>

            {successMessage && (
              <span display="flex" className="success-message">
                Job Category is created successfully!
              </span>
            )}
          <ListJobCategory  refreshKey ={refreshKey}/>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateJobCategory;
