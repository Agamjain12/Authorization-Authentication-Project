const express = require('express');
const router = express.Router();
const controllers = require('../controller/userController');
const { validate } = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/cookiesAuth');
const { logout } = require('../controller/userController');

router.get('/', (req, res) => {
  res.render('home');
});

router.get('/emailVerification', (req, res) => {
  res.render('verification');
});

router.get('/logout', requireAuth, controllers.logout);

router.get('/verify', controllers.verify);

router.get('/smoothies', requireAuth, (req, res) => {
  res.render('smoothies');
});
router.get('/signup', controllers.userRegistration_get);
router.post('/signup', validate, controllers.userRegistration_post);

router.get('/login', controllers.userLogin_get);
router.post('/login', controllers.userLogin_post);

router.get('/verification/:token', controllers.userVerification);
router.get('/successful', (req, res) => {
  res.render('successful');
});
module.exports = router;
