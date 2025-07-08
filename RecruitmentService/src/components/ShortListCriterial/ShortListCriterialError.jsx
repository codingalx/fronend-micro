import React from 'react';
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';

const ShortListCriterialError = () => {
  const navigate = useNavigate();

  return (
    <Box m="20px">
      <Header subtitle="ShortList Criterial Weight Exists" />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={2} // Padding 8px
        boxShadow={3} // Shadow depth
        borderRadius={8} // Rounded corners
        bgcolor="background.paper" // White background
      >
        <Typography variant="h5" gutterBottom align="center">
          You are Tying to Duplicate list Criterial   for this recruitment ID  
    
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/recruitment/listcriterial')}
          sx={{ mt: 2 }} // Margin top 16px
        >
          Go to Assessiement Shorlist Criterial
        </Button>
      </Box>
    </Box>
  );
};

export default ShortListCriterialError;
