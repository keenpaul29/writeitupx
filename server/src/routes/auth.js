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
  (req, res, next) => {
    console.log('Starting Google OAuth flow...');
    next();
  },
  passport.authenticate('google', { 
    scope: [
      'profile',
      'email',
      'https://www.googleapis.com/auth/drive.file'
    ],
    prompt: 'select_account',
    accessType: 'offline',
  })
);

router.get('/google/callback',
  (req, res, next) => {
    console.log('Received Google OAuth callback');
    passport.authenticate('google', { 
      failureRedirect: '/login?error=auth_failed',
      session: true
    })(req, res, next);
  },
  (req, res) => {
    try {
      console.log('Google OAuth authentication successful');
      const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
        expiresIn: '15m'
      });
      
      // Set the JWT token in a cookie
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      // Redirect to the dashboard
      const redirectUrl = process.env.NODE_ENV === 'production'
        ? `${process.env.CLIENT_URL}/dashboard`
        : 'http://localhost:3000/dashboard';
      
      console.log('Redirecting to:', redirectUrl);
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Error in Google OAuth callback:', error);
      res.redirect('/login?error=auth_failed');
    }
  }
);

// Refresh token
router.post('/refresh-token', isAuthenticated, (req, res) => {
  try {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: '15m'
    });
    
    // Set the new JWT token in a cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.json({ token });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ message: 'Error refreshing token' });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ message: 'Error logging out' });
    }
    
    // Clear the JWT cookie
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    
    res.json({ message: 'Logged out successfully' });
  });
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

    // Set the JWT token in a cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
