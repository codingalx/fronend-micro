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
import { useNavigate, useLocation } from "react-router-dom";
import { Formik } from "formik";
import { editAdvertisement,getAdvertisementbyId,listMediaType } from '../../../configuration/RecruitmentApp';
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const EditAdvertisement = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const { id, recruitmentId } = location.state;
  const [selectedMediaTypes, setSelectedMediaTypes] = useState([]);
  const [mediaTypes, setMediaTypes] = useState([]);
      const [authState] = useAtom(authAtom); 
        const tenantId = authState.tenantId

  const handleMediaTypesChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedMediaTypes(
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const [advertisement, setAdvertisement] = useState({
    announcementType: "",
    mediaTypes: [],
    recruitmentId: recruitmentId,
    occurrence: "",
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchAdvertisment();
    fetchAllMediaType();
  }, []);

  const fetchAdvertisment = async () => {
    try {
      const response = await getAdvertisementbyId(tenantId,id);
      const data = response.data;
      data.announcementType = data.announcementType.toUpperCase();
      data.mediaTypes = data.mediaTypes.map((type) => type.mediaTypeName); // Map media types
      setAdvertisement(data);
      setSelectedMediaTypes(data.mediaTypes); // Set the selected media types
    } catch (error) {
      console.error("Failed to fetch advertisement:", error.message);
    }
  };

  const fetchAllMediaType = async () => {
    try {
      const response = await listMediaType(tenantId);
      setMediaTypes(response.data);
      console.log("Job mediatype:", response.data);
    } catch (error) {
      console.error("Error fetching media types:", error);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        mediaTypeIds: selectedMediaTypes.map(name =>
          mediaTypes.find(mediaType => mediaType.mediaTypeName === name)?.id
        ),
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
      };

      console.log("Submitting values:", formattedValues);
      await editAdvertisement(tenantId,id, formattedValues);
      console.log("Form data submitted successfully!");
      // navigate('/recruitment/listadvertisement'); // navigate to a different page after successful submission
      // const id = recruitmentId;
      // navigate('/recruitment/more', { state: { recruitmentId, activeTab: 1 } }); 

      navigate('/recruitment/more', {
        state: { id: recruitmentId,  activeTab: 0 },
      });

    } catch (error) {
      console.error("Failed to submit form data:", error);
      if (error.response && error.response.data) {
        console.error("Server response data:", error.response.data);
      }
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
      .test('end-date-after-start', 'End date must be future to Start date', function (value) {
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
      <Header subtitle="Edit Advertisement" />

      <Formik
        initialValues={advertisement}
        validationSchema={checkoutSchema}
        onSubmit={handleFormSubmit}
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

              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
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
                  error={!!touched.announcementType && !!errors.announcementType}
                >
                  <MenuItem value="INTERNAL">INTERNAL</MenuItem>
                  <MenuItem value="EXTERNAL">EXTERNAL</MenuItem>
                </Select>
                {touched.announcementType && errors.announcementType && (
                  <FormHelperText error>{errors.announcementType}</FormHelperText>
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
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Update Advertisement"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default EditAdvertisement;
