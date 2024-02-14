const jwt = require('jsonwebtoken');

const authGuard = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token && jwt.verify(token, 'authenticate it')) {
    return res.redirect('/');
  }

  return next();
};

module.exports = { authGuard };
