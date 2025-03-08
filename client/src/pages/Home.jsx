import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  useTheme,
  alpha,
  useMediaQuery,
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
  Spellcheck,
  Style,
  Share,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import FeatureCard from '../components/FeatureCard';

const features = [
  {
    icon: AutoAwesome,
    title: 'AI-Powered Writing',
    description: 'Get intelligent suggestions and improvements for your letters using advanced AI technology.',
  },
  {
    icon: Speed,
    title: 'Quick Generation',
    description: 'Create professional letters in minutes with smart templates and automated formatting.',
  },
  {
    icon: Style,
    title: 'Custom Styling',
    description: 'Choose from a variety of professional templates and customize them to match your brand.',
  },
  {
    icon: Spellcheck,
    title: 'Grammar Check',
    description: 'Ensure error-free writing with advanced grammar and spell checking.',
  },
  {
    icon: CloudDone,
    title: 'Cloud Integration',
    description: 'Seamlessly save and access your letters through Google Drive integration.',
  },
  {
    icon: Share,
    title: 'Easy Sharing',
    description: 'Share your letters with colleagues and collaborate in real-time.',
  },
];

const Home = () => {
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          pt: { xs: 8, md: 0 },
          pb: { xs: 4, md: 0 },
          background: `linear-gradient(to bottom, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.background.default, 1)})`,
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid 
            container 
            spacing={{ xs: 4, md: 8 }} 
            alignItems="center"
            sx={{ 
              flexDirection: { xs: 'column-reverse', md: 'row' },
              textAlign: { xs: 'center', md: 'left' }
            }}
          >
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  animation: 'slideUp 0.8s ease-out',
                  '@keyframes slideUp': {
                    from: {
                      opacity: 0,
                      transform: 'translateY(30px)',
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem', lg: '4rem' },
                    mb: 2,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  WriteUpX
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    mb: 4,
                    color: 'text.secondary',
                  }}
                >
                  Create Professional Letters with AI
                </Typography>
                <Button
                  component={RouterLink}
                  to={isAuthenticated ? "/dashboard" : "/login"}
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    py: 2,
                    fontSize: '1.2rem',
                    borderRadius: 2,
                    boxShadow: theme.shadows[4],
                  }}
                >
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: '300px', md: '500px' },
                  animation: 'float 6s ease-in-out infinite',
                  '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                  },
                }}
              >
                <img
                  src="/hero.jpg"
                  alt="WriteUpX Hero"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          px: 2,
          background: theme.palette.background.default,
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: { xs: 6, md: 8 },
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            Features
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard {...feature} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 
