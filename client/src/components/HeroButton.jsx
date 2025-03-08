import React from 'react';
import { Button, Box, useTheme, alpha } from '@mui/material';

const HeroButton = ({ 
  children, 
  variant = 'contained', 
  startIcon, 
  delay = 0,
  className = '',
  ...props 
}) => {
  const theme = useTheme();

  return (
    <Button
      variant={variant}
      startIcon={startIcon && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          animation: 'bounce 2s infinite',
          '@keyframes bounce': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-3px)' }
          }
        }}>
          {startIcon}
        </Box>
      )}
      className={`relative overflow-hidden ${className}`}
      sx={{
        position: 'relative',
        fontSize: { xs: '1.1rem', md: '1.2rem' },
        py: { xs: 1.2, md: 1.5 },
        px: { xs: 3, md: 4 },
        borderRadius: '30px',
        animation: `fadeIn 0.8s ease-out forwards`,
        animationDelay: `${delay}s`,
        opacity: 0,
        '@keyframes fadeIn': {
          from: {
            opacity: 0,
            transform: 'translateY(20px)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        ...(variant === 'contained' ? {
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.35)}`,
          color: 'white',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
            opacity: 0,
            transition: 'opacity 0.3s ease-in-out',
          },
          '& > *': {
            position: 'relative',
            zIndex: 1,
          },
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.45)}`,
            '&::before': {
              opacity: 1,
            },
          },
        } : {
          borderColor: alpha(theme.palette.primary.main, 0.5),
          color: 'text.primary',
          borderWidth: '2px',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: alpha(theme.palette.primary.main, 0.05),
            opacity: 0,
            transition: 'opacity 0.3s ease-in-out',
          },
          '&:hover': {
            borderColor: 'primary.main',
            '&::before': {
              opacity: 1,
            },
          },
        }),
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default HeroButton; 