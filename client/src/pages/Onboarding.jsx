import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const Onboarding = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const steps = [
    'Welcome',
    'Google Drive Setup',
    'Ready to Start',
  ];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      navigate('/dashboard');
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" gutterBottom>
              Welcome to WriteitupX, {user?.name}!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We're excited to help you create and manage your letters with ease.
              Let's get you set up in just a few steps.
            </Typography>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" gutterBottom>
              Google Drive Integration
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Your letters will be automatically saved to your Google Drive.
              This helps you access them from anywhere and keeps them secure.
            </Typography>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" gutterBottom>
              You're All Set!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Your account is now configured and ready to use.
              Click "Get Started" to begin creating your first letter.
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            backgroundColor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {getStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) => `0 6px 16px ${theme.palette.primary.main}40`,
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              {activeStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Onboarding; 