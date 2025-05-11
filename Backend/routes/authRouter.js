const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login?google=fail',
    session: false,
  }),
  (req, res) => {
    try {
      const tokenPayload = {
        id: req.user._id.toString(),
        role: req.user.role === undefined ? null : req.user.role,
        name: req.user.name,
        email: req.user.email
      };

      const token = jwt.sign(
        tokenPayload, 
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      
      res.redirect(
        `${process.env.CLIENT_URL}/google-success?token=${encodeURIComponent(token)}`
      );
    } catch (err) {
      console.error("Google callback error:", err);
      res.redirect('/login?error=auth_failed');
    }
  }
);

module.exports = router;