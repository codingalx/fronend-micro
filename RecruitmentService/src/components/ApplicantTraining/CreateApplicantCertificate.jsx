import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik } from "formik";
import Header from '../common/Header'
import {addApplicantTraining} from '../../../configuration/RecruitmentApp'
import ListApplicantCertificate from "./ListApplicantCertificate";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';



const CreateApplicantCertificate = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [imagePreview, setImagePreview] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const applicantId = location?.state?.id
  const { recruitmentId } = location.state;
   const [authState] = useAtom(authAtom); 
    const tenantId = authState.tenantId

  const [training, setTraining] = useState({
    training: {
      trainingTitle: "",
      institution: "",
      sponsoredBy: "",
      startDate: "",
      endDate: "",
      award: "",
    },
    certificate: null,
  });

  const checkoutSchema = yup.object().shape({
    training: yup.object().shape({
        trainingTitle: yup.string().required("Training Title is required"),
        institution: yup.string().required("Institution is required"),
        sponsoredBy: yup.string().required("Sponsored By is required"),
        startDate: yup.date().required("Start Date is required").max(new Date(), "Start Date must be in the past or present"),
        endDate: yup.date().required("End Date is required").max(new Date(), "End Date must be in the past or present"),
        award: yup.string().required("Award is required"),
     
     
    }),
    certificate: yup.mixed().required("Certificate is required"),
  });

  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append(
        "training",
        new Blob([JSON.stringify(values.training)], { type: "application/json" })
      );

      formData.append("certificate", training.certificate);

      const response = await addApplicantTraining(tenantId,applicantId, formData); 
      if (response.status === 201) {
      } else {
        console.error("Error adding training. Status code:", response.status);
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
      } else {
        console.error("An error occurred while adding the Training:", error.message);
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setTraining((prevTraining) => ({
      ...prevTraining,
      certificate: file,
    }));
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <Box m="20px">
      <Header subtitle="Training of applicant" />

      <Formik
        initialValues={training}
        validationSchema={checkoutSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
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
                label="Training Title"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.training.trainingTitle}
                name="training.trainingTitle"
                error={!!touched.training?.trainingTitle && !!errors.training?.trainingTitle}
                helperText={touched.training?.trainingTitle && errors.training?.trainingTitle}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Institution"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.training.institution}
                name="training.institution"
                error={!!touched.training?.institution && !!errors.training?.institution}
                helperText={touched.training?.institution && errors.training?.institution}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Sponsored By"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.training.sponsoredBy}
                name="training.sponsoredBy"
                error={!!touched.training?.sponsoredBy && !!errors.training?.sponsoredBy}
                helperText={touched.training?.sponsoredBy && errors.training?.sponsoredBy}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.training.startDate}
                name="training.startDate"
                error={touched.training?.startDate && !!errors.training?.startDate}
                helperText={touched.training?.startDate && errors.training?.startDate}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="date"
                label="End Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.training.endDate}
                name="training.endDate"
                error={touched.training?.endDate && !!errors.training?.endDate}
                helperText={touched.training?.endDate && errors.training?.endDate}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="file"
                fullWidth
                name="certificate"
                onChange={(e) => {
                  handleFileUpload(e);
                  setFieldValue("certificate", e.currentTarget.files[0]);
                }}
                onBlur={handleBlur}
                error={!!touched.certificate && !!errors.certificate}
                helperText={touched.certificate && errors.certificate}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Award"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.training.award}
                name="training.award"
                error={!!touched.training?.award && !!errors.training?.award}
                helperText={touched.training?.award && errors.training?.award}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Applicant Training
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <ListApplicantCertificate applicantId ={applicantId} />
    </Box>
  );
};

export default CreateApplicantCertificate
