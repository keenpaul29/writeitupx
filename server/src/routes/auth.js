const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

// Check authentication status
router.get('/check-status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ 
      authenticated: true,
      user: req.user
    });
  } else {
    res.json({ 
      authenticated: false,
      user: null
    });
  }
});

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { 
    scope: [
      'profile', 
      'email',
      'https://www.googleapis.com/auth/drive.file'
    ],
    accessType: 'offline',
    prompt: 'consent'
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
    session: true
  }),
  (req, res) => {
    try {
      const token = jwt.sign(
        { 
          id: req.user.id,
          email: req.user.email,
          name: req.user.name
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '15m' }
      );

      // Redirect to client with token
      res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}`);
    } catch (error) {
      console.error('Token generation error:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=token_failed`);
    }
  }
);

// Refresh token
router.post('/refresh-token', isAuthenticated, async (req, res) => {
  try {
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
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;