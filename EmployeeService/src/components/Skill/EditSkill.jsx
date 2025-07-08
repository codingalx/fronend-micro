
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../common/Header";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { getSkillById,updateSkill } from "../../Api/employeeApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 
import NotFoundHandle from "../common/NotFoundHandle";




const EditSkill = () => {
  const location = useLocation();
  const { employerId  } = location.state || {}
  const skillId =location?.state?.id || {}

  if (!(skillId && employerId)) {
    return <NotFoundHandle message="No employee skill selected for  updation." navigateTo="/employee/list" />;
  }


      const [authState] = useAtom(authAtom); // Access the shared authentication state
      const tenantId = authState.tenantId
  
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  
  const [skill, setSkill] = useState({  
    skillType: "",
    skillLevel: "",
    description: "",
});


  useEffect(() => {
    fetchSkill();
  }, []);

  const fetchSkill = async () => {
    try {
      const response = await getSkillById(tenantId,employerId,skillId);
      const data = response.data; 
      setSkill(data);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch skill:", error.message);
    }
  };
  

  const handleFormSubmit = async (values) => {
    try {
      const response = await updateSkill(tenantId,employerId, skillId, values);
      const id =employerId ;
      if (response.status === 200) {
        navigate('/employee/editDetails', { state: { id, isEditable: true,activeTab: 1 } }); // Navigate to "Skill" tab

      } else {
        console.error('Error updating skill. Status code:', response.status);
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
    skillType: yup.string().required("Skill type is required"),
    skillLevel: yup.string().required("Skill level is required"),
    description: yup.string().required("description of the Skill is required"),
    
  });

  return (
    <Box m="20px">
      <Header  subtitle="Edit Skill of Employer" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={skill}
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
              <TextField
                fullWidth
                type="text"
                label="Skill Type"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.skillType}
                name="skillType"
                error={!!touched.skillType && !!errors.skillType}
                helperText={touched.skillType && errors.skillType}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="text"
                label="Skill level"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.skillLevel}
                name="skillLevel"
                error={!!touched.skillLevel && !!errors.skillLevel}
                helperText={touched.skillLevel && errors.skillLevel}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update Skill
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default EditSkill;
