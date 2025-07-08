import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel 
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Formik } from "formik";
import { getFamilyById,updateFamily } from "../../Api/employeeApi";
import Header from "../common/Header";
import { useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import NotFoundHandle from "../common/NotFoundHandle";


const EditFamily = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();

  const { employerId  } = location.state || {}
  const familyId =location?.state?.id || {}
     const [authState] = useAtom(authAtom); // Access the shared authentication state
        const tenantId = authState.tenantId

  const [family, setFamily] = useState({ 
    relationshipType: "",
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    houseNumber: "",
    homeTelephone: "",
    officeTelephone: "",
    mobileNumber: "",
    email: "",
    poBox: "",
    emergencyContact: false
  });
  
  useEffect(() => {
    fetchFamily();
  }, []);

  const fetchFamily = async () => {
    try {
      const response = await getFamilyById(tenantId,employerId,familyId);
      const data = response.data; 
       if (data.gender) {
        data.gender = data.gender.toUpperCase();
        data.relationshipType = data.relationshipType.toUpperCase();
      }
      setFamily(data);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch language:", error.message);
    }
  };
  
 
  const handleFormSubmit = async (values) => {
    try {
      const response = await updateFamily(tenantId,employerId, familyId, values);
      const id =employerId ;

      if (response.status === 200) {
        navigate('/employee/editDetails', { state: { id, isEditable: true,activeTab: 4 } }); 
      } else {
        console.error('Error updating langugae. Status code:', response.status);
      }
    } catch (error) {
      if (error.response) {
        console.error('Server responded with an error:', error.response.data);
      } else {
        console.error('An error occurred while updating the skill:', error.message);
      }
    }
  };


  const checkoutSchema = yup.object().shape({
    relationshipType: yup.string().required("Relationship is required"),
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    middleName: yup.string().required("Middle name is required"),
    dateOfBirth: yup.string().required("dateOfBirth is required"),
    gender: yup.string().required("gender is required"),
    emergencyContact: yup.string().required("gender is required"),
    mobileNumber: yup.string()
    .matches(/^\d{10}$/, "Invalid mobile number") // Add validation for mobile number
    .required("Mobile number is required"),
});

 
if (!(familyId && employerId)) {
  return <NotFoundHandle message="No employee family selected for  updation." navigateTo="/employee/list" />;
}

  return (
    <Box m="20px">
      <Header
        subtitle="Update Family of employer"
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={family}
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
              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>   
                <InputLabel>Please Select Relationship Type</InputLabel>
                <Select
                label="relationshipType"
                value={values.relationshipType}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                required
                displayEmpty
                inputProps={{ "aria-label": "relationship Type" }}
                name="relationshipType"
                error={!!touched.relationshipType && !!errors.relationshipType}
                sx={{ gridColumn: "span 2" }}
              >
      
               <MenuItem value="PARENT">Parent</MenuItem>
                 <MenuItem value="CHILD">Child</MenuItem>
                 <MenuItem value="SIBLING">Sibling</MenuItem>
                 <MenuItem value="GRANDPARENT">Grand Parent</MenuItem>
                 <MenuItem value="GRANDCHILD">Grand Child</MenuItem>
                 <MenuItem value="AUNT">Aunt</MenuItem>
                 <MenuItem value="UNCLE">Uncle</MenuItem>
                 <MenuItem value="NIECE">Niece</MenuItem>
                 <MenuItem value="NEPHEW">nephew</MenuItem>
                 <MenuItem value="COUSIN">Cousin</MenuItem>
                 <MenuItem value="SPOUSE">Spouse</MenuItem>
                 <MenuItem value="PARTNER">Partner</MenuItem>
                 <MenuItem value="IN_LAW">In law</MenuItem>
                 <MenuItem value="STEP_PARENT">Step Parent</MenuItem>
                 <MenuItem value="STEP_CHILD">Step child</MenuItem>
                 <MenuItem value="STEP_SIBLING">Step sibilings</MenuItem>
                 <MenuItem value="GUARDIAN">Guardian</MenuItem>

                 <MenuItem value="FOSTER_PARENT">Foster parent</MenuItem>
                 <MenuItem value="FOSTER_CHILD">Foster child</MenuItem>
                 <MenuItem value="ADOPTIVE_PARENT">Adoptive</MenuItem>
                 <MenuItem value="ADOPTED_CHILD">Apopted child</MenuItem>
                

                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="text"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Middle Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.middleName}
                name="middleName"
                error={!!touched.middleName && !!errors.middleName}
                helperText={touched.middleName && errors.middleName}
                sx={{ gridColumn: "span 2" }}
              />
              
              <TextField
                fullWidth
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.em}
                sx={{ gridColumn: "span 2" }}
              />

               <TextField
                fullWidth
                type="text"
                label="House Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.houseNumber}
                name="houseNumber"
                error={!!touched.houseNumber && !!errors.houseNumber}
                helperText={touched.houseNumber && errors.houseNumber}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Home Telephone"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.homeTelephone}
                name="homeTelephone"
                error={!!touched.homeTelephone && !!errors.homeTelephone}
                helperText={touched.homeTelephone && errors.homeTelephone}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Office Telephone"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.officeTelephone}
                name="officeTelephone"
                error={!!touched.officeTelephone && !!errors.officeTelephone}
                helperText={touched.officeTelephone && errors.officeTelephone}
                sx={{ gridColumn: "span 2" }}
              />
               <TextField
                fullWidth
                type="number"
                label="Mobile Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.mobileNumber}
                name="mobileNumber"
                error={!!touched.mobileNumber && !!errors.mobileNumber}
                helperText={touched.mobileNumber && errors.mobileNumber}
                sx={{ gridColumn: "span 2" }}
              />
                <TextField
                fullWidth
                type="email"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="poBox"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.poBox}
                name="poBox"
                error={!!touched.poBox && !!errors.poBox}
                helperText={touched.poBox && errors.poBox}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="date"
                label="Birth Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dateOfBirth}
                name="dateOfBirth"
                error={touched.dateOfBirth && !!errors.dateOfBirth}
                helperText={touched.dateOfBirth && errors.dateOfBirth}
                sx={{ gridColumn: "span 1" }}
              />
              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>   
                <InputLabel>Please Select Gender</InputLabel>
                <Select
               label="Gender"
               value={values.gender}
               onChange={handleChange}
               onBlur={handleBlur}
               required
               displayEmpty
               inputProps={{ "aria-label": "gender" }}
               error={!!touched.gender && !!errors.gender}
               name="gender"
               sx={{ gridColumn: "span 1" }}
              > 
               <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
                </Select>
              </FormControl>

             
            
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.emergencyContact}
                    onChange={handleChange}
                    
                    name="emergencyContact"
                  />
                }
                label="Emergency Contact"
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update Family
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default EditFamily;
