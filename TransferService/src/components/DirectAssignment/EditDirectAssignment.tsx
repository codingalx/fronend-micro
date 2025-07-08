import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  FormLabel,
  Snackbar,
  Alert,   Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Formik } from "formik";
import {
  getDirectAssignmentById,
  updateDirectAssignment,
  listDepartments
} from "../../Api/directAssignmentApi";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import { MovementType } from "../../constants/enums";
import NotPageHandle from "../common/NotPageHandle";
import Header from "../common/Header"; 
import {getDepartementById} from '../../Api/transferApi'
import DepartementTree from "../common/DepartementTree";

const EditDirectAssignment = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const directAssignmentId = location.state?.directAssignmentId; 
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;
  const shortEmployeeId = authState.username; 

  const [longEmployeeId, setLongEmployeeId] = useState("");
  const [departments, setDepartments] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [directAssignment, setDirectAssignment] = useState({
    employeeId: "",
    movementType: "",
    referenceNumber: "",
    remark: "",
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
      

  useEffect(() => {
    if (!directAssignmentId) {
      return;
    }
    fetchDirectAssignment();
    fetchDepartments();
    fetchEmployeeDetails();
  }, [tenantId, directAssignmentId]);

  const fetchDirectAssignment = async () => {
    try {
      const response = await getDirectAssignmentById(tenantId, directAssignmentId);
      setDirectAssignment(response.data);
      const transferData = response.data

        if (transferData.departmentId) {
              const departmentResponse = await getDepartementById(tenantId, transferData.departmentId);
              const departmentName = departmentResponse.data.departmentName; 
              setSelectedDepartment({ id: transferData.departmentId, name: departmentName });
            }
    } catch (error) {
      console.error("Error fetching direct assignment:", error.response || error.message);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await listDepartments(tenantId);
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error.response || error.message);
    }
  };

  const fetchEmployeeDetails = async () => {
    try {

      const response = await getDirectAssignmentById(tenantId, shortEmployeeId);
      setLongEmployeeId(response.data.id);
      setDirectAssignment((prev) => ({ ...prev, employeeId: response.data.id })); 
    } catch (error) {
      console.error("Error fetching employee details:", error.response || error.message);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {

    try {
      const response = await updateDirectAssignment(tenantId, directAssignmentId, values);

      if (response.status === 200) {
        setNotification({
          open: true,
          message: "Direct assignment updated successfully!",
          severity: "success",
        });
        resetForm();
        navigate("/transfer/direct_assigment");
      } else {
        setNotification({
          open: true,
          message: `Error updating direct assignment. Status code: ${response.status}`,
          severity: "error",
        });
        console.error("Error updating direct assignment. Status code:", response.status);
      }
    } catch (error) {
      setNotification({
        open: true,
        message: `Error updating direct assignment: ${error.message}`,
        severity: "error",
      });
      console.error("Error updating direct assignment:", error.response || error.message);
    }
  };

  const checkoutSchema = yup.object().shape({
    movementType: yup
      .string()
      .oneOf(Object.values(MovementType))
      .required("Movement Type is required"),
    referenceNumber: yup.number().required("Reference Number is required"),
    remark: yup.string().required("Remark is required"),
  });



  if (!directAssignmentId) {
    return (
      <NotPageHandle
        message="Direct Assignment ID is missing. Redirecting to Create Direct Assignment..."
        navigateTo="/transfer/direct_assigment" 
      />
    );
  }

  return (
    <Box m="20px">
      <Header subtitle="Edit Direct Assignment" /> 
      <Formik
        initialValues={directAssignment}
        validationSchema={checkoutSchema}
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
             

              <FormControl sx={{ gridColumn: "span 2" }}>
                <InputLabel id="movementType">Movement Type</InputLabel>
                <Select
                  labelId="movementType"
                  value={values.movementType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  name="movementType"
                  error={!!touched.movementType && !!errors.movementType}
                >
                  <MenuItem value="">
                    <em>Select Movement Type</em>
                  </MenuItem>
                  {Object.values(MovementType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
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
                type="number"
                label="Reference Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.referenceNumber}
                name="referenceNumber"
                error={!!touched.referenceNumber && !!errors.referenceNumber}
                helperText={touched.referenceNumber && errors.referenceNumber}
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

              <TextField
                fullWidth
                type="text"
                label="Employee ID"
                value={shortEmployeeId} 
                InputProps={{
                  readOnly: true, 
                }}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update Direct Assignment
              </Button>
            </Box>
          </form>
        )}
      </Formik>

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
                  onNodeSelect={(id, name) => handleDepartmentSelect(id, name)} 
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

export default EditDirectAssignment;