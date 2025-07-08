import {
    Box,
    Button,
    TextField,
    FormControl,
    Autocomplete,
  } from "@mui/material";
  import * as yup from "yup";
  import useMediaQuery from "@mui/material/useMediaQuery";
  import { useNavigate } from "react-router-dom";
  import { Formik } from "formik";
  import Header  from "../common/Header";
  import { useIds } from "../../context/IdContext";
  import { useState, useEffect } from "react";
  import { useLocation } from "react-router-dom";
  import { getEmployeeByEmployeId,
    getTrainingParticipantsById,
    updateTrainingPaercipants, } from "../../../configuration/TrainingApi";
     import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';


  
  const UpdateTrainingParticipants = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const navigate = useNavigate();
    const { employeeIds } = useIds();
    const location = useLocation();
    const { trainingId } = location.state;
    const participantId = location?.state?.id;  
      const [authState] = useAtom(authAtom);
      const tenantId = authState.tenantId

    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [trainingParticipants, setTrainingParticipants] = useState({
      participantEmployeeId: "",
      reason: "",
      searchBy: "",
      firstName: "",
      middleName: "",
      lastName: "",
    });
  
    useEffect(() => {
      fetchTrainingParticipants();
    }, []);
  
    const fetchTrainingParticipants = async () => {
      try {
        const response = await getTrainingParticipantsById(tenantId,trainingId, participantId);
        const data = response.data;
        setTrainingParticipants({
          ...data,
          participantEmployeeId: data.employeeId, // Make sure this matches your data structure
        });
        console.log("Fetched Participant Data:", data);
      } catch (error) {
        console.error("Failed to fetch Training Participants:", error.message);
      }
    };
  
    const fetchEmployeeDetails = async (employeeId) => {
      try {
        const response = await getEmployeeByEmployeId(tenantId,employeeId)
        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        // With axios, the response is already parsed as JSON
        const data = response.data;
        setEmployeeDetails(data);
      } catch (error) {
        console.error("Failed to fetch employee details:", error);
      }
    };
  
  
    const handleFormSubmit = async (values, { resetForm }) => {
      try {
        await updateTrainingPaercipants(tenantId,trainingId,participantId ,values);
        console.log("The participant trainer is successfully created");
        navigate('/training/trainingparticipant', { state: { trainingId } });

        resetForm();
      } catch (error) {
        console.error("Failed to submit form data:", error);
      }
    };
  
    const checkoutSchema = yup.object().shape({
      participantEmployeeId: yup
        .string()
        .required("Requester ID is required")
        .test("is-valid", "Requester ID does not exist", (value) =>
          employeeIds.includes(value)
        ),
      reason: yup.string().required("Remark is required"),
    });
  
    return (
      <Box m="20px">
     
        <Header subtitle="Update Participant of Training" />
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={trainingParticipants}
          validationSchema={checkoutSchema}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            setFieldValue,
            handleSubmit,
          }) => {
            useEffect(() => {
              if (values.participantEmployeeId) {
                fetchEmployeeDetails(values.participantEmployeeId);
              }
            }, [values.participantEmployeeId]);
  
            useEffect(() => {
              if (employeeDetails) {
                setFieldValue("firstName", employeeDetails.firstName);
                setFieldValue("middleName", employeeDetails.middleName);
                setFieldValue("lastName", employeeDetails.lastName);
              }
            }, [employeeDetails, setFieldValue]);
  
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
                    <Autocomplete
                      freeSolo
                      options={employeeIds}
                      value={values.participantEmployeeId || ""}
                      onChange={(event, value) =>
                        setFieldValue("participantEmployeeId", value)
                      }
                      onInputChange={(event, value) =>
                        setFieldValue("participantEmployeeId", value)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Employee ID"
                          onBlur={handleBlur}
                          name="participantEmployeeId"
                          error={
                            !!touched.participantEmployeeId &&
                            !!errors.participantEmployeeId
                          }
                          helperText={
                            touched.participantEmployeeId &&
                            errors.participantEmployeeId
                          }
                        />
                      )}
                    />
                  </FormControl>
  
                  <TextField
                    fullWidth
                    type="text"
                    label="Trainer First Name"
                    value={values.firstName}
                    name="firstName"
                    disabled
                    InputLabelProps={{
                      shrink: !!values.firstName,
                    }}
                    sx={{ gridColumn: "span 2" }}
                  />
  
                  <TextField
                    fullWidth
                    type="text"
                    label="Trainer Middle Name"
                    value={values.middleName}
                    name="middleName"
                    disabled
                    InputLabelProps={{
                      shrink: !!values.middleName,
                    }}
                    sx={{ gridColumn: "span 2" }}
                  />
  
                  <TextField
                    fullWidth
                    type="text"
                    label="Trainer Last Name"
                    value={values.lastName}
                    name="lastName"
                    disabled
                    InputLabelProps={{
                      shrink: !!values.lastName,
                    }}
                    sx={{ gridColumn: "span 2" }}
                  />
  
                  <TextField
                    fullWidth
                    type="text"
                    label="Reason"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.reason}
                    name="reason"
                    error={!!touched.reason && !!errors.reason}
                    helperText={touched.reason && errors.reason}
                    sx={{ gridColumn: "span 2" }}
                  />
                </Box>
                <Box display="flex" justifyContent="center" mt="20px">
                  <Button type="submit" color="primary" variant="contained">
                    Update Participant
                  </Button>
                </Box>
              </form>
            );
          }}
        </Formik>
      </Box>
    );
  };
  
  export default UpdateTrainingParticipants;