import {
    Box,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem
  } from "@mui/material";
  import * as yup from "yup";
  import useMediaQuery from "@mui/material/useMediaQuery";
  import { useNavigate } from "react-router-dom";
  import { Formik } from "formik";
  import Header from "../common/Header";
  import {
    assignInternStudentStatus,
  } from "../../../configuration/TrainingApi";
  import { useLocation } from "react-router-dom";
  import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom';

  
  const InternStudentStatus = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const navigate = useNavigate();
    const location = useLocation();
    const interStudentId = location?.state?.id;
        const [authState] = useAtom(authAtom);
        const tenantId = authState.tenantId
  
    const initialValues = {
      internshipStatus: "",
    };
  
    const handleFormSubmit = async (values) => {
      try {
        await assignInternStudentStatus(tenantId,interStudentId, values.internshipStatus);
        navigate("/training/internstudent");
        console.log("Form data submitted successfully!");
      } catch (error) {
        console.error("Failed to submit form data:", error);
      }
    };
  
    const checkoutSchema = yup.object().shape({
      internshipStatus: yup.string().required("Internship status cannot be null"),
    });
  
    return (
      <Box m="20px">
        <Header subtitle="Assign Department for Students" />
  
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
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
                <FormControl
                  fullWidth
                  sx={{ gridColumn: "span 2" }}
                  error={!!touched.internshipStatus && !!errors.internshipStatus}
                >
                  <InputLabel id="internshipStatus">Internship Status</InputLabel>
                  <Select
                    labelId="internshipStatus"
                    value={values.internshipStatus}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    displayEmpty
                    inputProps={{ "aria-label": "internshipStatus" }}
                    name="internshipStatus"
                    error={!!touched.internshipStatus && !!errors.internshipStatus}
                  >
                    <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                    <MenuItem value="COMPLETED">Completed</MenuItem>
                    <MenuItem value="INCOMPLETE">Incomplete</MenuItem>
                  </Select>
                  {touched.internshipStatus && errors.internshipStatus && (
                    <p style={{ color: 'red' }}>{errors.internshipStatus}</p>
                  )}
                </FormControl>
              </Box>
              <Box display="flex" justifyContent="center" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Submit
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    );
  };
  
  export default InternStudentStatus;
  