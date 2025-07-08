import { Box, Button, MenuItem, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import axios from "axios";
import { payGradeEndpoint, jobGradeEndpoint } from "../../../configuration/organizationApi";
import Header from "../common/Header";
import ListPayGrade from "./ListPayGrade";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 



const validationSchema = yup.object().shape({
  jobGrade: yup
    .string()
    .required("Please select an option from the dropdown menu."),
  salaryStep: yup
    .string()
    .required("Please select an option from the dropdown menu."),
  initialSalary: yup.string().required("required"),
  maximumSalary: yup.string().required("required"),
  salary: yup.string().required("required"),
  description: yup.string().required("required"),
});

const CreatePayGrade = () => {
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId;
  const [jobGrades, setJobGrades] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);


  useEffect(() => {
    const { url: jobGradeURL, headers } = jobGradeEndpoint(
      authState.accessToken
    );
    axios
      .get(`${jobGradeURL}/${tenantId}/get-all`, { headers })
      .then((response) => {
         if (Array.isArray(response.data)) {
       
                setJobGrades(response.data);


      } else {
        setJobGrades([]);
        console.error("Expected an array but got:", response.data);
      }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = (values, { setSubmitting, resetForm  }) => {
    const { url: payGradeURL, headers } = payGradeEndpoint(
      authState.accessToken
    );

    // Ensure the departmentTypeId is used instead of the department type name
    const data = {
      ...values,
      jobGradeId: values.jobGrade,
    };

    axios
      .post(`${payGradeURL}/${tenantId}/add-pay-grade`, data, { headers })
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
        subtitle="Create a new pay grade profile"
      />
      <Formik
        initialValues={{
          jobGrade: "",
          salaryStep: "",
          initialSalary: "",
          maximumSalary: "",
          salary: "",
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
              // this is where the page cols is choose totally now 4 containers at a time
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 0" },
              }}
              className="form-group"
            >
              <TextField
                select
                name="jobGrade"
                label="Job Grade"
                value={values.jobGrade}
                onChange={handleChange}
                error={!!touched.jobGrade && !!errors.jobGrade}
                helperText={touched.jobGrade && errors.jobGrade}
                sx={{ gridColumn: "span 2" }}
              >
                {/* here the key for displaying the department type form another API display on the select */}
                {jobGrades.map((type, index) => (
                  <MenuItem key={index} value={type.id}>
                    {type.jobGradeName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                name="salaryStep"
                label="Salary Step"
                value={values.salaryStep}
                onChange={handleChange}
                error={!!touched.salaryStep && !!errors.salaryStep}
                helperText={touched.salaryStep && errors.salaryStep}
                sx={{ gridColumn: "span 2" }}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={9}>9</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Initial Salary"
                onBlur={handleBlur}
                error={!!touched.initialSalary && !!errors.initialSalary}
                helperText={touched.initialSalary && errors.initialSalary}
                type="number"
                id="initialSalary"
                name="initialSalary"
                value={values.initialSalary}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Maximum Salary"
                onBlur={handleBlur}
                error={!!touched.maximumSalary && !!errors.maximumSalary}
                helperText={touched.maximumSalary && errors.maximumSalary}
                type="number"
                id="maximumSalary"
                name="maximumSalary"
                value={values.maximumSalary}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Salary"
                onBlur={handleBlur}
                error={!!touched.salary && !!errors.salary}
                helperText={touched.salary && errors.salary}
                type="number"
                id="salary"
                name="salary"
                value={values.salary}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                label="Job Grade Description"
                multiline
                type="text"
                value={values.description}
                onChange={handleChange}
                id="description"
                name="description"
                onBlur={handleBlur}
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="start" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
              >
                Create New Pay Grade
              </Button>
            </Box>

            {successMessage && (
              <span display="flex" className="success-message">
                Pay Grade created successfully!
              </span>
            )}
            <ListPayGrade refreshKey ={refreshKey}/>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreatePayGrade;
