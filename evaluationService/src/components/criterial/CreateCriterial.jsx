import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Snackbar, Alert,FormControl,InputLabel,Select ,MenuItem,FormHelperText    } from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import Header from "../common/Header";
import ListCriterial from "./ListCriterial";
import { useAtom } from "jotai";
import { authAtom } from "shell/authAtom";
import {
  createCriterial,
  getAllCategory,
  getAllCriterial,
} from "../../../configuration/EvaluationApi";

const CreateCriterial = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const [criterial, setCriterial] = useState([]);
  const [allCategory, setAllcategory] = useState([]);

  useEffect(() => {
    fetchAllCriterial();
    fetchAllCategory();
  }, []);

  const fetchAllCriterial = async () => {
    try {
      const response = await getAllCriterial(tenantId);
      const data = response.data;
      setCriterial(data);
    } catch (error) {
      console.error("Error fetching criterial:", error.message);
    }
  };

  useEffect(() => {
    fetchAllCategory();
  }, []);

  const fetchAllCategory = async () => {
    try {
      const response = await getAllCategory(tenantId);
      setAllcategory(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const criterialNameExists = criterial.some(
        (criterial) => criterial.name === values.name
      );
      const criterialWithAnotherCategory = criterial.some(
        (criterial) => criterial.categoryId === values.categoryId
      );

      if (criterialNameExists) {
        setNotification({
          open: true,
          message: "criterial Name already exists. Please use a different one.",
          severity: "warning",
        });
        return;
      }
      if (criterialWithAnotherCategory) {
        setNotification({
          open: true,
          message: "criterial created for these category name  . Please use a different one.",
          severity: "warning",
        });
        return;
      }

      const totalWeight = criterial.reduce((acc, curr) => acc + curr.weight, 0);

      const newWeight = parseFloat(values.weight);
      if (totalWeight + newWeight > 100) {
        setNotification({
          open: true,
          message: "Total weight exceeds 100. Please adjust the weights.",
          severity: "warning",
        });
        return;
      }

      await createCriterial(tenantId, values);
      setNotification({
        open: true,
        message: "Evaluation criterial name created successfully!",
        severity: "success",
      });
      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to create criterial name. Please try again.",
        severity: "error",
      });
    }
  };

  const initialValues = {
    name: "",
    weight: "",
    description: "",
    categoryId: "",
    status: "",
  };

  const checkoutSchema = yup.object().shape({
    name: yup.string().required("name is required"),
    status: yup.string().required("please choose status"),
    categoryId: yup.string().required("category name is required"),
    weight: yup
      .number()
      .min(0, "Weight  score cannot be negative")
      .max(100, "Weight score cannot exceed 100")
      .required("Weight score is required"),
  });

  return (
    <Box m="20px">
      <Header subtitle="Create criterial name " />
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
                error={!!touched.categoryId && !!errors.categoryId}
              >
                <InputLabel id="category-label">
                  Select Evaluation Category
                </InputLabel>
                <Select
                  labelId="category-label"
                  value={values.categoryId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="categoryId"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select Evaluation Category Name</em>
                  </MenuItem>
                  {allCategory.map((name) => (
                    <MenuItem key={name.id} value={name.id}>
                      {name.name}
                    </MenuItem>
                  ))}
                </Select>
                {touched.categoryId && errors.categoryId && (
                  <FormHelperText>{errors.categoryId}</FormHelperText>
                )}
              </FormControl>

              <FormControl sx={{ gridColumn: "span 2" }}>
                <Select
                  label="Status"
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "status" }}
                  name="status"
                  error={!!touched.status && !!errors.status}
                  sx={{ gridColumn: "span 1" }}
                >
                  <MenuItem value="">
                    <em> Please Select status</em>
                  </MenuItem>

                  <MenuItem value="ACTIVE">active</MenuItem>
                  <MenuItem value="INACTIVE">inactive</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="text"
                label="catgory Name "
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="number"
                label="weight"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.weight}
                name="weight"
                error={!!touched.weight && !!errors.weight}
                helperText={touched.weight && errors.weight}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Criterial
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
      <ListCriterial refreshKey={refreshKey} />
    </Box>
  );
};

export default CreateCriterial;
