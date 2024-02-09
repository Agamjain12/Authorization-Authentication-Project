const express = require('express');
const router = express.Router();
const controllers = require('../controller/userRegistration');

router.post('/registration', controllers.userRegistration);

router.get('/verification/:token', controllers.userVerification);

module.exports = router;
