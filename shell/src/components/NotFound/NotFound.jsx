import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import notFoundImage from '../../assets/svg/notFoundImage.jpg'; // Replace with your own image

// Styled component for the container
const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  width: "100vw",
  textAlign: "center",
  background: 'linear-gradient(135deg, #ff6b6b 0%, #f7a5a5 100%)', // Vibrant gradient background
  padding: theme.spacing(2), // Reduced padding
  overflow: "hidden",
}));

// Styled component for the card
const Card = styled(Box)(({ theme }) => ({
  backgroundColor: "white",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[10],
  padding: theme.spacing(3), // Reduced padding
  maxWidth: 400,
  width: '100%',
  animation: 'fadeIn 0.5s ease-in-out', // Animation for the card
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
}));

// Styled component for the image
const Image = styled('img')({
  width: '80%',
  height: 'auto',
  marginBottom: '16px',
  borderRadius: '8px', // Rounded corners for the image
});

const NotFound = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/dashboard"); // Navigate to home or any desired route
  };

  return (
    <Container>
      <Card>
        <Image src={notFoundImage} alt="Not Found" />
        <Typography variant="h4" color="error" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Sorry, the page you are looking for does not exist. It might have been removed or you might have typed the wrong URL.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleBackToHome} sx={{ marginTop: 2 }}>
          Go Back to Home
        </Button>
      </Card>
    </Container>
  );
};

export default NotFound;