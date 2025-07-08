import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
} from "@mui/material";
import * as yup from "yup";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import {  addDepartmentWithParent, listOfdepartementType } from '../../../configuration/organizationApi'
import DepartementTree from "../common/DepartementTree";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 

const Departemnt = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [departementType, setDepartementType] = useState([]);
    const [authState] = useAtom(authAtom);
    const tenantId = authState.tenantId;
  const [openDialog, setOpenDialog] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedDepartment, setSelectedDepartment] = useState({
    id: "",
    name: "",
  });

  const fetchDepartementType = async () => {
    try {
      const response = await listOfdepartementType(tenantId);
      setDepartementType(response.data);
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to fetch the Department Types. Please try again.",
        severity: "error",
      });
    }
  };

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
    setOpenDialog(false); // Close the dialog after saving
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const data = {
        ...values,
        departmentTypeId: values.departmentTypeId,
      };
      const parentId = selectedDepartment.id;
      if (!parentId) {
        console.error("No parent department selected.");
        return;
      }
      await addDepartmentWithParent(tenantId,parentId, data); // Ensure this function is passing the data correctly
      resetForm();
      setNotification({
        open: true,
        message: "Department created successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to create department. Please try again.",
        severity: "error",
      });
    }
  };

  const initialValues = {
    departmentName: "",
    establishedDate: "",
    departmentTypeId: "",
  };

  const checkoutSchema = yup.object().shape({
    departmentName: yup.string().required("Department Name is required"),
    departmentTypeId: yup.string().required("Department Type is required"),
  });

  useEffect(() => {
    fetchDepartementType();
  }, []);

  return (
    <Box m="20px">
      <Header subtitle="Create New Department" />
      <Formik
        onSubmit={handleSubmit}
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
              <TextField
                fullWidth
                type="text"
                label="Department Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.departmentName}
                name="departmentName"
                error={!!touched.departmentName && !!errors.departmentName}
                helperText={touched.departmentName && errors.departmentName}
                sx={{ gridColumn: "span 2" }}
              />

              <FormControl
                sx={{
                  flexGrow: 1,
                  flexShrink: 1,
                  minWidth: 0,
                  gridColumn: "span 2",
                }}
                error={!!touched.departmentTypeId && !!errors.departmentTypeId}
              >
                <InputLabel id="departmentTypeId-label">Select Department Type</InputLabel>
                <Select
                  labelId="departmentTypeId-label"
                  value={values.departmentTypeId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="departmentTypeId"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select Department Type</em>
                  </MenuItem>
                  {departementType.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.departmentTypeName}
                    </MenuItem>
                  ))}
                </Select>
                {touched.departmentTypeId && errors.departmentTypeId && (
                  <FormHelperText>{errors.departmentTypeId}</FormHelperText>
                )}
              </FormControl>

              <TextField
                fullWidth
                type="date"
                label="Established Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.establishedDate}
                name="establishedDate"
                error={!!touched.establishedDate && !!errors.establishedDate}
                helperText={touched.establishedDate && errors.establishedDate}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Department
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>Select a Department</DialogTitle>
        <DialogContent>
          <DepartementTree
            onNodeSelect={(id, name) => handleDepartmentSelect(id, name)} // Pass selected node back
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
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

export default Departemnt;
