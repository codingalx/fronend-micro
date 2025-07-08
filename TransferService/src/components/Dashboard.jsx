import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h3" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="h6" gutterBottom>
        Welcome to the Employee Management System - Transfer Module
      </Typography>
      <Box mt={4} display="flex" flexDirection="column" gap={2} width="100%">
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/create-transfer")}
        >
          Create Transfer
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/list-transfer")}
        >
          List Transfers
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/create-direct-assignment")}
        >
          Create Direct Assignment
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/list-direct-assignment")}
        >
          List Direct Assignments
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
