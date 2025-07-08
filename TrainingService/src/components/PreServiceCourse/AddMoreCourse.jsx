
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
import Header from "../../Header";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { addAdvertisement, listAdvertisement, REST_API_BASE_URL } from "../../../../Services/apiData";
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const CreateAdvertisment = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const recruitmentId = location?.state?.id;

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
      const response = await axios.get(
        `${REST_API_BASE_URL}media-types/1/get-all`
      );
      setMediaTypes(response.data);
      console.log("Job mediatype:", response.data);
    } catch (error) {
      console.error("Error fetching media types:", error);
    }
  };

  const initialValues = {
    mediaTypes: [],
  };

 const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      const formattedValues = {
        ... values,
        mediaTypeIds: selectedMediaTypes.map(name =>
          mediaTypes.find(mediaType => mediaType.mediaTypeName === name)?.id
        ),
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
      };

      const response = await fetch(listAdvertisement);
      if (!response.ok) {
        throw new Error("Failed to fetch advertisements");
      }
      const data = await response.json();
      const exists = data.some(ad => ad.recruitmentId === recruitmentId);
      
      if (exists) {
        navigate('/recruitment/advertisementexists');
        return;
      }
      
      await addAdvertisement(formattedValues);
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
  
    mediaTypes: yup.array().min(1, "Media Type is required").required("Media Type is required"),
   
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
          

              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel>Please Select Media Types</InputLabel>
                <Select
                  multiple
                  label="Please Select Media Types"
                  value={values.mediaTypes}
                  variant="filled"
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

           
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                {isSubmitting ? "Submitting..." : "Create Advertisement"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateAdvertisment;
