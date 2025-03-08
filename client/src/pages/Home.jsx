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
import LetterGlitch from '../components/LetterGlitch';
import FeatureCard from '../components/FeatureCard';
import AnimatedBackground from '../components/AnimatedBackground';

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
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    mb: { xs: 2, md: 3 },
                  }}
                >
                  Write Better Letters with AI
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'text.secondary',
                    mb: { xs: 3, md: 4 },
                    fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' },
                    fontWeight: 400,
                    lineHeight: 1.4,
                    maxWidth: '600px',
                    mx: { xs: 'auto', md: 0 },
                  }}
                >
                  Create professional letters with AI assistance and seamless Google Drive integration
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  flexWrap: 'wrap',
                }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      fontSize: { xs: '1.1rem', md: '1.2rem' },
                      py: { xs: 1.2, md: 1.5 },
                      px: { xs: 3, md: 4 },
                      borderRadius: '30px',
                      boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.35)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.45)}`,
                      },
                    }}
                    component={RouterLink}
                    to={isAuthenticated ? "/dashboard" : "/login"}
                    startIcon={
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        animation: 'bounce 2s infinite',
                        '@keyframes bounce': {
                          '0%, 100%': { transform: 'translateY(0)' },
                          '50%': { transform: 'translateY(-3px)' }
                        }
                      }}>
                        {isAuthenticated ? <Description /> : <AutoAwesome />}
                      </Box>
                    }
                  >
                    {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
                  </Button>
                  {!isAuthenticated && (
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                        color: 'text.primary',
                        fontSize: { xs: '1.1rem', md: '1.2rem' },
                        py: { xs: 1.2, md: 1.5 },
                        px: { xs: 3, md: 4 },
                        borderRadius: '30px',
                        borderWidth: '2px',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        },
                      }}
                      component={RouterLink}
                      to="/demo"
                    >
                      Watch Demo
                    </Button>
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
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: { xs: 400, md: 500 },
                  height: { xs: 300, md: 400 },
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.2)}`,
                  transform: 'perspective(1000px) rotateY(-5deg)',
                  transition: 'all 0.5s ease-in-out',
                  animation: 'float 6s ease-in-out infinite',
                  '@keyframes float': {
                    '0%, 100%': {
                      transform: 'perspective(1000px) rotateY(-5deg) translateY(0)',
                    },
                    '50%': {
                      transform: 'perspective(1000px) rotateY(-5deg) translateY(-20px)',
                    },
                  },
                  '&:hover': {
                    transform: 'perspective(1000px) rotateY(0deg) translateY(-10px)',
                  },
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
                  }}
                  letters="WRITEUPX"
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
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: { xs: 6, md: 8 },
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
              background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${alpha(theme.palette.text.primary, 0.8)})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Powerful Features for Better Writing
          </Typography>
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