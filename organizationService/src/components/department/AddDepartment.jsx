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
import {   addDepartmentWithParent,
  listOfdepartementType, } from "../../../configuration/organizationApi";
import DepartementTree from "../common/DepartementTree";  
import ListDepartment from "./ListDepartment";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 


const AddDepartment = () => {
  const [authState] = useAtom(authAtom);
  const tenantId = authState.tenantId;

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [departementType, setDepartementType] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); 
    const [refreshKey, setRefreshKey] = useState(0);

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
    setSelectedDepartment({ id, name }); // Update selected department
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
      console.log(values)
      await addDepartmentWithParent(tenantId,parentId, data); // Ensure this function is passing the data correctly
      resetForm();

      setNotification({
        open: true,
        message: "Department created successfully!",
        severity: "success",
      });
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to submit form data:", error);
      setNotification({
        open: true,
        message: "Failed to create department. Please try again.",
        severity: "error",
      });
    }
  };
  const handleDialogOpen = () => setOpenDialog(true);

  const handleDialogClose = () => setOpenDialog(false);

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

              <FormControl
                sx={{
                  flexGrow: 1,
                  flexShrink: 1,
                  minWidth: 0,
                  gridColumn: "span 2",
                }}
                error={!!touched.departmentTypeId && !!errors.departmentTypeId}
              >
                <InputLabel id="departmentTypeId-label">
                  Select Department Type
                </InputLabel>
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
            <ListDepartment refreshKey={refreshKey} />
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

export default AddDepartment;




// import {
//   Box,
//   Button,
//   TextField,
//   MenuItem,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogActions,
// } from "@mui/material";
// import { Formik, Form } from "formik";
// import * as yup from "yup";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import SelectedKeyContext from "./SelectedKeyContext";
// import {
//   departmentTypesEndpoint,
//   departmentEndpoint,
// } from "../../../apiConfig";
// import AuthContext from "../../Auth/AuthContext";
// import Header from "../../Header";
// import DepartmentTree from "../../Employee/DepartmentTree";
// import ListDepartment from "./ListDepartment";
// import { useLocation } from "react-router-dom";
// import BasicRichTreeView from "../../Dashboard/Tree";

// const nonSelectableStyle = {
//   border: "none",
//   boxShadow: "none",
//   WebkitTouchCallout: "none" /* iOS Safari */,
//   WebkitUserSelect: "none" /* Safari */,
//   KhtmlUserSelect: "none" /* Konqueror HTML */,
//   MozUserSelect: "none" /* Old versions of Firefox */,
//   MsUserSelect: "none" /* Internet Explorer/Edge */,
//   userSelect:
//     "none" /* Non-prefixed version, currently supported by Chrome, Opera and Firefox */,
//   pointerEvents: "none" /* Disabling pointer events to prevent focus */,
// };

// const validationSchema = yup.object().shape({
//   establishedDate: yup
//     .string()
//     .matches(/^\d{4}-\d{2}-\d{2}$/)
//     .required("required"),
//   departmentName: yup.string().required("required"),
//   departmentType: yup
//     .string()
//     .required("Please select an option from the dropdown menu."),
// });

// const AddDepartment = () => {
//   const { authState } = useContext(AuthContext);
//   const tenantId = authState.tenantId;

//   const { selectedKey, setSelectedKey } = useContext(SelectedKeyContext);
//   const [localSelectedKey, setLocalSelectedKey] = useState(selectedKey);
//   const [refreshKey, setRefreshKey] = useState(0);

//   const location = useLocation();
//   const id = location.state.id;
//   console.log(`the deparetement id from the deps ${id}`);

//   const handleSelect = (key) => {
//     console.log("Selected Key::", key);
//     setSelectedKey(key); // This should update the context
//     setLocalSelectedKey(key); // Update local state
//   };
//   const [departmentTypes, setDepartmentTypes] = useState([]);

//   useEffect(() => {
//     const { url, headers } = departmentTypesEndpoint(authState.accessToken);
//     axios
//       .get(`${url}/${tenantId}/get-all`, { headers })
//       .then((response) => {
//         setDepartmentTypes(response.data);
//       })
//       .catch((error) => {
//         console.error("There was an error!", error);
//       });
//   }, []);

//   const date = new Date();

//   function toDateInputValue(dateObject) {
//     const local = new Date(dateObject);
//     local.setMinutes(dateObject.getMinutes() - dateObject.getTimezoneOffset());
//     return local.toJSON().slice(0, 10);
//   }

//   const [successMessage, setSuccessMessage] = useState(false);

//   const handleSubmit = (values, { setSubmitting, resetForm }) => {
//     const { url, headers } = departmentEndpoint(authState.accessToken);
//     if (!selectedDepartment.id) {
//       setNotification({
//         open: true,
//         message: "Please select a department before submitting.",
//         severity: "warning",
//       });
//       return; // Prevent further submission if no department is selected
//     }
//     const data = {
//       ...values,
//       departmentTypeId: values.departmentType,
//       departmentId: selectedDepartment.id, // Include selected department ID
//     };

//     const endpoint = localSelectedKey
//       ? `${url}/${tenantId}/${localSelectedKey}/sub-departments`
//       : `${url}/${tenantId}/add-department`;

//     axios
//       .post(endpoint, data, { headers })
//       .then((response) => {
//         console.log(response.data);
//         setSuccessMessage(true);
//         setSubmitting(false);
//         resetForm();
//         setRefreshKey((prev) => prev + 1);

//         setSelectedKey(null);
//         setLocalSelectedKey(null);
//       })
//       .catch((error) => {
//         console.error("There was an error!", error);
//         setSubmitting(false);
//       });
//   };

