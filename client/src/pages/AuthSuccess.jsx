import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography, Container, Alert } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const AuthSuccess = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuth = async () => {
      try {
        console.log('AuthSuccess: Starting authentication process');
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        
        if (!token) {
          console.error('AuthSuccess: No token found in URL parameters');
          setStatus('error');
          setMessage('No authentication token found');
          return;
        }

        console.log('AuthSuccess: Found token, verifying...');
        // Verify token format
        if (token.split('.').length !== 3) {
          console.error('AuthSuccess: Invalid token format');
          setStatus('error');
          setMessage('Invalid token format');
          return;
        }

        console.log('AuthSuccess: Attempting login with token');
        const success = await login(token);
        
        if (success) {
          console.log('AuthSuccess: Login successful');
          setStatus('success');
          setMessage('Successfully signed in! Redirecting to dashboard...');
          
          // Verify token was stored
          const storedToken = localStorage.getItem('token');
          if (!storedToken) {
            console.error('AuthSuccess: Token not stored after successful login');
            setStatus('error');
            setMessage('Failed to store authentication token');
            return;
          }

          console.log('AuthSuccess: Token stored successfully, preparing redirect');
          // Add a small delay before redirecting to show the success message
          setTimeout(() => {
            console.log('AuthSuccess: Redirecting to dashboard');
            navigate('/dashboard', { replace: true });
          }, 1500);
        } else {
          console.error('AuthSuccess: Login failed');
          setStatus('error');
          setMessage('Failed to authenticate. Please try again.');
        }
      } catch (err) {
        console.error('AuthSuccess: Error during authentication:', err);
        setStatus('error');
        setMessage('An error occurred during authentication');
      }
    };
    
    handleAuth();
  }, [login, navigate, location]);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('AuthSuccess: Already authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

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
          py: 4,
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
          <Alert 
            severity="error" 
            sx={{ width: '100%' }}
            action={
              <button
                onClick={() => {
                  console.log('AuthSuccess: Returning to login page');
                  navigate('/login');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  color: 'inherit'
                }}
              >
                Return to Login
              </button>
            }
          >
            {message}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default AuthSuccess; 