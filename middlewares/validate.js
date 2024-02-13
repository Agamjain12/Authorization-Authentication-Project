const validate = (req, res, next) => {
  const requestBody = req.body;

  const errors = [];

  if (!requestBody.email) {
    errors.push('email is not present');
  }

  if (!requestBody.password) {
    errors.push('password is not present');
  }
  if (errors.length > 0) {
    res.json({
      status: 'failed',
      errors,
    });
  } else {
    next();
  }
};

module.exports = { validate };
