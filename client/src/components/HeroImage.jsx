import React from 'react';
import { Box, useTheme, alpha } from '@mui/material';

const HeroImage = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: { xs: 400, md: 500 },
        height: { xs: 300, md: 400 },
        perspective: '1000px',
      }}
    >
      {/* Main image container with 3D effect */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: '24px',
          overflow: 'hidden',
          transformStyle: 'preserve-3d',
          transform: 'rotateY(-5deg) rotateX(5deg)',
          transition: 'all 0.5s ease-in-out',
          animation: 'float 6s ease-in-out infinite',
          boxShadow: `
            0 20px 40px ${alpha(theme.palette.common.black, 0.2)},
            0 0 0 1px ${alpha(theme.palette.primary.main, 0.1)}
          `,
          '&:hover': {
            transform: 'rotateY(0deg) rotateX(0deg) translateY(-10px)',
            '& .glow-effect': {
              opacity: 0.8,
            },
            '& .hero-image': {
              transform: 'scale(1.05)',
            },
          },
          '@keyframes float': {
            '0%, 100%': {
              transform: 'rotateY(-5deg) rotateX(5deg) translateY(0)',
            },
            '50%': {
              transform: 'rotateY(-5deg) rotateX(5deg) translateY(-20px)',
            },
          },
        }}
      >
        {/* Hero Image */}
        <Box
          className="hero-image"
          component="img"
          src="/hero.jpg"
          alt="AI-powered letter writing"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease-in-out',
          }}
        />

        {/* Glow effect */}
        <Box
          className="glow-effect"
          sx={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: `radial-gradient(circle at center, 
              ${alpha(theme.palette.primary.main, 0.3)} 0%,
              transparent 70%)`,
            opacity: 0.5,
            transition: 'opacity 0.3s ease-in-out',
            mixBlendMode: 'soft-light',
            pointerEvents: 'none',
          }}
        />

        {/* Border gradient */}
        <Box
          sx={{
            position: 'absolute',
            inset: '-2px',
            borderRadius: 'inherit',
            padding: '2px',
            background: `linear-gradient(135deg, 
              ${alpha(theme.palette.primary.main, 0.5)},
              ${alpha(theme.palette.secondary.main, 0.5)})`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      </Box>

      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '-10%',
          width: '120%',
          height: '120%',
          background: `radial-gradient(circle at 30% 70%, 
            ${alpha(theme.palette.primary.main, 0.1)} 0%,
            transparent 50%)`,
          filter: 'blur(40px)',
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '120%',
          height: '120%',
          background: `radial-gradient(circle at 70% 30%, 
            ${alpha(theme.palette.secondary.main, 0.1)} 0%,
            transparent 50%)`,
          filter: 'blur(40px)',
          zIndex: -1,
        }}
      />
    </Box>
  );
};

export default HeroImage; 