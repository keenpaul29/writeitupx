import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CircularProgress, Alert, Button } from '@mui/material';
import axios from 'axios';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const token = searchParams.get('token');
        const message = searchParams.get('message');
        const redirect = searchParams.get('redirect');
        const error = searchParams.get('error');

        console.log('Auth Success Page - Received params:', {
          message,
          redirect,
          hasToken: !!token,
          error
        });

        if (error) {
          console.error('Authentication error:', error);
          setError(error === 'user_exists' 
            ? 'An account with this email already exists. Please log in instead.' 
            : error);
          setTimeout(() => {
            navigate('/login', { replace: true, state: { error } });
          }, 2000);
          return;
        }

        if (!token) {
          throw new Error('No authentication token received');
        }

        // Store token in localStorage
        localStorage.setItem('token', token);
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Verify token storage
        const storedToken = localStorage.getItem('token');
        console.log('Token stored successfully:', storedToken === token);
        console.log('Authorization header set:', axios.defaults.headers.common['Authorization']);

        const loginSuccess = await login(token);
        
        if (!loginSuccess) {
          // If login failed, clean up token
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          throw new Error('Failed to authenticate with the provided token');
        }

        console.log('Login successful, redirecting to:', redirect || '/dashboard');
        
        // Short delay to show success message
        setTimeout(() => {
          navigate(redirect || '/dashboard', { replace: true });
        }, 1000);
      } catch (error) {
        console.error('Auth success page error:', error);
        // Clean up any token if there was an error
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setError(error.message);
        setTimeout(() => {
          navigate('/login', { 
            replace: true, 
            state: { error: error.message } 
          });
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    handleAuth();
  }, [navigate, searchParams, login]);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get('redirect');
      navigate(redirect || '/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate, searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Alert 
          severity="error" 
          className="max-w-md"
          action={
            <Button 
              color="inherit" 
              size="small"
              onClick={() => navigate('/login', { replace: true })}
            >
              Go to Login
            </Button>
          }
        >
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Alert severity="success" className="max-w-md">
        Authentication successful! Redirecting...
      </Alert>
    </div>
  );
};

export default AuthSuccess; 