//   const handleCloseSnackbar = () => {
//     setNotification({ ...notification, open: false });
//   };
//   const [notification, setNotification] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   const [openDialog, setOpenDialog] = useState(false); // Manage dialog visibility
//   const [selectedDepartment, setSelectedDepartment] = useState({
//     id: "",
//     name: "",
//   }); // State for selected department

//   const handleDialogOpen = () => setOpenDialog(true);

//   const handleDialogClose = () => setOpenDialog(false);

//   const handleDepartmentSelect = (id, name) => {
//     setSelectedDepartment({ id, name }); // Update selected department
//   };

//   const handleSaveDepartment = () => {
//     if (!selectedDepartment.id || !selectedDepartment.name) {
//       setNotification({
//         open: true,
//         message: "Please select a department before saving.",
//         severity: "warning",
//       });
//       return;
//     }
//     setOpenDialog(false); // Close the dialog
//   };

//   const isNonMobile = useMediaQuery("(min-width:600px)");

//   return (
//     <Box m="20px" className="insert-tenant">
//       <Header subtitle="Create a new department profile" />

//       <Formik
//         initialValues={{
//           departmentName: "",
//           departmentType: "",
//           establishedDate: toDateInputValue(date),
//         }}
//         validationSchema={validationSchema}
//         onSubmit={handleSubmit}
//       >
//         {({
//           values,
//           errors,
//           touched,
//           handleBlur,
//           isSubmitting,
//           handleChange,
//         }) => (
//           <Form>
//             <Box
//               display="grid"
//               gap="30px"
//               gridTemplateColumns="repeat(4, minmax(0, 1fr))"
//               sx={{
//                 "& > div": { gridColumn: isNonMobile ? undefined : "span 0" },
//               }}
//               className="form-group"
//             >
//               <TextField
//                 fullWidth
//                 label="Department Name"
//                 onBlur={handleBlur}
//                 error={!!touched.departmentName && !!errors.departmentName}
//                 helperText={touched.departmentName && errors.departmentName}
//                 type="text"
//                 id="departmentName"
//                 name="departmentName"
//                 value={values.departmentName}
//                 onChange={handleChange}
//                 sx={{ gridColumn: "span 2" }}
//               />

//               <TextField
//                 fullWidth
//                 type="text"
//                 label="Department Name"
//                 value={selectedDepartment.name}
//                 InputProps={{
//                   readOnly: true,
//                 }}
//                 sx={{ gridColumn: "span 1" }}
//               />
//               <Button
//                 variant="outlined"
//                 color="primary"
//                 onClick={handleDialogOpen}
//                 sx={{ gridColumn: "span 1" }}
//               >
//                 +
//               </Button>
//               <TextField
//                 select
//                 name="departmentType"
//                 label="Department Type"
//                 value={values.departmentType}
//                 onChange={handleChange}
//                 error={!!touched.departmentType && !!errors.departmentType}
//                 helperText={touched.departmentType && errors.departmentType}
//                 sx={{ gridColumn: "span 2" }}
//               >
//                 {departmentTypes.map((type, index) => (
//                   <MenuItem key={index} value={type.id}>
//                     {type.departmentTypeName}
//                   </MenuItem>
//                 ))}
//               </TextField>

//               <TextField
//                 fullWidth
//                 label="Established Date"
//                 onBlur={handleBlur}
//                 error={!!touched.establishedDate && !!errors.establishedDate}
//                 helperText={touched.establishedDate && errors.establishedDate}
//                 sx={{ gridColumn: "span 2" }}
//                 type="date"
//                 id="establishedDate"
//                 name="establishedDate"
//                 value={values.establishedDate}
//                 onChange={handleChange}
//               />

//               <TextField
//                 fullWidth
//                 label="Description"
//                 multiline
//                 value={values.description}
//                 name="description"
//                 onBlur={handleBlur}
//                 error={!!touched.description && !!errors.description}
//                 helperText={touched.description && errors.description}
//                 sx={{ gridColumn: "span 2" }}
//               />
//               <TextField
//                 fullWidth
//                 type="text"
//                 label="Prepared By"
//                 InputProps={{
//                   readOnly: true,
//                   style: nonSelectableStyle,
//                 }}
//                 onMouseDown={(e) => e.preventDefault()}
//                 value={values.preparedBy}
//                 name="preparedBy"
//                 id="preparedBy"
//                 onBlur={handleBlur}
//                 error={!!touched.preparedBy && !!errors.preparedBy}
//                 helperText={touched.preparedBy && errors.preparedBy}
//                 sx={{ gridColumn: "span 2" }}
//               />
//             </Box>
//             <Box display="start" justifyContent="end" mt="20px">
//               <Button
//                 type="submit"
//                 color="secondary"
//                 variant="contained"
//                 disabled={isSubmitting}
//               >
//                 Create New Department
//               </Button>
//             </Box>

//             {successMessage && (
//               <span display="flex" className="success-message">
//                 Department created successfully!
//               </span>
//             )}
//             <ListDepartment refreshKey={refreshKey} />
//           </Form>
//         )}
//       </Formik>
//       <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
//         <DialogTitle>Select a Department</DialogTitle>
//         <DialogContent>
//           <BasicRichTreeView
//             onNodeSelect={(id, name) => handleDepartmentSelect(id, name)} // Pass selected node back
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleDialogClose} color="secondary">
//             Cancel
//           </Button>
//           <Button onClick={handleSaveDepartment} color="primary">
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default AddDepartment;
