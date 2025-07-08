import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container } from '@mui/material';
import AuthContext from 'shell/AuthContext'; 

function AppLogout() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="xs">
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
        >
          Logout
        </Button>
    </Container>
  );
}

export default AppLogout;