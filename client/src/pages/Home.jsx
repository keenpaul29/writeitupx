import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Description,
  Edit,
  Save,
  Security,
  Speed,
  AutoAwesome,
  CloudDone,
  Psychology,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import LetterGlitch from '../components/LetterGlitch';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const theme = useTheme();

  return (
    <Box sx={{ overflow: 'hidden', position: 'relative' }}>
      {/* Hero Section with Glitch Effect Background */}
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.92)} 0%, ${alpha(theme.palette.primary.main, 0.85)} 100%)`,
            zIndex: 1,
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '-5%',
            left: '-5%',
            width: '110%',
            height: '110%',
            zIndex: 0,
            overflow: 'hidden',
          }}
        >
          <LetterGlitch
            glitchSpeed={30}
            centerVignette={true}
            outerVignette={true}
            smooth={true}
            density={2}
            style={{
              width: '100%',
              height: '100%',
              transform: 'scale(1.2)',
              filter: 'blur(0.5px)',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            letters="WRITEUPX"
          />
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: 'white',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  mb: 2,
                }}
              >
                Write Better Letters with AI
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  mb: 4,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                }}
              >
                Create professional letters with AI assistance and seamless Google Drive integration
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: 'white',
                  color: theme.palette.primary.main,
                  fontSize: '1.2rem',
                  py: 1.5,
                  px: 4,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.9),
                  },
                }}
                component={RouterLink}
                to={isAuthenticated ? "/dashboard" : "/login"}
                startIcon={isAuthenticated ? <Description /> : <AutoAwesome />}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
              </Button>
            </Grid>
            <Grid 
              item 
              xs={12} 
              md={6}
              sx={{
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 500,
                  height: 400,
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  transform: 'perspective(1000px) rotateY(-5deg)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'perspective(1000px) rotateY(0deg)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
                    zIndex: 2,
                  },
                }}
              >
                <Box
                  component="img"
                  src="/hero-image.jpg"
                  alt="AI-powered letter writing"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.9)',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: alpha(theme.palette.primary.dark, 0.2),
                    backdropFilter: 'blur(2px)',
                    zIndex: 1,
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          component="h2"
          align="center"
          sx={{
            fontWeight: 700,
            mb: 6,
            fontSize: { xs: '2rem', md: '2.5rem' },
          }}
        >
          Powerful Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.03),
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <Typography variant="h5" component="h3" gutterBottom color="primary">
                AI-Powered Writing
              </Typography>
              <List>
                {[
                  {
                    icon: <Psychology />,
                    primary: 'Smart Suggestions',
                    secondary: 'Get real-time writing improvements and recommendations',
                  },
                  {
                    icon: <AutoAwesome />,
                    primary: 'Style Enhancement',
                    secondary: 'Perfect your tone and style for any professional context',
                  },
                  {
                    icon: <Save />,
                    primary: 'Auto-Save',
                    secondary: 'Never lose your work with automatic saving as you type',
                  },
                ].map((item, index) => (
                  <ListItem key={index} sx={{ py: 2 }}>
                    <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.primary}
                      secondary={item.secondary}
                      primaryTypographyProps={{
                        fontWeight: 600,
                        gutterBottom: true,
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.03),
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <Typography variant="h5" component="h3" gutterBottom color="primary">
                Seamless Integration
              </Typography>
              <List>
                {[
                  {
                    icon: <CloudDone />,
                    primary: 'Google Drive Sync',
                    secondary: 'Automatic backup and sync with your Google Drive',
                  },
                  {
                    icon: <Speed />,
                    primary: 'Real-time Updates',
                    secondary: 'Changes are instantly saved and synced across devices',
                  },
                  {
                    icon: <Security />,
                    primary: 'Secure Access',
                    secondary: 'Protected with Google OAuth authentication',
                  },
                ].map((item, index) => (
                  <ListItem key={index} sx={{ py: 2 }}>
                    <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.primary}
                      secondary={item.secondary}
                      primaryTypographyProps={{
                        fontWeight: 600,
                        gutterBottom: true,
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h2"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 6,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            How It Works
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 4 },
              backgroundColor: 'white',
              borderRadius: 2,
            }}
          >
            <List>
              {[
                {
                  step: '01',
                  icon: <Security sx={{ fontSize: 30 }} />,
                  primary: 'Sign In with Google',
                  secondary: 'Securely connect your Google account for seamless access to all features',
                },
                {
                  step: '02',
                  icon: <Edit sx={{ fontSize: 30 }} />,
                  primary: 'Create & Edit Letters',
                  secondary: 'Write your content with AI assistance providing real-time suggestions and improvements',
                },
                {
                  step: '03',
                  icon: <CloudDone sx={{ fontSize: 30 }} />,
                  primary: 'Save & Share',
                  secondary: 'Your letters are automatically saved to Google Drive and ready to share with your team',
                },
              ].map((step, index) => (
                <ListItem
                  key={index}
                  sx={{
                    py: 3,
                    borderBottom: 
                      index < 2 ? `1px solid ${alpha(theme.palette.primary.main, 0.1)}` : 'none',
                  }}
                >
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: theme.palette.primary.main,
                      }}
                    >
                      {step.icon}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="h6" gutterBottom>
                        {step.primary}
                      </Typography>
                    }
                    secondary={step.secondary}
                    sx={{ ml: 2 }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: 700,
            mb: 3,
            fontSize: { xs: '1.75rem', md: '2.25rem' },
          }}
        >
          Ready to Write Better Letters?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Join thousands of professionals who trust WriteitupX for their letter writing needs
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={RouterLink}
          to={isAuthenticated ? "/dashboard" : "/login"}
          startIcon={<AutoAwesome />}
          sx={{
            py: 2,
            px: 4,
            fontSize: '1.1rem',
          }}
        >
          {isAuthenticated ? 'Go to Dashboard' : 'Start Writing Now'}
        </Button>
      </Container>
    </Box>
  );
};

export default Home; 