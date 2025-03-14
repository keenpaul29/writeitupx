import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Divider,
  Alert,
  Stack,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../hooks/useAuth';
import LetterGlitch from '../components/LetterGlitch';

const Login = () => {
  const { error } = useAuth();
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Check if there's an error in the URL query params
  const queryParams = new URLSearchParams(location.search);
  const authError = queryParams.get('error');

  const getErrorMessage = (error) => {
    switch (error) {
      case 'auth_failed':
        return 'Authentication failed. Please try again.';
      case 'user_exists':
        return 'An account with this email already exists. Please sign in instead.';
      default:
        return error;
    }
  };

  const handleGoogleAuth = (type) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    window.location.href = `${baseUrl}/api/auth/google/${type}`;
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      {/* Background Glitch Effect */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <LetterGlitch
          glitchSpeed={30}
          centerVignette={true}
          outerVignette={true}
          smooth={true}
          density={1.5}
          style={{
            width: '100vw',
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            transform: 'scale(1.1)',
            filter: 'blur(1px)',
          }}
          letters="WRITEUPX"
        />
      </Box>

      {/* Content */}
      <Container 
        maxWidth="sm" 
        sx={{ 
          position: 'relative', 
          zIndex: 1,
          mt: -8,
        }}
      >
        <Paper 
          elevation={6} 
          sx={{ 
            p: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            boxShadow: (theme) => `0 8px 32px ${theme.palette.primary.main}33`,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 2,
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Welcome to WriteitupX
          </Typography>

          {(error || authError) && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {getErrorMessage(authError || error)}
            </Alert>
          )}

          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            Create and manage your letters with Google Drive integration.
          </Typography>

          <Stack spacing={2} sx={{ mb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<GoogleIcon />}
              onClick={() => handleGoogleAuth('signup')}
              disabled={loading}
              fullWidth
              sx={{ 
                py: 1.5,
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) => `0 6px 16px ${theme.palette.primary.main}40`,
                },
                transition: 'all 0.3s ease-in-out',
                boxShadow: (theme) => `0 4px 12px ${theme.palette.primary.main}33`,
              }}
            >
              {loading ? 'Creating account...' : 'Sign up with Google'}
            </Button>

            <Button
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<GoogleIcon />}
              onClick={() => handleGoogleAuth('login')}
              disabled={loading}
              fullWidth
              sx={{ 
                py: 1.5,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) => `0 6px 16px ${theme.palette.primary.main}20`,
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center"
            sx={{
              opacity: 0.8,
              fontSize: '0.85rem',
            }}
          >
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login; 
