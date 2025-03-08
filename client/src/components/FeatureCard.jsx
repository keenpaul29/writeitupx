import React from 'react';
import { Box, Paper, Typography, useTheme, alpha } from '@mui/material';

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      className="glass-effect"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        p: 3,
        height: '100%',
        transition: 'all 0.3s ease-in-out',
        animation: `fadeInUp 0.6s ease-out forwards ${delay}s`,
        opacity: 0,
        transform: 'translateY(20px)',
        '@keyframes fadeInUp': {
          from: {
            opacity: 0,
            transform: 'translateY(20px)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
          '& .icon-wrapper': {
            transform: 'scale(1.1) rotate(5deg)',
            backgroundColor: alpha(theme.palette.primary.main, 0.15),
          },
          '&::after': {
            opacity: 1,
          },
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette.primary.main, 0.1)} 0%, 
            ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          opacity: 0.5,
          transition: 'opacity 0.3s ease-in-out',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette.primary.main, 0.2)} 0%, 
            ${alpha(theme.palette.secondary.main, 0.2)} 100%)`,
          opacity: 0,
          transition: 'opacity 0.3s ease-in-out',
        },
      }}
    >
      <Box
        className="icon-wrapper"
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'inline-flex',
          p: 2,
          borderRadius: 3,
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          color: 'primary.main',
          mb: 2,
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Icon sx={{ fontSize: 32 }} />
      </Box>
      <Typography
        variant="h6"
        component="h3"
        sx={{
          position: 'relative',
          zIndex: 1,
          mb: 1,
          fontWeight: 600,
          color: 'text.primary',
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          position: 'relative',
          zIndex: 1,
          color: 'text.secondary',
          lineHeight: 1.6,
        }}
      >
        {description}
      </Typography>
    </Paper>
  );
};

export default FeatureCard; 