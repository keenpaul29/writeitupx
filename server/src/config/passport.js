const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

// Validate required environment variables
const requiredEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'JWT_SECRET',
  'CLIENT_URL',
  'SERVER_URL'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

// Ensure URLs are properly set
const SERVER_URL = process.env.SERVER_URL;
const CLIENT_URL = process.env.CLIENT_URL;

console.log('Environment Configuration:');
console.log('- Server URL:', SERVER_URL);
console.log('- Client URL:', CLIENT_URL);
console.log('- Environment:', process.env.NODE_ENV);

const callbackURL = `${SERVER_URL}/api/auth/google/callback`;
console.log('- Google OAuth callback URL:', callbackURL);

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL,
    passReqToCallback: true,
    proxy: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google OAuth callback received');
      console.log('Profile:', {
        id: profile.id,
        email: profile.emails?.[0]?.value,
        name: profile.displayName
      });
      
      // Validate Google profile
      if (!profile) {
        console.error('No profile received from Google');
        return done(new Error('No profile received from Google'));
      }

      if (!profile.id) {
        console.error('No Google ID in profile');
        return done(new Error('No Google ID in profile'));
      }

      if (!profile.emails || !profile.emails[0]?.value) {
        console.error('No email found in Google profile');
        return done(new Error('No email found in Google profile'));
      }

      const email = profile.emails[0].value;
      
      // Check if user already exists
      let user;
      try {
        user = await User.findOne({ 
          $or: [
            { googleId: profile.id },
            { email: email }
          ]
        });
      } catch (error) {
        console.error('Database error while finding user:', error);
        return done(new Error('Database error while finding user'));
      }
      
      const isSignUp = req.query.state === 'signup';
      console.log('Auth type:', isSignUp ? 'signup' : 'login');
      
      if (!user) {
        if (!isSignUp) {
          console.log('User not found during login');
          return done(null, false, { message: 'user_not_found' });
        }
        
        // Create new user for signup
        try {
          user = new User({
            googleId: profile.id,
            email: email,
            name: profile.displayName || email.split('@')[0],
            isGoogleUser: true,
            googleAccessToken: accessToken,
            googleRefreshToken: refreshToken,
            createdAt: new Date(),
            lastLoginAt: new Date()
          });
          await user.save();
          console.log('New user created:', user.email);
          return done(null, user, { message: 'signup_success' });
        } catch (error) {
          console.error('Error creating new user:', error);
          if (error.code === 11000) {
            return done(new Error('Email already registered'));
          }
          return done(new Error('Error creating user account'));
        }
      } else {
        // Handle existing user
        if (isSignUp) {
          console.log('User already exists during signup:', user.email);
          return done(null, false, { message: 'user_exists' });
        }
        
        try {
          // Update existing user for login
          user.googleId = profile.id;
          user.isGoogleUser = true;
          user.googleAccessToken = accessToken;
          user.lastLoginAt = new Date();
          if (refreshToken) {
            user.googleRefreshToken = refreshToken;
          }
          await user.save();
          console.log('Existing user updated:', user.email);
          return done(null, user, { message: 'login_success' });
        } catch (error) {
          console.error('Error updating existing user:', error);
          return done(new Error('Error updating user account'));
        }
      }
    } catch (error) {
      console.error('Google Strategy Error:', error);
      return done(new Error('Authentication error: ' + error.message));
    }
  }
));

// JWT Strategy
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  },
  async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false, { message: 'User not found' });
    } catch (error) {
      console.error('JWT Strategy Error:', error);
      return done(error);
    }
  }
));

// Serialize user for the session
passport.serializeUser((user, done) => {
  if (!user.id) {
    console.error('No user ID found during serialization');
    return done(new Error('No user ID found'));
  }
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    if (!id) {
      console.error('No user ID provided for deserialization');
      return done(new Error('No user ID provided'));
    }
    const user = await User.findById(id);
    if (!user) {
      console.error('User not found during deserialization:', id);
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    console.error('Error deserializing user:', error);
    done(error);
  }
});

module.exports = passport;
