const passport = require('passport');

const validateAuth = passport.authenticate('jwt', { session: false });

const validateRequest = (req, res, next) => {
  const { text, context } = req.body;
  if (!text || !context) {
    return res.status(400).json({ error: 'Missing required fields: text and context' });
  }
  next();
};

module.exports = { validateAuth, validateRequest };