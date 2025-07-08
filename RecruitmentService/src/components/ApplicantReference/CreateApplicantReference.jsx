import {
  Box,
  Button,
  TextField,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import Header from './../common/Header' 
import {addApplicantReferences} from '../../../configuration/RecruitmentApp'
import { useLocation } from "react-router-dom";
import ListApplicantReference from "./ListApplicantReference";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';

const CreateApplicantReference = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const applicantId = location?.state?.id
    const [authState] = useAtom(authAtom); 
    const tenantId = authState.tenantId





  const handleFormSubmit = async (values) => {
    try {
      console.log("Form data:", values);
      await addApplicantReferences(tenantId,applicantId, values); 
    } catch (error) {
      console.error("Failed to submit form data:", error);
    }
  };


  const initialValues = {
    fullName: "",
    workAddress: "",
    email: "",
    phoneNumber: "",
    description: "",
    jobTitle: "",
  };

  const checkoutSchema = yup.object().shape({
    fullName: yup.string().required("Full Name is required"),
    workAddress: yup.string().required("Work Address is required"),
    email: yup.string().email("Invalid email address").required("Email is required"),
    phoneNumber: yup.string().matches(/^\d{10}$/, "Invalid phone number").required("Phone Number is required"),
    description: yup.string(),
    jobTitle: yup.string().required("Job Title is required"),
  });

  return (
    <Box m="20px">
      <Header
        subtitle="Create Applicant Reference"
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                type="text"
                label="Full Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fullName}
                name="fullName"
                error={!!touched.fullName && !!errors.fullName}
                helperText={touched.fullName && errors.fullName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Work Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.workAddress}
                name="workAddress"
                error={!!touched.workAddress && !!errors.workAddress}
                helperText={touched.workAddress && errors.workAddress}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Mobile Phone"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phoneNumber}
                name="phoneNumber"
                error={!!touched.phoneNumber && !!errors.phoneNumber}
                helperText={touched.phoneNumber && errors.phoneNumber}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Job Title"
                value={values.jobTitle}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                name="jobTitle"
                error={!!touched.jobTitle && !!errors.jobTitle}
                helperText={touched.jobTitle && errors.jobTitle}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Applicant Reference
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <ListApplicantReference   applicantId={applicantId} />
    </Box>
  );
};

export default CreateApplicantReference;
