import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
 FormControl,InputLabel ,Select ,MenuItem,FormHelperText,  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import Header from "../common/Header";
import {
  createDepartementPayLocationGroup,
  getAllpayLocationGroup,
  
} from "../../../Api/payrollApi";
import DepartementTree from "../common/DepartementTree";
import GetAllDepartmentPayLocationAndGroup from "./GetAllDepartmentPayLocationAndGroup";



const CreateDepartmentPayLocationAndGroup = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
   

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };
 

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
  

  const [refreshKey, setRefreshKey] = useState(0);

   const [allPayLocationGroup, setAllPayLocationGroup] = useState([]);



  
 const handleFormSubmit = async (values, { resetForm }) => {
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
      departmentId: selectedDepartment.id,
    };

    await createDepartementPayLocationGroup(formValues);
    setNotification({
      open: true,
      message: "Back payment group created successfully!",
      severity: "success",
    });
    resetForm();
    setRefreshKey((prev) => prev + 1);
  } catch (error) {
    console.error("Failed to submit form data:", error);
    setNotification({
      open: true,
      message: "Failed to create back payment group. Please try again.",
      severity: "error",
    });
  }
};

    useEffect(() => {
      fetchAllpayLocationAndGroup();
    }, []);
  
    const fetchAllpayLocationAndGroup = async () => {
      try {
        const response = await getAllpayLocationGroup();
        const data = response.data;
        setAllPayLocationGroup(data);
      } catch (error) {
        console.error("Error fetching fetch pay location and group:", error.message);
      }
    };

 

  const initialValues = {
    payLocationAndGroupId: "",
    system: "",
    costCenter:"",
    description: "",
  };

  const checkoutSchema = yup.object().shape({
    payLocationAndGroupId: yup.string().required("payLocationAndGroupId is required"),
    system: yup.string().required("system is required"),
    costCenter: yup.string().required("costCenter is required"),
    description: yup.string().required("description is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create Departement pay location and group" />
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
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >

                    <FormControl
                                sx={{
                                  flexGrow: 1,
                                  flexShrink: 1,
                                  minWidth: 0,
                                  gridColumn: "span 2",
                                }}
                                error={!!touched.payLocationAndGroupId && !!errors.payLocationAndGroupId}
                              >
                                <InputLabel id="inter-label">
                                  Select pay location group
                                </InputLabel>
                                <Select
                                  labelId="payLocationAndGroupId-label"
                                  value={values.payLocationAndGroupId}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  name="payLocationAndGroupId"
                                  fullWidth
                                >
                                  <MenuItem value="">
                                    <em>Select pay location group</em>
                                  </MenuItem>
                                  {allPayLocationGroup.map((allPayLocationGroups) => (
                                    <MenuItem
                                      key={allPayLocationGroups.id}
                                      value={allPayLocationGroups.id}
                                    >
                                      {allPayLocationGroups.payGroup}
                                    </MenuItem>
                                  ))}
                                </Select>
                
                                {touched.payLocationAndGroupId && errors.payLocationAndGroupId && (
                                  <FormHelperText>{errors.payLocationAndGroupId}</FormHelperText>
                                )}
                              </FormControl>

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
                type="text"
                label="system"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.system}
                name="system"
                error={!!touched.system && !!errors.system}
                helperText={touched.system && errors.system}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />

              
              <TextField
                fullWidth
                type="date"
                label="cost Center "
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.costCenter}
                name="costCenter"
                error={!!touched.costCenter && !!errors.costCenter}
                helperText={touched.costCenter && errors.costCenter}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />
                 <TextField
                fullWidth
                type="text"
                multiline
                label="description "
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />


              
              
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Back Payment Group
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
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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

      <GetAllDepartmentPayLocationAndGroup refreshKey={refreshKey} />
    </Box>
  );
};

export default CreateDepartmentPayLocationAndGroup;
