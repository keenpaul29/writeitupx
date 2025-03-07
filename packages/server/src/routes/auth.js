const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Assuming a User model exists

// Get user info
router.get('/user', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            email: req.user.email,
            name: req.user.name,
            isGoogleUser: req.user.isGoogleUser
        }
    });
});

// User registration route
router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = new User({
            email,
            password,
            name,
            isGoogleUser: false
        });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Email/Password login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if it's a Google user trying to use password login
        if (user.isGoogleUser) {
            return res.status(400).json({ message: 'Please use Google Sign-In for this account' });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRY || '24h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Check user status route
router.get('/check-status', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200).json({
        authenticated: true,
        user: {
            id: req.user._id,
            email: req.user.email,
            name: req.user.name,
            isGoogleUser: req.user.isGoogleUser
        }
    });
});

// Google OAuth login route
router.get('/google', (req, res, next) => {
    console.log('Starting Google OAuth flow');
    passport.authenticate('google', { 
        scope: [
            'profile', 
            'email', 
            'https://www.googleapis.com/auth/drive.file'
        ],
        accessType: 'offline',
        prompt: 'consent'
    })(req, res, next);
});

// Google OAuth callback route
router.get('/google/callback',
    passport.authenticate('google', { 
        session: false,
        failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`
    }),
    async (req, res) => {
        try {
            // Generate JWT token
            const token = jwt.sign(
                { id: req.user._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRY || '24h' }
            );

            // Log successful authentication
            console.log('Authentication successful for user:', req.user.email);

            // Redirect to the client with the token
            const redirectUrl = new URL('/auth/success', process.env.CLIENT_URL);
            redirectUrl.searchParams.append('token', token);
            
            res.redirect(redirectUrl.toString());
        } catch (error) {
            console.error('Token generation error:', error);
            res.redirect(`${process.env.CLIENT_URL}/login?error=token_failed`);
        }
    }
);

module.exports = router;
