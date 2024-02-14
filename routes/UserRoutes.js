const express = require('express');
const router = express.Router();
const controllers = require('../controller/userController');
const { validate } = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/cookiesAuth');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { authGuard } = require('../middlewares/authGuard');

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
router.get('/signup', authGuard, controllers.userRegistration_get);
router.post('/signup', validate, controllers.userRegistration_post);

router.get('/login', authGuard, controllers.userLogin_get);
router.post('/login', controllers.userLogin_post);

router.get('/verification-2', (req, res) => {
  return res.render('verification-2');
});

router.get('/verification/:token', controllers.userVerification);
router.get('/successful', (req, res) => {
  res.render('successful');
});

router.get('/auth/google', authGuard, controllers.googleAuth);

router.get('/auth/google/callback', authGuard, controllers.googleAuthCallback);

router.post(
  '/existingEmailVerification',
  authGuard,
  controllers.existingEmailVerification
);

router.get('/forgot-password', authGuard, (req, res) => {
  return res.render('forgot-password');
});

router.get('/forgotPassword', authGuard, controllers.forgotPassword);

router.get('/change-password', authGuard, (req, res) => {
  res.render('changePasswordStatic');
});

router.post('/changePassword', authGuard, controllers.changePassword);

module.exports = router;
