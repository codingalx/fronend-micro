import React from 'react';
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import { useLocation } from 'react-router-dom';

const ApplicantExamResultAlreadyCreated = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { recruitmentId, applicantId } = location.state;

  return (
    <Box m="20px">
      <Header subtitle="Applicant Exam Result Already Registered " />
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
          Applicant Exam Result is Already Registered.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>  navigate('/recruitment/examResult', {
            state: { id: applicantId, recruitmentId },
  
      })}

   
   
          sx={{ mt: 2 }} // Margin top 16px
        >
          Go to List of Exam 
        </Button>
      </Box>
    </Box>
  );
};

export default ApplicantExamResultAlreadyCreated;
