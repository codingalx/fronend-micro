import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { getTrainingsById, getTrainingsFileById, updateTrainings } from "../../Api/employeeApi";
import Header from "../common/Header";
import { useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import NotFoundHandle from "../common/NotFoundHandle";

const EditTraining = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const { employerId  } = location.state || {};
  const trainingId =location?.state?.id || {}
   const [authState] = useAtom(authAtom); // Access the shared authentication state
        const tenantId = authState.tenantId
  
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const [training, setTraining] = useState({
    trainingTitle: "",
    institution: "",
    sponsoredBy: "",
    startDate: "",
    endDate: "",
    certificate: null,
  });
  

  useEffect(() => {
    fetchTraining();
    fetchFileOfTraining();
  }, []);

  const fetchFileOfTraining = async () => {
    try {
      const fileBlob = await getTrainingsFileById(tenantId,employerId, trainingId); // Await the blob
  
      if (fileBlob) {
        const fileUrl = URL.createObjectURL(fileBlob); // Create a URL for the blob
        setFileUrl(fileUrl);
        setFileName(fileUrl.split('/').pop()); // Extract filename from URL
      } else {
        console.error("Failed to fetch the file.");
      }
    } catch (error) {
      console.error("Failed to fetch the file:", error.message);
    }
  };
  

  const fetchTraining = async () => {
    try {
      const response = await getTrainingsById(tenantId,employerId, trainingId);
      const data = response.data;
      setTraining({
        trainingTitle: data.trainingTitle,
        sponsoredBy: data.sponsoredBy,
        institution: data.institution,
        startDate: data.startDate,
        endDate: data.endDate,
        certificate: data.certificate,
      });
    } catch (error) {
      console.error("Failed to fetch Training:", error.message);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append(
        "training",
        new Blob([JSON.stringify(values)], { type: "application/json" })
      );
      formData.append("certificate", values.certificate || training.certificate); // Use the updated or existing certificate file

      const response = await updateTrainings(tenantId,employerId,trainingId,formData);
      const id =employerId ;

      if (response.status === 200) {
        navigate('/employee/editDetails', { state: { id, isEditable: true,activeTab: 2 } }); // 
      } else {
        console.error("Error updating training. Status code:", response.status);
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
      } else {
        console.error("An error occurred while updating the employee:", error.message);
      }
    }
  };

  const handleFileUpload = (e, setFieldValue) => {
    const file = e.target.files[0];
    setFileName(file.name); // Update filename
    setTraining((prevTraining) => ({
      ...prevTraining,
      certificate: file,
    }));
    setFieldValue("certificate", file); // Set Formik field value for certificate
  };

  const checkoutSchema = yup.object().shape({
    trainingTitle: yup.string().required("Training Title is required"),
    institution: yup.string().required("Institution is required"),
    sponsoredBy: yup.string().required("Sponsored By is required"),
    startDate: yup.date()
      .required("Start Date is required")
      .max(new Date(), "Start Date must be in the past or present"),
    endDate: yup.date()
      .required("End Date is required")
      .max(new Date(), "End Date must be in the past or present")
      .when("startDate", (startDate, schema) => startDate ? schema.min(startDate, "End Date must be after Start Date") : schema),
    certificate: yup.mixed().notRequired(), // Remove required validation for optional change
  });

  if (!(trainingId && employerId)) {
    return <NotFoundHandle message="No employee training selected for  updation." navigateTo="/employee/list" />;
  }


  return (
    <Box m="20px">
      <Header subtitle="Update Training of employer" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={training}
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
                variant="filled"
                type="text"
                label="Training Title"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.trainingTitle}
                name="trainingTitle"
                error={!!touched.trainingTitle && !!errors.trainingTitle}
                helperText={touched.trainingTitle && errors.trainingTitle}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Institution"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.institution}
                name="institution"
                error={!!touched.institution && !!errors.institution}
                helperText={touched.institution && errors.institution}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Sponsored By"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.sponsoredBy}
                name="sponsoredBy"
                error={!!touched.sponsoredBy && !!errors.sponsoredBy}
                helperText={touched.sponsoredBy && errors.sponsoredBy}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.startDate}
                name="startDate"
                error={!!touched.startDate && !!errors.startDate}
                helperText={touched.startDate && errors.startDate}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="End Date"
                InputLabelProps={{ shrink: true }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.endDate}
                name="endDate"
                error={!!touched.endDate && !!errors.endDate}
                helperText={touched.endDate && errors.endDate}
                sx={{ gridColumn: "span 2" }}
              />
              <Box
                display="flex"
                alignItems="center"
                sx={{ gridColumn: "span 2" }}
              >
                <TextField
                  type="file"
                  fullWidth
                  name="certificate"
                  onChange={(e) => handleFileUpload(e, setFieldValue)}
                  onBlur={handleBlur}
                  error={!!touched.certificate && !!errors.certificate}
                  helperText={touched.certificate && errors.certificate}
                  sx={{ mr: 2 }}
                />
                {fileName && (
                  <Typography variant="body2">
                    Current File: {fileName}
                  </Typography>
                )}
              </Box>
              {fileUrl && (
                <Box mt="20px" display="flex" alignItems="center">
                  <Typography variant="body1" sx={{ mr: 2 }}>
                    Download Certificate:
                  </Typography>
                  <Link href={fileUrl} target="_blank" rel="noopener noreferrer">
                    {fileName}
                  </Link>
                </Box>
              )}
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update Training
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default EditTraining;
