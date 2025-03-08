const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

const getCallbackUrl = () => {
  const baseUrl = (process.env.NODE_ENV === 'production'
    ? process.env.SERVER_URL
    : 'http://localhost:5000').replace(/([^:]\/)\/+/g, "$1");
  return `${baseUrl}/api/auth/google/callback`.replace(/([^:]\/)\/+/g, "$1");
};

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: getCallbackUrl(),
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google OAuth callback received for:', profile.emails[0].value);
      
      // Check if user already exists
      let user = await User.findOne({ 
        $or: [
          { googleId: profile.id },
          { email: profile.emails[0].value }
        ]
      });
      
      if (!user) {
        // Create new user if doesn't exist
        user = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          isGoogleUser: true,
          googleAccessToken: accessToken,
          googleRefreshToken: refreshToken
        });
        await user.save();
        console.log('New user created:', user.email);
      } else {
        // Update existing user
        user.googleId = profile.id;
        user.isGoogleUser = true;
        user.googleAccessToken = accessToken;
        user.googleRefreshToken = refreshToken;
        await user.save();
        console.log('Existing user updated:', user.email);
      }
      
      return done(null, user);
    } catch (error) {
      console.error('Google Strategy Error:', error);
      return done(error, null);
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
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }
));

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
