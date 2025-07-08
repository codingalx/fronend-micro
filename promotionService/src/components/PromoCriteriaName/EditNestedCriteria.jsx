import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Box,
  Alert
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  fetchPromotionCriteriaNameById,
  updatePromotionCriteriaName,
  fetchAllPromotionCriteriaName, 
} from "../../Api/ApiPromo";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import NotPageHandle from "../common/NotPageHandle";
import Header from "../Header";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";



const promotionSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string()
});

const EditNestedCriteria = () => {
  const location = useLocation();
  const { criteriaNameId ,id  } = location.state || {};
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notification,setNotification] = useState({
    open:false,
    message:"",
    severity:"success"
  })
  const [criteriaData, setCriteriaData] = useState({
    name: "",
    description: "",
  });
  const [existingCriteriaNames, setExistingCriteriaNames] = useState([]); 

  useEffect(() => {
    
    loadData();
  }, []);
 

  const loadData = async () => {

    if (!criteriaNameId) {
      return <NotPageHandle message="No criteria selected for updation" navigateTo="/promotion/nestedcriteria" />;
      }
    try {
      const response = await fetchPromotionCriteriaNameById(
        tenantId,
        id
      );
      setCriteriaData({
        name: response.data.name,
        description: response.data.description,
      });

      const criteriaNamesResponse = await fetchAllPromotionCriteriaName(tenantId);
      setExistingCriteriaNames(criteriaNamesResponse.data.map((criteria) => criteria.name));

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
 
      setLoading(false);
    }
  };


  // Handle form submission
  const handleFormSubmit = async (values) => {
    try {
      const isNameExists = existingCriteriaNames.some(
        (name) => name === values.name && name !== criteriaData.name
      );

      if (isNameExists) {
        setNotification({
          open: true,
          message: "acriteria with this name already exist.",
          severity: "warning",
        }); 
        return;
      }

      await updatePromotionCriteriaName(tenantId, id, values);
      setNotification({
        open: true,
        message: "Criteria updated successfully!.",
        severity: "success",
      }); 
      setTimeout(() => navigate("/promotion/nestedcriteria", { 
        state: {  criteriaNameId } 
      }), 1500);    } catch (error) {
      console.error("Error updating criteria:", error);
      setNotification({
        open: true,
        message: "Error updating criteria.",
        severity: "error",
      }); 
    }
  };

  if (!criteriaNameId) {
    return <NotPageHandle message="No criteria selected for updation" navigateTo="/promotion/criteria_name" />;
  }

  const handleCloseSnackbar = () => {
    setNotification(false);
  };

  return (
    <>
    <Box display="flex" justifyContent="flex-end" mb={2} mr={15}>
    <IconButton
      aria-label="back"
      color="primary"
      onClick={() => navigate('promotion/criteria_name',{
        state: {  criteriaNameId } 

      })}
    >
      <ArrowBackIcon />
    </IconButton>
  </Box>
    <Container maxWidth="sm" sx={{ mt: 4 }}>
           <Header subtitle= " Update Criteria" />       

      {loading ? (
        <CircularProgress />
      ) : (
          <Formik
            initialValues={criteriaData}
            validationSchema={promotionSchema}
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
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": { gridColumn: "span 4" },
                  }}
                >
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    margin="normal"
                    sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.description && !!errors.description}
                    helperText={touched.description && errors.description}
                    margin="normal"
                    sx={{ gridColumn: "span 4" }}
                    multiline
                    rows={4}
                  />
                </Box>
                <Box display="flex" justifyContent="center" mt="20px">
                               <Button type="submit" color="secondary" variant="contained">
                                   Update
                                 </Button>
                               </Box>
              </form>
            )}
          </Formik>
      )}
        <Snackbar
                 open={notification.open}
                 autoHideDuration={6000}
                 onClose={handleCloseSnackbar}
                 anchorOrigin={{ vertical: "top", horizontal: "right" }}
               >
                 <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
                   {notification.message}
                 </Alert>
               </Snackbar>
    </Container>

    </> 
  );
};

export default EditNestedCriteria;