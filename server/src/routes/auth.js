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
    prompt: 'consent',
    accessType: 'offline'
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login?error=auth_failed',
    session: true
  }),
  (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
        expiresIn: '15m'
      });

      // Determine client URL
      const clientUrl = process.env.NODE_ENV === 'production'
        ? process.env.CLIENT_URL || 'https://writeitupx.netlify.app'
        : 'http://localhost:3000';

      // Redirect to client with token
      res.redirect(`${clientUrl}/auth-success?token=${token}`);
    } catch (error) {
      console.error('Callback error:', error);
      res.redirect(`${clientUrl}/login?error=auth_failed`);
    }
  }
);

// Refresh token
router.post('/refresh-token', isAuthenticated, (req, res) => {
  const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
    expiresIn: '15m'
  });
  res.json({ token });
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate request body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '15m'
    });

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
