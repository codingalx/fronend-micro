
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import Header from "../common/Header";
import ToolbarComponent from "../common/ToolbarComponent";
import { editRecruitment, getEmployeeByEmployeId, getRecruitmentbyId } from "../../../configuration/RecruitmentApp";
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import { useIds } from './IdContext';




const EditRecruitment = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const recruitmentId = location?.state?.id;
  const requesterEmployeeId = location?.state?.requesterEmployeeId;
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId
  const { employeeIds = [] } = useIds() || {};



  const [employee, setEmployee] = useState({});
  const [recruitment, setRecruitment] = useState({
    requesterEmployeeId: "",
    departmentId: "",
    numberOfEmployeesRequested: "",
    recruitmentType: "",
    recruitmentMode: "",
    remark: "",
  });

  const [requesterInfo, setRequesterInfo] = useState({
    fullName: "",
    employeeId: ""
  });

  useEffect(() => {
    fetchRecruitment();
    fetchEmployee();
  }, []);

  const fetchRecruitment = async () => {
    try {
      const response = await getRecruitmentbyId(tenantId,recruitmentId);
      const data = response.data;
      setRecruitment({
        ...data,
        recruitmentMode: data.recruitmentMode.toUpperCase(),
        recruitmentType: data.recruitmentType.toUpperCase(),
        requesterEmployeeId: data.requesterEmployeeId,
      });
    } catch (error) {
      console.error("Failed to fetch recruitment:", error.message);
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await getEmployeeByEmployeId(tenantId,requesterEmployeeId);
      const data = response.data;

      setEmployee(data);

    
      setRequesterInfo({
        fullName: `${data.firstName} ${data.middleName} ${data.lastName}`,
        employeeId: data.employeeId,
        
      });
    } catch (error) {
      console.error("Failed to fetch employee:", error.message);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      const response = await editRecruitment(tenantId,recruitmentId, values);
      
      if (response.status === 200) {
        console.log('Recruitment updated successfully!');
        navigate('/recruitment/list', { state: { recruitmentId } });
      } else {
        console.error('Error updating recruitment. Status code:', response.status);
      }
    } catch (error) {
      if (error.response) {
        console.error('Server responded with an error:', error.response.data);
      } else {
        console.error('An error occurred while updating the recruitment:', error.message);
      }
    }
  };

  const checkoutSchema = yup.object().shape({
    requesterEmployeeId: yup
      .string()
      .required('Requester ID is required'),
    numberOfEmployeesRequested: yup
      .string()
      .required("Number of Employees Requested is required"),
    recruitmentType: yup
      .string()
      .required("Recruitment Type is required"),
    recruitmentMode: yup
      .string()
      .required("Recruitment Mode is required"),
    remark: yup
      .string()
      .required("Remark is required"),
  });

  const handleIconClick = () => {
    navigate('/recruitment/list');
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <Box>
      <ToolbarComponent
        mainIconType="search"
        onMainIconClick={handleIconClick}
        refreshPage={refreshPage}
      />
      <Header subtitle="Update the recruitment" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={recruitment}
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
              {/* Display requester's full name and employeeId */}
              <TextField
                fullWidth
                type="text"
                label="Full Name"
                value={requesterInfo.fullName}
                name="fullName"
                disabled
                sx={{ gridColumn: "span 2" }}
              />
        
                <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel>Requester ID</InputLabel>
              <Select
                  label="requesterEmployeeId"
                  value={values.requesterEmployeeId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "requesterEmployeeId" }}
                  name="requesterEmployeeId"
                  error={!!touched.requesterEmployeeId && !!errors.requesterEmployeeId}
                  helperText={touched.requesterEmployeeId && errors.requesterEmployeeId}
                >
                 {employeeIds.map((id) => (
                <MenuItem key={id} value={id}>
                  {id}
                </MenuItem>
                
              ))}
                </Select>
              </FormControl>
{/* 

              

              {/* Other form fields */}
              <TextField
                fullWidth
                type="number"
                label="Number of Employees Requested"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.numberOfEmployeesRequested}
                name="numberOfEmployeesRequested"
                error={!!touched.numberOfEmployeesRequested && !!errors.numberOfEmployeesRequested}
                helperText={touched.numberOfEmployeesRequested && errors.numberOfEmployeesRequested}
                sx={{ gridColumn: "span 2" }}
              />

              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel>Please Select Recruitment Type</InputLabel>
                <Select
                  label="Recruitment Type"
                  value={values.recruitmentType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="recruitmentType"
                  error={!!touched.recruitmentType && !!errors.recruitmentType}
                >
                  <MenuItem value="PERMANENT">PERMANENT</MenuItem>
                  <MenuItem value="CONTRACT">CONTRACT</MenuItem>
                  <MenuItem value="TEMPORARY">TEMPORARY</MenuItem>
                  <MenuItem value="OTHER">OTHER</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel>Please Select Recruitment Mode</InputLabel>
                <Select
                  label="Recruitment Mode"
                  value={values.recruitmentMode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="recruitmentMode"
                  error={!!touched.recruitmentMode && !!errors.recruitmentMode}
                >
                  <MenuItem value="INTERNAL">INTERNAL</MenuItem>
                  <MenuItem value="EXTERNAL">EXTERNAL</MenuItem>
                  <MenuItem value="TRANSFER">TRANSFER</MenuItem>
                  <MenuItem value="OTHER">OTHER</MenuItem>
                </Select>
              </FormControl>

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
              <Button type="submit" color="secondary" variant="contained">
                Edit Recruitment
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default EditRecruitment;









