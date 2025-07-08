import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Checkbox,
  ListItemText,
  Chip,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../common/Header";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { addAdvertisement, listAdvertisement, listMediaType } from "../../../configuration/RecruitmentApp";
import { useLocation } from 'react-router-dom';
import ListAdvertisment from "./ListAdvertisment";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 




const CreateAdvertisment = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const recruitmentId = location?.state?.id|| {};
    const [authState] = useAtom(authAtom); 
    const tenantId = authState.tenantId


  const [refreshKey, setRefreshKey] = useState(0);
   const [notification, setNotification] = useState({
      open: false,
      message: "",
      severity: "success",
    });
    const handleCloseSnackbar = () => {
      setNotification({ ...notification, open: false });
    };




  const [selectedMediaTypes, setSelectedMediaTypes] = useState([]);
  const [mediaTypes, setMediaTypes] = useState([]);

  const handleMediaTypesChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedMediaTypes(
      typeof value === 'string' ? value.split(',') : value
    );
  };

  useEffect(() => {
    fetchAllMediaType();
  }, []);

  const fetchAllMediaType = async () => {
    try {
      const response = await listMediaType(tenantId)
      setMediaTypes(response.data);
      console.log("Job mediatype:", response.data);
    } catch (error) {
      console.error("Error fetching media types:", error);
    }
  };

  const initialValues = {
    announcementType: "",
    mediaTypes: [],
    recruitmentId: recruitmentId,
    occurrence: "",
    startDate: '',
    endDate: '',
  };
  const handleFormSubmit = async (values, { setSubmitting,resetForm  }) => {
    try {
      const formattedValues = {
        ...values,
        mediaTypeIds: selectedMediaTypes.map(name =>
          mediaTypes.find(mediaType => mediaType.mediaTypeName === name)?.id
        ),
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
      };
  
      const response = await listAdvertisement(tenantId); // Corrected API call
      setNotification({
        open: true,
        message: "Skill created successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey(prev => prev + 1); 

      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

     
      
      const data = response.data;
      if (data && Array.isArray(data)) {
        const exists = data.some(ad => ad.recruitmentId === recruitmentId);
        if (exists) {
          navigate('/recruitment/advertisementexists');
          return;
        }
      } else {
        throw new Error("Unexpected response format: data is not an array");
      }
  
      await addAdvertisement(tenantId,formattedValues);
      console.log("Form data submitted successfully!");
      navigate('/recruitment/listadvertisement');
    } catch (error) {
      console.error("Failed to submit form data:", error);
      if (error.response && error.response.data) {
        console.error("Server response data:", error.response.data);
      }
    } finally {
      setSubmitting(false);
    }
  };
  

  const checkoutSchema = yup.object().shape({
    announcementType: yup.string().required("Announcement Type is required"),
    mediaTypes: yup.array().min(1, "Media Type is required").required("Media Type is required"),
    startDate: yup.date()
      .required("Start Date is required")
      .min(new Date(), "Start date must be in the future or present"),
    endDate: yup.date()
      .required("End Date is required")
      .min(yup.ref('startDate'), "End date must be future to Start date")
      .test('end-date-after-start', 'End date must be future to Start date', function(value) {
        const { startDate } = this.parent;
        return startDate && value && new Date(value) > new Date(startDate);
      }),
    occurrence: yup.number()
      .required("Occurrence cannot be null")
      .integer("Occurrence must be an integer")
      .positive("Occurrence must be positive"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create Advertisement" />

      <Formik
        initialValues={initialValues}
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
          isSubmitting
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
                type="datetime-local"
                label="Start Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.startDate}
                name="startDate"
                error={!!touched.startDate && !!errors.startDate}
                helperText={touched.startDate && errors.startDate}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                type="datetime-local"
                label="End Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.endDate}
                name="endDate"
                error={!!touched.endDate && !!errors.endDate}
                helperText={touched.endDate && errors.endDate}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />

              <FormControl fullWidth sx={{ gridColumn: "span 2" }} error={!!touched.announcementType && !!errors.announcementType}>
                <InputLabel>Please Select Announcement Type</InputLabel>
                <Select
                  label="Announcement Type"
                  value={values.announcementType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "announcementType" }}
                  name="announcementType"
                >
                
                  <MenuItem value="INTERNAL">Internal</MenuItem>
                  <MenuItem value="EXTERNAL">External</MenuItem>
                
                </Select>
                {touched.announcementType && errors.announcementType && (
                  <FormHelperText>{errors.announcementType}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel>Please Select Media Types</InputLabel>
                <Select
                  multiple
                  label="Please Select Media Types"
                  value={values.mediaTypes}
                  onChange={(event) => {
                    handleMediaTypesChange(event);
                    setFieldValue("mediaTypes", event.target.value);
                  }}
                  renderValue={(selected) => (
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} style={{ margin: 2 }} />
                      ))}
                    </div>
                  )}
                >
                  {mediaTypes.map((mediaType) => (
                    <MenuItem key={mediaType.id} value={mediaType.mediaTypeName}>
                      <Checkbox checked={selectedMediaTypes.indexOf(mediaType.mediaTypeName) > -1} />
                      <ListItemText primary={mediaType.mediaTypeName} />
                    </MenuItem>
                  ))}
                </Select>
                {touched.mediaTypes && errors.mediaTypes && (
                  <FormHelperText error>{errors.mediaTypes}</FormHelperText>
                )}
              </FormControl>

              <TextField
                fullWidth
                type="number"
                label="Occurrence"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.occurrence}
                name="occurrence"
                error={!!touched.occurrence && !!errors.occurrence}
                helperText={touched.occurrence && errors.occurrence}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                {isSubmitting ? "Submitting..." : "Create Advertisement"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <ListAdvertisment refreshKey={refreshKey} />
    </Box>
  );
};

export default CreateAdvertisment;
