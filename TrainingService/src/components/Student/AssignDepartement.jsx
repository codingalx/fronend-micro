import {
    Box,
    Button,
    TextField,Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle
   
  } from "@mui/material";
  import * as yup from "yup";
  import useMediaQuery from "@mui/material/useMediaQuery";
  import { useNavigate } from "react-router-dom";
  import { Formik } from "formik";
  import Header from '../common/Header'
  import {assignDepartment} from '../../../configuration/TrainingApi'
  import { useLocation } from "react-router-dom";
  import DepartementTree from '../common/DepartementTree'
  import { useAtom } from "jotai";
  import { useState } from "react";
  import { authAtom } from "shell/authAtom";

  
  const AssignDepartement = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const navigate = useNavigate();
    const location = useLocation();
    const interStudentId = location?.state?.id;
      const [authState] = useAtom(authAtom);
       const tenantId = authState.tenantId;

    
      const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
    
      const [openDialog, setOpenDialog] = useState(false); 
      const [selectedDepartment, setSelectedDepartment] = useState({
        id: "",
        name: "",
      }); 
    
      const handleDialogOpen = () => setOpenDialog(true);
    
      const handleDialogClose = () => setOpenDialog(false);
    
      const handleDepartmentSelect = (id, name) => {
        setSelectedDepartment({ id, name }); 
      };
    
      const handleSaveDepartment = () => {
        if (!selectedDepartment.id || !selectedDepartment.name) {
          setNotification({
            open: true,
            message: "Please select a department before saving.",
            severity: "warning",
          });
          return;
        }
        setOpenDialog(false); 
      };
    
  
    const initialValues = {
      remark: "",
      // placedDepartmentId: "",
    };
    const handleCloseSnackbar = () => {
      setNotification({ ...notification, open: false });
    };
  
    const handleFormSubmit = async (values) => {
      try {

        if (!selectedDepartment.id) {
          setNotification({
            open: true,
            message: "Please select a department before submitting.",
            severity: "warning",
          });
          return; 
        }
        
      const formValues = {
        ...values,
        placedDepartmentId: selectedDepartment.id, 
      };

        await assignDepartment(tenantId,interStudentId, formValues);
        navigate("/training/internstudent");
        console.log("Form data submitted successfully!");
      
      } catch (error) {
        console.error("Failed to submit form data:", error);
      }
    };
  

    const checkoutSchema = yup.object().shape({
      // placedDepartmentId: yup.string().required("Placed Department name cannot be null"),
      remark: yup.string().nullable(),
    });
  
    return (
      <Box m="20px">
      
        <Header subtitle="Assign Departement for Students" />
  
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
            setFieldValue,
         
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
                                 label="Department Name"
                                 value={selectedDepartment.name}
                                 InputProps={{
                                   readOnly: true,
                                 }}
                                 sx={{ gridColumn: "span 1" }}
                               />
                               <Button
                                 variant="outlined"
                                 color="primary"
                                 onClick={handleDialogOpen}
                                 sx={{ gridColumn: "span 1" }}
                               >
                                 +
                               </Button>
              
  
                <TextField
                  fullWidth
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
                  Submit
                </Button>
              
              </Box>
            </form>
          )}
        </Formik>
         {/* Snackbar for Notifications */}
                <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }} // Positioned at top-right
              >
                <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
                  {notification.message}
                </Alert>
              </Snackbar>
        
              <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
                <DialogTitle>Select a Department</DialogTitle>
                <DialogContent>
                  <DepartementTree
                    onNodeSelect={(id, name) => handleDepartmentSelect(id, name)} // Pass selected node back
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleDialogClose} color="secondary">
                    Cancel
                  </Button>
                  <Button onClick={handleSaveDepartment} color="primary">
                    Save
                  </Button>
                </DialogActions>
              </Dialog>
        
      </Box>
    );
  };
  
  export default AssignDepartement;
  