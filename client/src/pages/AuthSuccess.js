import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography, Container } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const AuthSuccess = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        
        if (!token) {
          setError('No authentication token found');
          return;
        }
        
        const success = await login(token);
        
        if (success) {
          navigate('/dashboard');
        } else {
          setError('Failed to authenticate');
        }
      } catch (err) {
        console.error('Auth success error:', err);
        setError('An error occurred during authentication');
      }
    };
    
    handleAuth();
  }, [login, navigate, location]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
        }}
      >
        {error ? (
          <Typography variant="h6" color="error" align="center">
            {error}
          </Typography>
        ) : (
          <>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6" align="center">
              Authentication successful! Redirecting...
            </Typography>
          </>
        )}
      </Box>
    </Container>
  );
};

export default AuthSuccess; 