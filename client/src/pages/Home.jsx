import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  useTheme,
  alpha,
  useMediaQuery,
} from '@mui/material';
import {
  Description,
  AutoAwesome,
  Speed,
  Spellcheck,
  Style,
  Share,
  CloudDone,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import AnimatedBackground from '../components/AnimatedBackground';
import FeatureCard from '../components/FeatureCard';
import HeroText from '../components/HeroText';
import HeroButton from '../components/HeroButton';
import HeroImage from '../components/HeroImage';

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
          minHeight: { xs: 'auto', md: '100vh' },
          display: 'flex',
          alignItems: 'center',
          background: theme.palette.background.default,
          py: { xs: 4, md: 6 },
        }}
      >
        <AnimatedBackground />
        
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
              <Box>
                <HeroText
                  text="Write Better Letters with AI"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem', lg: '4rem' },
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    mb: { xs: 2, md: 3 },
                  }}
                />
                <HeroText
                  text="Create professional letters with AI assistance and seamless Google Drive integration"
                  variant="h5"
                  delay={0.4}
                  sx={{
                    color: 'text.secondary',
                    mb: { xs: 3, md: 4 },
                    fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' },
                    fontWeight: 400,
                    lineHeight: 1.4,
                    maxWidth: '600px',
                    mx: { xs: 'auto', md: 0 },
                  }}
                />
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  flexWrap: 'wrap',
                }}>
                  <HeroButton
                    component={RouterLink}
                    to={isAuthenticated ? "/dashboard" : "/login"}
                    startIcon={isAuthenticated ? <Description /> : <AutoAwesome />}
                    delay={0.8}
                  >
                    {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
                  </HeroButton>
                  {!isAuthenticated && (
                    <HeroButton
                      variant="outlined"
                      component={RouterLink}
                      to="/demo"
                      delay={1}
                    >
                      Watch Demo
                    </HeroButton>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid 
              item 
              xs={12} 
              md={6}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <HeroImage />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          px: 2,
          background: alpha(theme.palette.primary.main, 0.03),
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: `linear-gradient(180deg, 
              ${alpha(theme.palette.primary.main, 0.05)} 0%, 
              ${alpha(theme.palette.background.default, 0)} 100%)`,
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <HeroText
            text="Powerful Features for Better Writing"
            variant="h2"
            sx={{
              textAlign: 'center',
              mb: { xs: 6, md: 8 },
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          />
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard {...feature} delay={0.2 + index * 0.1} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 