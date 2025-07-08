import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import accessDeniedImage from '../../assets/svg/notPossible.png'; // Use a more appealing image if you have one

// Styled component for the container
const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  width: "100vw",
  textAlign: "center",
  background: 'linear-gradient(135deg, #3a6087 0%, #1f3c58 100%)', // Darker gradient background like the button
  padding: theme.spacing(4),
  overflow: "hidden",
}));

// Styled component for the card
const Card = styled(Box)(({ theme }) => ({
  backgroundColor: "white",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[10],
  padding: theme.spacing(4),
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
  width: '100%',
  height: 'auto',
  marginBottom: '16px',
  borderRadius: '8px', // Rounded corners for the image
});

const AccessDenied = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/dashboard");
  };

  return (
    <Container>
      <Card>
        <Image src={accessDeniedImage} alt="Access Denied" />
        <Typography variant="h4" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Sorry, you do not have permission to access this page. Please check your credentials or contact support.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleBackToHome} sx={{ marginTop: 2 }}>
          Go Back to Home
        </Button>
      </Card>
    </Container>
  );
};

export default AccessDenied;