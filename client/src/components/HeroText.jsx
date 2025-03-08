import React from 'react';
import { Typography, Box, useTheme } from '@mui/material';

const HeroText = ({ text, variant = 'h1', className = '', delay = 0, ...props }) => {
  const theme = useTheme();
  const words = text.split(' ');

  return (
    <Typography
      variant={variant}
      className={`relative ${className}`}
      {...props}
    >
      {words.map((word, i) => (
        <Box
          key={i}
          component="span"
          sx={{
            display: 'inline-block',
            animation: `fadeSlideUp 0.8s ease-out forwards`,
            animationDelay: `${delay + i * 0.1}s`,
            opacity: 0,
            transform: 'translateY(20px)',
            marginRight: '0.3em',
            '@keyframes fadeSlideUp': {
              from: {
                opacity: 0,
                transform: 'translateY(20px)',
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              height: '2px',
              background: `linear-gradient(90deg, 
                ${theme.palette.primary.main} 0%, 
                ${theme.palette.secondary.main} 100%)`,
              transform: 'scaleX(0)',
              transformOrigin: 'right',
              transition: 'transform 0.6s ease-out',
              animationDelay: `${delay + words.length * 0.1 + 0.3}s`,
            },
            '&:hover::after': {
              transform: 'scaleX(1)',
              transformOrigin: 'left',
            },
          }}
        >
          {word}
        </Box>
      ))}
    </Typography>
  );
};

export default HeroText; 