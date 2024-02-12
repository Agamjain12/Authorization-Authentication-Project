const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, 'authenticate it', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        res.clearCookie('jwt');
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

module.exports = { requireAuth };
