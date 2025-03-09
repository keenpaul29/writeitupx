import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography, Container, Alert } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const AuthSuccess = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        
        if (!token) {
          setStatus('error');
          setMessage('No authentication token found');
          return;
        }

        console.log('Attempting to login with token...');
        const success = await login(token);
        
        if (success) {
          setStatus('success');
          setMessage('Successfully signed in! Redirecting to dashboard...');
          // Add a small delay before redirecting to show the success message
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          setStatus('error');
          setMessage('Failed to authenticate. Please try again.');
        }
      } catch (err) {
        console.error('Auth success error:', err);
        setStatus('error');
        setMessage('An error occurred during authentication');
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
          gap: 2,
        }}
      >
        {status === 'loading' && (
          <>
            <CircularProgress size={60} />
            <Typography variant="h6" align="center">
              Completing sign in...
            </Typography>
          </>
        )}

        {status === 'success' && (
          <Alert severity="success" sx={{ width: '100%' }}>
            {message}
          </Alert>
        )}

        {status === 'error' && (
          <Alert severity="error" sx={{ width: '100%' }}>
            {message}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default AuthSuccess; 