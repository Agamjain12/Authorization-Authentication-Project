const validate = (req, res, next) => {
  const requestBody = req.body;

  const errors = [];

  if (!requestBody.email) {
    errors.push('name is not present');
  }

  if (!requestBody.password) {
    errors.push('quantity is not present');
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
