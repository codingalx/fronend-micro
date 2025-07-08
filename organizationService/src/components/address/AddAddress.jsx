import { Box, Button, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import Header from '../common/Header'
import useMediaQuery from "@mui/material/useMediaQuery"; 
import { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import SelectedKeyContext from "../department/SelectedKeyContext";
import { addressEndpoint } from "../../../configuration/organizationApi";
// import LocationTree from "../../Employee/LocationTress";
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; 



const validationSchema = yup.object().shape({
  blockNo: yup.string().required("required"),
  houseNumber: yup.string().required("required"),
  floor: yup.string().required("required"),
  officeNumber: yup.string().required("required"),
  officeTelephone: yup.string().required("required"),
  mobileNumber: yup.string().required("required"),
  email: yup.string().required("required"),
  website: yup.string().required("required"),
  poBox: yup.string().required("required"),
});



const AddAddress = () => {
  const [authState] = useAtom(authAtom);

  /* this is helpl from the dropdown menu select id for parent location */
  const { selectedKey, setSelectedKey } = useContext(SelectedKeyContext);
  const [localSelectedKey, setLocalSelectedKey] = useState(selectedKey);
  const location = useLocation();
  const id = location.state.id;
  const [refreshKey, setRefreshKey] = useState(0);


  /**
   * Handles the selection of a key and updates the context with the selected key.
   *
   * @param {string} key - The key of the selected item.
   * @return {void}
   */
  const handleSelect = (key) => {
    // console.log("Selected Key::", key);
    setSelectedKey(key); // This should update the context
    setLocalSelectedKey(key); // Update local state
  };

  const [successMessage, setSuccessMessage] = useState(false);
  /* THIS IS FOR SAME NAME YOU TYPE TO PROTECT */
  // const [existedMessage, setExistedMessage] = useState(false);

  const handleSubmit = (values, { setSubmitting,resetForm }) => {
    const { url, headers } = addressEndpoint(authState.accessToken);
    // const headers = {
    //   accept: "*/*",
    //   "Content-Type": "application/json",
    // };

    // Ensure the locationTypeId is used instead of the department type name
    const data = {
      ...values,
      locationId: localSelectedKey,
      departmentId: id,
    };
    console.log("Data to be sent:", data);

    // http://172.20.139.180:8181/api/organization/addresses/0a37d02b-02bf-455c-88c1-8dd55d5300c0/add-address
    axios
      // .post(apiEndpointAddAddress, data, { headers })
      .post(`${url}/${tenantId}/add-address`, data, { headers })
      .then((response) => {
        console.log("Response: ", response.data);
        // console.log("SELECTED-KEY", selectedKey);
        // setExistedMessage(false);
        setSuccessMessage(true);
        setSubmitting(false);
        resetForm();
        setRefreshKey(prev => prev + 1); 

        // Reset the selected key after submitting
        setSelectedKey(null);
        setLocalSelectedKey(null);
      })
      .catch((error) => {
        console.error("There was an error!", error);
        setSubmitting(false);
      });
    // You can display an error message to the user, existed user existed
    // setExistedMessage(true);
  };

  const isNonMobile = useMediaQuery("(min-width:600px)");

  return (
    <Box m="20px" className="insert-tenant">
      <Header title="ADD ADDRESS" subtitle="Add a new address profile" />

      <Formik
        initialValues={{
          blockNo: "",
          houseNumber: "",
          floor: "",
          officeNumber: "",
          officeTelephone: "",
          mobileNumber: "",
          email: "",
          website: "",
          poBox: "",
          locationId: selectedKey,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          isSubmitting,
          handleChange,
        }) => (
          <Form>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 0" },
              }}
              className="form-group"
            >
              <TextField
                fullWidth
                label=" Choose Address"
                InputProps={{
                  inputComponent: LocationTree,
                  inputProps: {
                    selectedKey: selectedKey,
                    onSelect: handleSelect,
                    handleSelect: handleSelect,
                  },
                }}
                sx={{
                  gridColumn: "span 2",
                  height: "auto",
                  alignItems: "center",
                }}
              />
              <TextField
                fullWidth
                label="Block Number"
                onBlur={handleBlur}
                error={!!touched.blockNo && !!errors.blockNo}
                helperText={touched.blockNo && errors.blockNo}
                type="text"
                id="blockNo"
                name="blockNo"
                value={values.blockNo}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="House No."
                onBlur={handleBlur}
                error={!!touched.houseNumber && !!errors.houseNumber}
                helperText={touched.houseNumber && errors.houseNumber}
                type="text"
                id="houseNumber"
                name="houseNumber"
                value={values.houseNumber}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Floor Number"
                onBlur={handleBlur}
                error={!!touched.floor && !!errors.floor}
                helperText={touched.floor && errors.floor}
                type="text"
                id="floor"
                name="floor"
                value={values.floor}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Office Room Number"
                onBlur={handleBlur}
                error={!!touched.officeNumber && !!errors.officeNumber}
                helperText={touched.officeNumber && errors.officeNumber}
                type="text"
                id="officeNumber"
                name="officeNumber"
                value={values.officeNumber}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Office Tel. Number"
                onBlur={handleBlur}
                error={!!touched.officeTelephone && !!errors.officeTelephone}
                helperText={touched.officeTelephone && errors.officeTelephone}
                type="text"
                id="officeTelephone"
                name="officeTelephone"
                value={values.officeTelephone}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Mobile Number"
                onBlur={handleBlur}
                error={!!touched.mobileNumber && !!errors.mobileNumber}
                helperText={touched.mobileNumber && errors.mobileNumber}
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                value={values.mobileNumber}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Email Address"
                onBlur={handleBlur}
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                type="text"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                label="Website"
                onBlur={handleBlur}
                error={!!touched.website && !!errors.website}
                helperText={touched.website && errors.website}
                type="text"
                id="website"
                name="website"
                value={values.website}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="P.O.Box Number"
                onBlur={handleBlur}
                error={!!touched.poBox && !!errors.poBox}
                helperText={touched.poBox && errors.poBox}
                type="text"
                id="poBox"
                name="poBox"
                value={values.poBox}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="start" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
              >
                Create New Address
              </Button>
            </Box>
            {successMessage && (
              <span display="flex" className="success-message">
                Address created successfully!
              </span>
            )}
            {/* You can display an error message to the user, existed user existed */}

            {/* {existedMessage && (
              <span display="flex" className="success-message">
                Address already existed, try different address!
              </span>
            )} */}
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddAddress;
