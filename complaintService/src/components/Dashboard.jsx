import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Box m="20px" textAlign="center">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        gap="20px"
        alignItems="center"
        mt="20px"
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/create-complaint")}
        >
          Create Complaint
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/list-complaints")}
        >
          List Complaints
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/create-complaint-type")}
        >
          Create Complaint Type
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/list-complaint-handlings-by-department")}
        >
          List Complaint Handlings By Department
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
