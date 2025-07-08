import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Autocomplete
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import Header from "../common/Header";
import { createEducationOpportunity, getAllQualification, getEmployeeByEmployeId, listAllCountry, listEducationLevels, listOfBudgetYears,  } from "../../../configuration/TrainingApi";
import ToolbarComponent from "../TrainingCourse/ToolbarComponent";
import { useEffect, useState } from "react";
import { useIds } from "../../context/IdContext";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';
import ListEducationOpportunity from "./ListEducationOpportunity";


const CreateEducationOpportunity = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const { employeeIds = [] } = useIds() || {};

  const [educationLevels, setEducationLevels] = useState([]);
     const [authState] = useAtom(authAtom);
      const tenantId = authState.tenantId
      const [refreshKey, setRefreshKey] = useState(0);
  


  const [allbudgetYearList, setAllbudgeYeartList] = useState([]);
  const [allqualificationList, setAllqualificationList] = useState([]);

  const [allCountries, setAllCountries] = useState([]);

  useEffect(() => {
    fetchCountries();
  }, []);

   const fetchCountries = async () => {
     try {
       const response = await listAllCountry(tenantId);
       setAllCountries(response.data);
     } catch (error) {
       setNotification({ open: true, message: "Failed fetch the Country Name c. Please try again.", severity: "error" });
     }
   };


  useEffect(() => {
    fetchBudgetYears();
    fetchEducationLevel();
    fetchQualifications();
  }, []);

  useEffect(() => {
    if (employeeDetails && employeeDetails.employeeId) {
      fetchEmployeeDetails(employeeDetails.employeeId);
    }
  }, [employeeDetails]);

  const fetchEmployeeDetails = async (employeeId) => {
    try {
      const response = await getEmployeeByEmployeId(tenantId,employeeId);
      console.log(response);
      
      // No need to check for response.ok since axios handles errors
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // With axios, the response is already parsed as JSON
      const data = response.data;
      setEmployeeDetails(data);
      console.log("Employee Details:", data);
    } catch (error) {
      console.error("Failed to fetch employee details:", error);
    }
  };

  const fetchBudgetYears = async () => {
    try {
        const response = await listOfBudgetYears(tenantId);
        setAllbudgeYeartList(response.data);
        console.log("The list of budget year:", response.data);
    } catch (error) {
        console.error("Error fetching budget years:", error);
    }
};

  const fetchQualifications = async () => {
    try {
      const response = await getAllQualification(tenantId);
      setAllqualificationList(response.data);
      console.log("The list of Qualification :", response.data);
    } catch (error) {
      console.error("Error fetching qualification:", error);
    }
  };


  const fetchEducationLevel = async () => {
    try {
      const response = await listEducationLevels(tenantId);
      setEducationLevels(response.data);
      console.log(response.data); // Optional: log the data to the console
    } catch (error) {
      console.error('Error fetching education levels:', error.message);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      await createEducationOpportunity(tenantId,values);
      console.log("Form data submitted successfully!");
      resetForm(); // Reset form after successful submission
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to submit form data:", error);
    }
  };

  const handleIconClick = () => {
    navigate('/training/listeducationOpportunity');
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const initialValues = {
    employeeId: "",
    budgetYearId: "",
    educationLevelId: "",
    qualificationId: "",
    countryId: "",
    trainingLocation: "",
    sponsor: "",
    institution: "",
    startDate: "",
    endDate: "",
    letterDate: "",
    letterReferenceNumber: "",
    remark: "",
    totalResult: ""
  };

  const checkoutSchema = yup.object().shape({
    budgetYearId: yup
      .string()
      .required("Budget year  cannot be null"),
      countryId: yup
      .string()
      .required("country name cannot be null"),
    trainingLocation: yup
    .string()
      .required("Training location cannot be null"),
  
    educationLevelId: yup
    .string()
      .required("Education level id cannot be null"),
    qualificationId: yup
    .string()
      .required("Qualification id cannot be null"),
    sponsor: yup
      .string()
      .required("Sponsor cannot be blank"),
    institution: yup
      .string()
      .required("Institution cannot be blank"),
    startDate: yup
      .date()
      .nullable()
      .required("Start date cannot be null")
      .min(new Date(), "Start date must be in future or present"),
    endDate: yup
      .date()
      .nullable()
      .required("End date cannot be null")
      .min(
        yup.ref('startDate'),
        "End date must be after or the same day as start date"
      ),
    letterDate: yup
      .date()
      .nullable()
      .required("Letter date cannot be null")
      .max(new Date(), "Letter date must be in past or present"),
    letterReferenceNumber: yup
      .string()
      .required("Letter reference number cannot be blank"),
    remark: yup
      .string(),
    employeeId: yup
    .string()
      .required("Employee id cannot be null"),
    totalResult: yup
      .number()
      .required("Total result cannot be null"),
  });

  return (
    <Box m="20px">
      <ToolbarComponent
        mainIconType="search"
        onMainIconClick={handleIconClick}
        refreshPage={refreshPage}
      />
      <Header subtitle="Create Education Opportunity" />

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
          resetForm,
          setFieldValue,
        }) =>
          
          
          (
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
                <Autocomplete
                  freeSolo
                  options={employeeIds}
                  onChange={(event, value) =>
                    setFieldValue("employeeId", value)
                  }
                  onInputChange={(event, value) =>
                    setFieldValue("employeeId", value)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="EmployeeId"
                      onBlur={handleBlur}
                      name="employeeId"
                      error={!!touched.employeeId && !!errors.employeeId}
                      helperText={touched.employeeId && errors.employeeId}
                    />
                  )}
                />
              </FormControl>

              
              <FormControl
                sx={{ gridColumn: "span 2" }}
                error={!!touched.qualificationId && !!errors.qualificationId}
              >
                <InputLabel id="qualification-label">Select Qualification</InputLabel>
                <Select
                  labelId="qualification-label"
                  value={values.qualificationId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="qualificationId"
                >
                  <MenuItem value="">
                    <em>Select Qualification</em>
                  </MenuItem>
                  {allqualificationList.map((qualification) => (
                    <MenuItem key={qualification.id} value={qualification.id}>
                      {qualification.qualification}
                    </MenuItem>
                  ))}
                </Select>
                {touched.qualificationId && errors.qualificationId && (
                  <FormHelperText>{errors.qualificationId}</FormHelperText>
                )}
              </FormControl>


              <FormControl
                sx={{ gridColumn: "span 2" }}
                error={!!touched.budgetYearId && !!errors.budgetYearId}
              >
                <InputLabel id="language-label">Select Budget Year</InputLabel>
                <Select
                  labelId="language-label"
                  value={values.budgetYearId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="budgetYearId"
                >
                  <MenuItem value="">
                    <em>Select Budget Year</em>
                  </MenuItem>
                  {allbudgetYearList.map((budget) => (
                    <MenuItem key={budget.id} value={budget.id}>
                      {budget.budgetYear}
                    </MenuItem>
                  ))}
                </Select>
                {touched.budgetYearId && errors.budgetYearId && (
                  <FormHelperText>{errors.budgetYearId}</FormHelperText>
                )}
              </FormControl>

              <FormControl  sx={{ gridColumn: "span 2" }}>
              <InputLabel id="fieldOfStudy">Education Level</InputLabel>
                <Select
                  labelId="educationLevel"
                  value={values.educationLevelId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  name="educationLevelId"
                  error={!!touched.educationLevelId && !!errors.educationLevelId}
                >
                  <MenuItem value="">
                    <em>Select Education Level</em>
                  </MenuItem>
                  {educationLevels.map((educationLevel) => (
                    <MenuItem key={educationLevel.id} value={educationLevel.id}>
                      {educationLevel.educationLevelName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="date"
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
                type="date"
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

              <TextField
                fullWidth
                type="date"
                label="Letter Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.letterDate}
                name="letterDate"
                error={!!touched.letterDate && !!errors.letterDate}
                helperText={touched.letterDate && errors.letterDate}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />

              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>


                <InputLabel> Choose Training Location</InputLabel>
                <Select
                  label="trainingLocation"
                  value={values.trainingLocation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "trainingLocation" }}
                  name="trainingLocation"
                  error={
                    !!touched.trainingLocation && !!errors.trainingLocation
                  }
                >

                  <MenuItem value="LOCAL">Local</MenuItem>
                  <MenuItem value="ABROAD">Abroad</MenuItem>
                 
                </Select>
                {touched.trainingLocation && errors.trainingLocation && (
                  <FormHelperText error>
                    {errors.trainingLocation}
                  </FormHelperText>
                )}
              </FormControl>

               <FormControl
                             sx={{ gridColumn: "span 2" }}
                             error={!!touched.countryId && !!errors.countryId}
                           >
                             <InputLabel id="country-label">Select Country</InputLabel>
                             <Select
                               labelId="country-label"
                               value={values.countryId}
                               onChange={handleChange}
                               onBlur={handleBlur}
                               name="countryId"
                             >
                               <MenuItem value="">
                                 <em>Select Country</em>
                               </MenuItem>
                               {allCountries.map((country) => (
                                 <MenuItem key={country.id} value={country.id}>
                                   {country.name}
                                 </MenuItem>
                               ))}
                             </Select>
                             {touched.countryId && errors.countryId && (
                               <FormHelperText>{errors.countryId}</FormHelperText>
                             )}
               </FormControl>
             

              
              <TextField
                fullWidth
                type="text"
                label="Institution"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.institution}
                name="institution"
                error={!!touched.institution && !!errors.institution}
                helperText={touched.institution && errors.institution}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />
               <TextField
                fullWidth
                type="text"
                label="sponsor"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.sponsor}
                name="sponsor"
                error={!!touched.sponsor && !!errors.sponsor}
                helperText={touched.sponsor && errors.sponsor}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />

             <TextField
                fullWidth
                type="text"
                label="letterReferenceNumber"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.letterReferenceNumber}
                name="letterReferenceNumber"
                error={!!touched.letterReferenceNumber && !!errors.letterReferenceNumber}
                helperText={touched.letterReferenceNumber && errors.letterReferenceNumber}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />

             <TextField
                fullWidth
                type="text"
                label="totalResult"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.totalResult}
                name="totalResult"
                error={!!touched.totalResult && !!errors.totalResult}
                helperText={touched.totalResult && errors.totalResult}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                type="text"
                label="remark"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.remark}
                name="remark"
                error={!!touched.remark && !!errors.remark}
                helperText={touched.remark && errors.remark}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />



            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Submit
              </Button>
              <Button
                type="button"
                color="primary"
                variant="contained"
                onClick={() => resetForm()}
                style={{ marginLeft: '10px' }}
              >
                Reset
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <ListEducationOpportunity  refreshKey={refreshKey} />
    </Box>
  );
};

export default CreateEducationOpportunity;
