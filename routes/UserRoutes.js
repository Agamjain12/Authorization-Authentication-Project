const express = require('express');
const router = express.Router();
const controllers = require('../controller/userController');
const { validate } = require('../middlewares/validate');

router.get('/', (req, res) => {
  res.render('home');
});

router.get('/emailVerification', (req, res) => {
  res.render('verification');
});

router.get('/smoothies', (req, res) => {
  res.render('smoothies');
});
router.get('/signup', controllers.userRegistration_get);
router.post('/signup', validate, controllers.userRegistration_post);

router.get('/login', controllers.userLogin_get);
router.post('/login');

router.get('/verification/:token', controllers.userVerification);

module.exports = router;
