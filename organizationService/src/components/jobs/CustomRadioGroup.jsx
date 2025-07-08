import React from "react";
import { RadioGroup, FormControlLabel, Radio, FormLabel } from "@mui/material";

const CustomRadioGroup = ({ values, handleChange }) => {
  return (
    <>
      <FormLabel component="legend" sx={{ gridColumn: "span 2" }}>
        Job Type
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby="jobType"
        name="jobType"
        // value={values.jobType}
        onChange={handleChange}
        sx={{
          gridColumn: "span 2",
          justifyContent: "center", // Centered the radio buttons
          mb: 2, // Added margin-bottom for spacing
        }}
      >
        <FormControlLabel
          value="nonmanagerial"
          control={<Radio color="primary" />} // Set the color for the radio button
          label="Non Managerial"
        />
        <FormControlLabel
          value="managerial"
          control={<Radio color="primary" />} // Set the color for the radio button
          label="Managerial"
        />
      </RadioGroup>
    </>
  );
};

export default CustomRadioGroup;
