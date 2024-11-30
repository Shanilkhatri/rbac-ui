import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, mockLogin } from '../services/authService';
import { TextField, Button, Container, Typography } from '@mui/material';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (mockLogin(username, password)) {
      localStorage.setItem('authToken', 'mockToken'); // mocking an auth token
      navigate('/users');
    } else {
      setError(true);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '10vh' }}>
      <Typography variant="h4" gutterBottom>
        Login to RBAC Dashboard
      </Typography>
      
      <TextField
        label="Username"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
      />
      {error && <Typography color="error">Invalid username or password</Typography>}
      <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
        Login
      </Button>
    </Container>
  );
};

export default LoginPage;
