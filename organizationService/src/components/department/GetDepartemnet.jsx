import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import {
  createDepartement,
  deleteDepartement,
  getDepartementById,
  listOfdepartementType,
  updateDepartement,
} from "../../../configuration/organizationApi";
import { useLocation, useNavigate } from "react-router-dom";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 



const GetDepartemnet = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [departementType, setDepartementType] = useState([]);
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  const [departement, setDepartement] = useState({
    departmentName: "",
    establishedDate: "",
    departmentTypeId: "",
  });
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.id;

  useEffect(() => {
    fetchAllDepartType();
    if (id) fetchDepartement();
  }, [id]);

  const fetchAllDepartType = async () => {
    try {
      const response = await listOfdepartementType(tenantId);
      setDepartementType(response.data);
    } catch (error) {
      setNotification({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  const fetchDepartement = async () => {
    try {
      const response = await getDepartementById(tenantId,id);
      setDepartement(response.data);
    } catch (error) {
      setNotification({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const handleFormSubmit = async (values) => {
    try {
      if (id) {
        await updateDepartement(tenantId,id, values);
        setNotification({
          open: true,
          message: "Updated successfully!",
          severity: "success",
        });
      } else {
        await createDepartement(tenantId,values);
        setNotification({
          open: true,
          message: "Created successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDepartement(tenantId,id);
      setNotification({
        open: true,
        message: "Deleted successfully!",
        severity: "success",
      });
      navigate("/manage_organization", { state: { activeTab: 0 } });
    } catch (error) {
      setNotification({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  const handleNew = () => {
    setDepartement({
      departmentName: "",
      establishedDate: "",
      departmentTypeId: "",
    });
  };

  const checkoutSchema = yup.object().shape({
    departmentName: yup.string().required("Department Name is required"),
    establishedDate: yup.string().required("Established Date is required"),
    departmentTypeId: yup.string().required("Department Type is required"),
  });

  return (
    <Box m="20px">
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={departement}
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
                label="Department Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.departmentName}
                name="departmentName"
                error={!!touched.departmentName && !!errors.departmentName}
                helperText={touched.departmentName && errors.departmentName}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                label="Established Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.establishedDate}
                name="establishedDate"
                type="date"
                error={!!touched.establishedDate && !!errors.establishedDate}
                helperText={touched.establishedDate && errors.establishedDate}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <FormControl
                sx={{ gridColumn: "span 2" }}
                error={!!touched.departmentTypeId && !!errors.departmentTypeId}
              >
                <InputLabel>Select Department Type</InputLabel>
                <Select
                  value={values.departmentTypeId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="departmentTypeId"
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
            </Box>
            <Box display="flex" justifyContent="start" mt="20px" gap="20px">
              <Button type="submit" color="primary" variant="contained">
                {id ? "Update" : "Create"}
              </Button>

            

              <Button
                color="error"
                variant="contained"
                onClick={handleDelete}
                disabled={!id} // Disable if no ID is available
              >
                Delete
              </Button>

              <Button type="submit" color="primary" variant="contained">
                Create
              </Button>
              <Button
                color="secondary"
                variant="contained"
                onClick={handleNew}
              >
                Reset
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
    </Box>
  );
};

export default GetDepartemnet;
