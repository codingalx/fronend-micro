import {
  Box,
  Button,
  TextField,
  FormControl,
  Autocomplete,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import Header from "../common/Header";
import {  createPreServiceTraineeResult, listCourseType, listPreServiceTraining } from "../../../configuration/TrainingApi";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import ListPreCourseTraineeResult from "./ListPreCourseTraineeResult";



const CreatePreServiceTraineeResult = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const { traineeId  } = location.state;
  const courseId =location?.state?.id
  const [authState] = useAtom(authAtom);
   const tenantId = authState.tenantId;
     const [refreshKey, setRefreshKey] = useState(0);
   

  const [TraineeDetails, setTraineeDetails] = useState(null);
  const [CourseDetails, setCourseDetails] = useState(null);


 



  useEffect(() => {
    fetchTrainee();
    fetchCourse();
  }, []);

  const fetchTrainee = async () => {
    try {
      const response = await listPreServiceTraining(tenantId);
      const data = response.data;
      setTraineeDetails(data);
      console.log(data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  
  useEffect(() => {
    fetchTrainee();
  }, []);

  const fetchCourse = async () => {
    try {
      const response = await listCourseType(tenantId);
      const data = response.data;
      setCourseDetails(data);
      console.log(data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };



  



  const handleFormSubmit = async (values) => {
    try {
      console.log("Form data:", values);
      await createPreServiceTraineeResult(tenantId,traineeId,courseId ,values);

      navigate('/training/listPreCourseTraineeResult', { state: { courseId} });
      setRefreshKey(prev => prev + 1);      
    } catch (error) {
      console.error("Failed to submit form data:", error);
    }
  };
 
 


  const initialValues = {
    startDate: "",
    endDate: "",
    semester: "",
    result: "",
    decision: "",
    remark: "",
    
  };

  const checkoutSchema = yup.object().shape({
    semester: yup.string().required("Semester  is required"),
    result: yup.string().required("Result for Each Course is required"),
    decision: yup.string().required("decision for Each Course is required"),
    startDate: yup.date().required("Start Date is required").max(new Date(), "Start date must be in the past or present"),
    endDate: yup.date().required("End Date is required").max(new Date(), "End date must be in the past or present"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create Pre Trainee Result  " />

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
        }) => 
          {
      
          useEffect(() => {
           
          }, []);


        
          return (
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
                  <InputLabel>Choose Semester</InputLabel>
                  <Select
                    label="Semester"
                    value={values.semester}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    displayEmpty
                    inputProps={{ "aria-label": "semester" }}
                    name="semester"
                    error={
                      !!touched.decision && !!errors.semester
                    }
                  >
     
                    <MenuItem value="I">I</MenuItem>
                    <MenuItem value="II">II</MenuItem>
                    <MenuItem value="III">III</MenuItem>
                    <MenuItem value="IV">IV</MenuItem>

                  </Select>
                  {touched.semester && errors.semester && (
                    <FormHelperText error>
                      {errors.semester}
                    </FormHelperText>
                  )}
                </FormControl>


                <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                  <InputLabel>Decision</InputLabel>
                  <Select
                    label="Decision"
                    value={values.decision}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    displayEmpty
                    inputProps={{ "aria-label": "decision" }}
                    name="decision"
                    error={
                      !!touched.decision && !!errors.decision
                    }
                  >
                 
                    <MenuItem value="PASSED">Passed</MenuItem>
                    <MenuItem value="FAILED">Failed</MenuItem>
                  </Select>
                  {touched.decision && errors.decision && (
                    <FormHelperText error>
                      {errors.decision}
                    </FormHelperText>
                  )}
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
                  type="number"
                  label="Result"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.result}
                  name="result"
                  error={!!touched.result && !!errors.result}
                  helperText={touched.result && errors.remark}
                  sx={{ gridColumn: "span 2" }}
                />

                <TextField
                  fullWidth
                  type="text"
                  label="Remark"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.remark}
                  name="remark"
                  error={!!touched.remark && !!errors.remark}
                  helperText={touched.remark && errors.remark}
                  sx={{ gridColumn: "span 2" }}
                />
              
             
              </Box>
              <Box display="flex" justifyContent="center" mt="20px">
                <Button type="submit" color="primary" variant="contained">
                  Add PreTrainee Course Result
                </Button>
              </Box>
            </form>
          );
        }}
      </Formik>
       <ListPreCourseTraineeResult refreshKey={refreshKey} />
    </Box>
  );
};

export default CreatePreServiceTraineeResult;
