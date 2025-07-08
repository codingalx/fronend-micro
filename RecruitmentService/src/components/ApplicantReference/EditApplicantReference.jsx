import {
  Box,
  Button,
  TextField,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { Formik} from "formik";;
import Header from "../common/Header";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { editApplicantReference, getApplicantReferencesbyId } from "../../../configuration/RecruitmentApp";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';


const EditApplicantReference = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const {  applicantId } = location.state;
  const referenceId = location?.state?.id
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId
 

  

  const [reference, setReference] = useState({  
    fullName: "",
    workAddress: "",
    email: "",
    phoneNumber: "",
    description: "",
    jobTitle: "",
});

useEffect(() => {
  fetchReference();
}, []);

const fetchReference = async () => {
  try {
    const response = await getApplicantReferencesbyId(tenantId,applicantId,referenceId);
    const data = response.data; 
    setReference(data);
    console.log(data);
  } catch (error) {
    console.error("Failed to fetch Applicant reference:", error.message);
  }
};

const handleFormSubmit = async (values) => {
  try {
    const response = await editApplicantReference(tenantId,applicantId, referenceId, values);

    if (response.status === 200) {
      const id = applicantId;
      navigate("/recruitment/moreaboutapplicant", { state: { id } });
    } else {
      console.error('Error updating reference of applicant. Status code:', response.status);
    }
  } catch (error) {
    if (error.response) {
      console.error('Server responded with an error:', error.response.data);
    } else {
      console.error('An error occurred while updating the reference:', error.message);
    }
  }
};

  const checkoutSchema = yup.object().shape({
    fullName: yup.string().required("Full Name is required"),
    workAddress: yup.string().required("Work Address is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    description: yup.string().required("Description status is required"),
    jobTitle: yup.string().required("Job Title is required"),
    phoneNumber: yup.string().required("Mobile Phone Title is required"),
   
  });
 

  return (
    <Box m="20px">
      <Header
        subtitle="Edit Reference Of applicant"
       
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={reference}
        validationSchema={checkoutSchema}
        enableReinitialize     
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
                required
                displayEmpty
                inputProps={{ "aria-label": "jobtitle" }}
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
                Update Reference
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default EditApplicantReference;
