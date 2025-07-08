import React, { useState } from "react";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CreateClearance = () => {
  const [anchorEl, setAnchorEl] = useState(null); 
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  
  const handleMenuItemClick = (path) => {
    handleClose(); 
    navigate(path); 
  };

  return (
   <Box m="20px">
      <Box>
        <Button
  variant="contained"
  color="secondary"
  onClick={handleClick}
  sx={{
    fontSize: "20px", 
    padding: "30px 60px", 
    minWidth: "150px", 
    height: "50px", 
  }}
>
  Create Clearance 
</Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <MenuItem
            onClick={() => handleMenuItemClick("/list-termination")}
            sx={{ fontSize: "14px", padding: "10px 20px" }}
          >
            Clearance for Termination
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuItemClick("/list-retirement")}
            sx={{ fontSize: "14px", padding: "10px 20px" }}
          >
            Clearance for Retirement
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuItemClick("/list-transfer")}
            sx={{ fontSize: "14px", padding: "10px 20px" }}
          >
            Clearance for Transfer
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default CreateClearance;