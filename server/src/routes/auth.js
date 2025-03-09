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

// Google OAuth routes for login
router.get('/google/login',
  (req, res, next) => {
    console.log('Starting Google OAuth login flow...');
    req.session.authType = 'login';
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
    state: 'login'
  })
);

// Google OAuth routes for signup
router.get('/google/signup',
  (req, res, next) => {
    console.log('Starting Google OAuth signup flow...');
    req.session.authType = 'signup';
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
    state: 'signup'
  })
);

// Google OAuth callback
router.get('/google/callback',
  (req, res, next) => {
    console.log('Received Google OAuth callback');
    console.log('Session auth type:', req.session.authType);
    
    // Handle authentication with custom callback
    passport.authenticate('google', { session: true }, (err, user, info) => {
      if (err) {
        console.error('Authentication error:', err);
        const clientUrl = process.env.CLIENT_URL.replace(':80', '');
        return res.redirect(`${clientUrl}/login?error=auth_failed&message=${encodeURIComponent(err.message)}`);
      }

      if (!user) {
        console.log('Authentication failed:', info?.message || 'Unknown reason');
        const clientUrl = process.env.CLIENT_URL.replace(':80', '');
        return res.redirect(`${clientUrl}/login?error=${info?.message || 'auth_failed'}`);
      }

      // Log in the user
      req.logIn(user, (err) => {
        if (err) {
          console.error('Login error:', err);
          const clientUrl = process.env.CLIENT_URL.replace(':80', '');
          return res.redirect(`${clientUrl}/login?error=auth_failed&message=${encodeURIComponent(err.message)}`);
        }

        try {
          console.log('Google OAuth authentication successful');
          
          // Generate JWT token
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '15m'
          });
          
          // Set the JWT token in a cookie
          res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 15 * 60 * 1000, // 15 minutes
            domain: process.env.NODE_ENV === 'production' 
              ? process.env.COOKIE_DOMAIN
              : 'localhost'
          });

          // Determine redirect URL and include token and message in the URL
          const clientUrl = process.env.CLIENT_URL.replace(':80', '');
          const baseRedirectUrl = `${clientUrl}/auth/success`;
          const params = new URLSearchParams();
          
          params.append('token', token);
          
          if (info?.message === 'signup_success') {
            params.append('message', 'signup_success');
            params.append('redirect', '/onboarding');
          } else if (info?.message === 'user_exists') {
            params.append('message', 'user_exists');
            params.append('redirect', '/login');
            params.append('error', 'user_exists');
          } else if (info?.message === 'user_not_found') {
            params.append('message', 'user_not_found');
            params.append('redirect', '/login');
            params.append('error', 'user_not_found');
          } else {
            params.append('message', 'login_success');
            params.append('redirect', '/dashboard');
          }
          
          const redirectUrl = `${baseRedirectUrl}?${params.toString()}`;
          
          console.log('Redirecting to:', redirectUrl);
          res.redirect(redirectUrl);
        } catch (error) {
          console.error('Error in Google OAuth callback:', error);
          const clientUrl = process.env.CLIENT_URL.replace(':80', '');
          res.redirect(`${clientUrl}/login?error=auth_failed&message=${encodeURIComponent(error.message)}`);
        }
      });
    })(req, res, next);
  }
);

// Refresh token
router.post('/refresh-token', isAuthenticated, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not found in session' });
    }

    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: '15m'
    });
    
    // Set the new JWT token in a cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      domain: process.env.NODE_ENV === 'production' 
        ? process.env.COOKIE_DOMAIN
        : 'localhost'
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
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: process.env.NODE_ENV === 'production' 
        ? process.env.COOKIE_DOMAIN
        : 'localhost'
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
