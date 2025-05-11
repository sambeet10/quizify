const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Try to find user by googleId first
        let user = await User.findOne({ googleId: profile.id });

        // If not found by googleId, try by email
        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });
          
          // If found by email, update with googleId
          if (user) {
            user.googleId = profile.id;
            await user.save();
          }
        }

        // If still not found, create new user
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            role: null,
          });
        }

        return done(null, user);
      } catch (err) {
        // Handle duplicate key error specifically
        if (err.code === 11000) {
          const existingUser = await User.findOne({ email: profile.emails[0].value });
          return done(null, existingUser);
        }
        return done(err, null);
      }
    }
  )
);