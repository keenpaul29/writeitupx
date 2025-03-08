const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { handleError, AuthError, errorTypes } = require('../utils/errorHandler');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  throw new AuthError('Authentication required', 'AUTH_REQUIRED', 401);
};

// Check authentication status
router.get('/check-status', (req, res) => {
  try {
    if (!req.user) {
      return res.json({ 
        authenticated: false,
        user: null
      });
    }

    res.json({ 
      authenticated: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        avatar: req.user.avatar
      }
    });
  } catch (error) {
    handleError(error, req, res);
  }
});

// Google OAuth routes
router.get('/google',
  (req, res, next) => {
    passport.authenticate('google', { 
      scope: [
        'profile', 
        'email',
        'https://www.googleapis.com/auth/drive.file'
      ],
      accessType: 'offline',
      prompt: 'consent'
    })(req, res, next);
  }
);

router.get('/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { 
      failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
      session: true
    })(req, res, next);
  }
);

// Refresh token
router.post('/refresh-token', isAuthenticated, async (req, res) => {
  try {
    if (!req.user) {
      throw new AuthError('User not found', 'USER_NOT_FOUND', 404);
    }

    const token = jwt.sign(
      { 
        id: req.user.id,
        email: req.user.email,
        name: req.user.name
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '15m' }
    );

    res.json({ token });
  } catch (error) {
    handleError(error, req, res);
  }
});

// Logout route
router.get('/logout', (req, res) => {
  try {
    const userId = req.user?.id;
    
    req.logout((err) => {
      if (err) {
        throw new AuthError('Logout failed', 'LOGOUT_FAILED', 500);
      }
      
      // Log successful logout
      console.log('Successful logout:', {
        userId,
        timestamp: new Date().toISOString()
      });

      res.json({ message: 'Logged out successfully' });
    });
  } catch (error) {
    handleError(error, req, res);
  }
});

module.exports = router;
