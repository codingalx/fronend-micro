import React from 'react';
import { Box, Container } from '@mui/material';

const LayoutForCourse = ({ children, subtitle }) => {
  return (
    <Container >
      <Box m="5px 0 0 0" height="75vh">
        {children}
      </Box>
    </Container>
  );
}

export default LayoutForCourse;