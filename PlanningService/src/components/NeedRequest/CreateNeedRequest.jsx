import React from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,Snackbar,Alert,FormHelperText
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import Header from "../common/Header";
import ToolbarComponent from "../common/ToolbarComponent";
import DepartementTree from '../common/DepartementTree'
import { useState, useEffect } from "react";
import { createNeedRequest, getAllbudgetYears, getAllstafPlan  } from "../../../configuration/PlanningApi";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const CreateNeedRequest = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [stafPlan, setStafPlan] = useState([]);
  const [budgetYear, setBudgetYear] = useState([]);
  const [authState] = useAtom(authAtom); 
  const tenantId = authState.tenantId
  

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
      departmentId: selectedDepartment.id, 
    };

      await createNeedRequest(tenantId,formValues); 
      setNotification({
        open: true,
        message: "Need Request  created successfully!",
        severity: "success",
      });
      
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to create need request. Please try again.",
        severity: "error",
      });
    }
  };
  const initialValues = {

    noOfPosition: "",
    employmentType: "",
    howToBeFilled: "",
    whenToBe: "",
    remark: "",
    budgetYearId: "",
    // departmentId: "",
    staffPlanId: ""
  };

  useEffect(() => {
    fetchAllstafplan();
    fetchAllBudgetYear();
  }, []);

  const fetchAllstafplan = async () => {
    try {
      const response = await getAllstafPlan(tenantId);
      setStafPlan(response.data);
    } catch (error) {
      setNotification({ open: true, message: "Failed fetch the staff Plan c. Please try again.", severity: "error" });
    }
  };

  const fetchAllBudgetYear = async () => {
    try {
      const response = await getAllbudgetYears(tenantId);
      setBudgetYear(response.data);
    } catch (error) {
      setNotification({ open: true, message: "Failed fetch the staff Plan c. Please try again.", severity: "error" });
    }
  };

  const checkoutSchema = yup.object().shape({
    noOfPosition: yup
      .number()
      .required("Number of positions is required")
      .min(1, "At least 1 position is required"),
    employmentType: yup.string().required("Employment type is required"),
    howToBeFilled: yup.string().required("Recruitment type is required"),
    whenToBe: yup.string().required("When to be is required"),
    remark: yup.string(),
    budgetYearId: yup.string().required("Budget year is required"),
    staffPlanId: yup.string().required("Staff plan is required"),
  });





  const handleIconClick = () => {
    navigate("/planning/listRequest",);
  };
  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };


  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <Box m="20px">
      <ToolbarComponent mainIconType="search" onMainIconClick={handleIconClick} refreshPage={refreshPage} />
      <Header subtitle="Create Need Request" />
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



              <FormControl sx={{ gridColumn: "span 2" }}>
                <Select
                  label="Employment Type"
                  value={values.employmentType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="employmentType"
                  error={!!touched.employmentType && !!errors.employmentType}
                  displayEmpty
                  inputProps={{ "aria-label": "Employment Type" }}
                >
                  <MenuItem value="">
                    <em>Please Select Employment Type</em>
                  </MenuItem>
                  <MenuItem value="Permanent">Permanent</MenuItem>
                  <MenuItem value="Contract">Contract</MenuItem>
                  <MenuItem value="Temporary">Temporary</MenuItem>
                  <MenuItem value="DayLabour">DayLabour</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>


              <FormControl sx={{ gridColumn: "span 2" }}>


                <Select
                  label="when_To_Be"
                  value={values.whenToBe}

                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "when_To_Be" }}
                  name="whenToBe"
                  error={!!touched.whenToBe && !!errors.whenToBe}
                  sx={{ gridColumn: "span 1" }}
                >
                  <MenuItem value="">
                    <em> Please Select when To Be</em>
                  </MenuItem>
                  <MenuItem value="January">January</MenuItem>
                  <MenuItem value="February">February</MenuItem>
                  <MenuItem value="March">March</MenuItem>
                  <MenuItem value="April">April</MenuItem>
                  <MenuItem value="May">May</MenuItem>

                  <MenuItem value="June">June</MenuItem>
                  <MenuItem value="July">July</MenuItem>
                  <MenuItem value="August">August</MenuItem>
                  <MenuItem value="September">September</MenuItem>

                  <MenuItem value="October">July</MenuItem>
                  <MenuItem value="November">August</MenuItem>
                  <MenuItem value="December">September</MenuItem>
                  <MenuItem value="Today">Today</MenuItem>

                </Select>
              </FormControl>

              <FormControl
                sx={{ flexGrow: 1, flexShrink: 1, minWidth: 0, gridColumn: "span 2" }}
                error={!!touched.staffPlanId && !!errors.staffPlanId}
              >
                <InputLabel id="language-label">Select Staff Plan</InputLabel>
                <Select
                  labelId="staffPlan-label"
                  value={values.staffPlanId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="staffPlanId"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select Staff plan</em>
                  </MenuItem>
                  {stafPlan.map((stafPlan) => (
                    <MenuItem key={stafPlan.id} value={stafPlan.id}>
                      {stafPlan.quantity}
                    </MenuItem>
                  ))}
                </Select>
                {touched.staffPlanId && errors.staffPlanId && (
                  <FormHelperText>{errors.staffPlanId}</FormHelperText>
                )}
              </FormControl>


              <FormControl
                sx={{ flexGrow: 1, flexShrink: 1, minWidth: 0, gridColumn: "span 2" }}
                error={!!touched.budgetYearId && !!errors.budgetYearId}
              >
                <InputLabel id="language-label">Select Budget Year</InputLabel>
                <Select
                  labelId="budgetYear-label"
                  value={values.budgetYearId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="budgetYearId"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select Budget Year</em>
                  </MenuItem>
                  {budgetYear.map((budget) => (
                    <MenuItem key={budget.id} value={budget.id}>
                      {budget.budgetYear}
                    </MenuItem>
                  ))}
                </Select>
                {touched.budgetYearId && errors.budgetYearId && (
                  <FormHelperText>{errors.budgetYearId}</FormHelperText>
                )}
              </FormControl>


              <FormControl sx={{ gridColumn: "span 2" }}>
                <InputLabel id="recruitmentType-label">recruitment Type</InputLabel>
                <Select
                  labelId="recruitmentType-label"
                  value={values.howToBeFilled}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="howToBeFilled"
                  error={!!touched.howToBeFilled && !!errors.howToBeFilled}
                >

                  <MenuItem value="">
                    <em>Select Recruitment Type</em>
                  </MenuItem>
                  <MenuItem value="InternalRecruitment">InternalRecruitment</MenuItem>
                  <MenuItem value="ExternalRecruitment">ExternalRecruitment</MenuItem>
                  <MenuItem value="Transfer">Transfer</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>

              </FormControl>


              <TextField
                fullWidth
                // variant="filled"
                type="text"
                label="No_Of_Position"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.noOfPosition}
                name="noOfPosition"
                error={!!touched.noOfPosition && !!errors.noOfPosition}
                helperText={touched.noOfPosition && errors.noOfPosition}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                multiline
                rows={2}//  variant="filled"

                label="remark"
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

            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Planning
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

export default CreateNeedRequest;