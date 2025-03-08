import React from 'react';
import { Box, useTheme, alpha } from '@mui/material';

const AnimatedBackground = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
        opacity: theme.palette.mode === 'dark' ? 0.4 : 0.6,
      }}
    >
      {/* Animated gradient background */}
      <Box
        sx={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          right: '-50%',
          bottom: '-50%',
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(45deg, 
                ${alpha(theme.palette.primary.dark, 0.3)} 0%,
                ${alpha(theme.palette.primary.main, 0.4)} 25%,
                ${alpha(theme.palette.secondary.dark, 0.3)} 50%,
                ${alpha(theme.palette.primary.main, 0.4)} 75%,
                ${alpha(theme.palette.primary.dark, 0.3)} 100%)`
            : `linear-gradient(45deg, 
                ${alpha(theme.palette.primary.main, 0.2)} 0%,
                ${alpha(theme.palette.primary.dark, 0.3)} 25%,
                ${alpha(theme.palette.secondary.main, 0.2)} 50%,
                ${alpha(theme.palette.primary.main, 0.3)} 75%,
                ${alpha(theme.palette.primary.dark, 0.2)} 100%)`,
          backgroundSize: '400% 400%',
          animation: 'gradientBG 15s ease infinite',
          '@keyframes gradientBG': {
            '0%': {
              backgroundPosition: '0% 50%',
            },
            '50%': {
              backgroundPosition: '100% 50%',
            },
            '100%': {
              backgroundPosition: '0% 50%',
            },
          },
        }}
      />

      {/* Animated patterns */}
      {[...Array(3)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: '60vmax',
            height: '60vmax',
            background: `radial-gradient(50% 50% at 50% 50%, 
              ${alpha(theme.palette.mode === 'dark' 
                ? theme.palette.primary.dark 
                : theme.palette.primary.main, 0.1)} 0%, 
              transparent 100%)`,
            borderRadius: '50%',
            animation: `float-${i} ${20 + i * 5}s linear infinite`,
            '@keyframes float-0': {
              '0%': { transform: 'translate(0%, 0%) rotate(0deg)' },
              '100%': { transform: 'translate(100%, -100%) rotate(360deg)' },
            },
            '@keyframes float-1': {
              '0%': { transform: 'translate(-50%, 0%) rotate(0deg)' },
              '100%': { transform: 'translate(50%, -50%) rotate(-360deg)' },
            },
            '@keyframes float-2': {
              '0%': { transform: 'translate(-100%, -100%) rotate(0deg)' },
              '100%': { transform: 'translate(0%, 0%) rotate(360deg)' },
            },
            top: ['20%', '-20%', '40%'][i],
            left: ['-10%', '60%', '20%'][i],
            filter: theme.palette.mode === 'dark' ? 'brightness(0.7)' : 'none',
          }}
        />
      ))}

      {/* Noise texture overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: theme.palette.mode === 'dark' ? 0.3 : 0.4,
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: theme.palette.mode === 'dark' ? 'color-dodge' : 'overlay',
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
};

export default AnimatedBackground; 