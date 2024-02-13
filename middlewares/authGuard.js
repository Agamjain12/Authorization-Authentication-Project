const authGuard = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    return res.redirect('/');
  }

  return next();
};

module.exports = { authGuard };
