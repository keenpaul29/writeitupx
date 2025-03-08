const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const { AuthError, errorTypes } = require('../utils/errorHandler');

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.NODE_ENV === 'production'
        ? `${process.env.SERVER_URL}/api/auth/google/callback`
        : 'http://localhost:8000/api/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile || !profile.id) {
          throw new AuthError('Invalid Google profile data', 'INVALID_PROFILE_DATA');
        }

        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // Validate and update user information
          const updates = {
            lastLogin: new Date(),
            email: profile.emails[0]?.value || user.email,
            name: profile.displayName || user.name,
            avatar: profile.photos[0]?.value || user.avatar,
            accessToken,
            refreshToken: refreshToken || user.refreshToken
          };

          // Only update fields that have values
          Object.keys(updates).forEach(key => 
            updates[key] === undefined && delete updates[key]
          );

          try {
            user = await User.findByIdAndUpdate(
              user._id,
              updates,
              { new: true, runValidators: true }
            );
          } catch (updateError) {
            throw new AuthError(
              'Failed to update user information',
              'USER_UPDATE_FAILED',
              500
            );
          }

          return done(null, user);
        }

        // Validate required fields for new user
        if (!profile.emails?.[0]?.value) {
          throw new AuthError(
            'Email address is required',
            'EMAIL_REQUIRED',
            400
          );
        }

        // Create new user
        try {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value,
            accessToken,
            refreshToken,
            isGoogleUser: true
          });
        } catch (createError) {
          if (createError.code === 11000) { // Duplicate key error
            throw new AuthError(
              'Email already registered',
              'EMAIL_EXISTS',
              409
            );
          }
          throw new AuthError(
            'Failed to create user account',
            'USER_CREATION_FAILED',
            500
          );
        }

        done(null, user);
      } catch (error) {
        console.error('Google auth error:', {
          message: error.message,
          code: error.code,
          stack: error.stack
        });
        done(error, null);
      }
    }
  )
);

// JWT Strategy
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  },
  async (jwt_payload, done) => {
    try {
      if (!jwt_payload.id) {
        throw new AuthError('Invalid token payload', 'INVALID_TOKEN_PAYLOAD');
      }

      const user = await User.findById(jwt_payload.id);
      
      if (!user) {
        throw new AuthError('User not found', 'USER_NOT_FOUND', 404);
      }

      if (user.isBlocked) {
        throw new AuthError('User account is blocked', 'USER_BLOCKED', 403);
      }

      return done(null, user);
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
    if (!user) {
      throw new AuthError('User not found', 'USER_NOT_FOUND', 404);
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
