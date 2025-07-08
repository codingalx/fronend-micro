import React from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../common/Header";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { addApplicantLanguages, listLanguageName } from '../../../configuration/RecruitmentApp'
import { useLocation } from "react-router-dom";
import { useState,useEffect } from "react";
import ListApplicantLanguage from "./ListApplicantLanguage";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';




const CreateApplicantLanguage = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const applicantId = location?.state?.id
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId

      const [allListOfLanguage, setAllListOfLanguage] = useState([]);

      useEffect(() => {
        fetchAllLanguages();
      }, []);
    
      const fetchAllLanguages = async () => {
        try {
          const response = await listLanguageName(tenantId);
          setAllListOfLanguage(response.data);
          console.log("The list of languages:", response.data);
        } catch (error) {
          console.error("Error fetching languages:", error);
        }
      };
    
      const handleFormSubmit = async (values) => {
        try {
          console.log("Form data:", values);
         
          await addApplicantLanguages(tenantId,applicantId, values);
        } catch (error) {
          console.error("Failed to submit form data:", error);
        }
      };
    
      const initialValues = {
        languageNameId: "",
        reading: "",
        listening: "",
        speaking: "",
        writing: "",
      };
    
      const validListeningLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED",  "FLUENT"];
      const validReadingLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED",  "PROFICIENT"];
      const validSpeakingLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED",  "FLUENT"];
      const validWritingLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED",  "PROFICIENT"];
    
      const checkoutSchema = yup.object().shape({
        languageNameId: yup.string().required("Language name cannot be null"),
        listening: yup.string().oneOf(validListeningLevels, "Invalid skill level").required("Listening skill level cannot be null"),
        speaking: yup.string().oneOf(validSpeakingLevels, "Invalid skill level").required("Speaking skill level cannot be null"),
        reading: yup.string().oneOf(validReadingLevels, "Invalid skill level").required("Reading skill level cannot be null"),
        writing: yup.string().oneOf(validWritingLevels, "Invalid skill level").required("Writing skill level cannot be null"),
      });
    
      return (
        <Box m="20px">
       
          <Header subtitle="Create Language of Employer" />
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
                    "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
                  }}
                >
                  <FormControl
                    sx={{ gridColumn: "span 2" }}
                    error={!!touched.languageNameId && !!errors.languageNameId}
                  >
                    <InputLabel id="language-label">Select Language</InputLabel>
                    <Select
                      labelId="language-label"
                      value={values.languageNameId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="languageNameId"
                    >
                      <MenuItem value="">
                        <em>Select Language</em>
                      </MenuItem>
                      {allListOfLanguage.map((language) => (
                        <MenuItem key={language.id} value={language.id}>
                          {language.languageName}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.languageNameId && errors.languageNameId && (
                      <FormHelperText>{errors.languageNameId}</FormHelperText>
                    )}
                  </FormControl>
    
                  <FormControl
                    fullWidth
                    sx={{ gridColumn: "span 2" }}
                    error={!!touched.listening && !!errors.listening}
                  >
                    <InputLabel>Please Select Listening Level</InputLabel>
                    <Select
                      label="Listening Level"
                      value={values.listening}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="listening"
                    >
                      <MenuItem value="">
                        <em>Select Listening Level</em>
                      </MenuItem>
                      {validListeningLevels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.listening && errors.listening && (
                      <FormHelperText>{errors.listening}</FormHelperText>
                    )}
                  </FormControl>
    
                  <FormControl
                    fullWidth
                    sx={{ gridColumn: "span 2" }}
                    error={!!touched.reading && !!errors.reading}
                  >
                    <InputLabel>Please Select Reading Level</InputLabel>
                    <Select
                      label="Reading Level"
                      value={values.reading}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="reading"
                    >
                      <MenuItem value="">
                        <em>Select Reading Level</em>
                      </MenuItem>
                      {validReadingLevels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.reading && errors.reading && (
                      <FormHelperText>{errors.reading}</FormHelperText>
                    )}
                  </FormControl>
    
                  <FormControl
                    fullWidth
                    sx={{ gridColumn: "span 2" }}
                    error={!!touched.speaking && !!errors.speaking}
                  >
                    <InputLabel>Please Select Speaking Level</InputLabel>
                    <Select
                      label="Speaking Level"
                      value={values.speaking}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="speaking"
                    >
                      <MenuItem value="">
                        <em>Select Speaking Level</em>
                      </MenuItem>
                      {validSpeakingLevels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.speaking && errors.speaking && (
                      <FormHelperText>{errors.speaking}</FormHelperText>
                    )}
                  </FormControl>
    
                  <FormControl
                    fullWidth
                    sx={{ gridColumn: "span 2" }}
                    error={!!touched.writing && !!errors.writing}
                  >
                    <InputLabel>Please Select Writing Level</InputLabel>
                    <Select
                      label="Writing Level"
                      value={values.writing}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="writing"
                    >
                      <MenuItem value="">
                        <em>Select Writing Level</em>
                      </MenuItem>
                      {validWritingLevels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.writing && errors.writing && (
                      <FormHelperText>{errors.writing}</FormHelperText>
                    )}
                  </FormControl>
                </Box>
                <Box display="flex" justifyContent="center" mt="20px">
                  <Button type="submit" color="secondary" variant="contained">
                    Create Language
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
          <ListApplicantLanguage   applicantId={applicantId} />

        </Box>
      );
    };
export default CreateApplicantLanguage;
