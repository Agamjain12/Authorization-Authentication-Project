const crypto = require('crypto');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const user = require('../model/User');
const user_temp = require('../model/User-Temp');

dotenv.config();

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'Email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'incorrect password';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const userRegistration_post = async (req, res) => {
  try {
    const userBody = req.body;
    const uToken = generateVerificationToken();

    console.log(userBody);
    console.log(uToken);

    try {
      const userFound = await user.findOne({ email: userBody.email }).exec();

      if (userFound) {
        return res
          .status(409)
          .json({ errors: { email: 'email already exists' } });
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(userBody.password, salt);

      const userResponse = await user_temp.create({
        email: userBody.email,
        password: hashedPassword,
        verification_token: uToken,
      });
      console.log(userResponse);
    } catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
    // const identificationResponse = userAuth.create({
    //   email: userBody.email,
    //   verification_token: uToken,
    // });

    // sending mail
    let mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'agamj54@gmail.com',
        pass: 'wgfjvkfpoieweuah',
      },
    });

    let mailDetails = {
      from: '',
      to: userBody.email,
      subject: 'Test mail',
      text: `click on the link to verify your mail http://localhost:3001/verification/${uToken}`,
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        console.log('Error Occurs');
      } else {
        console.log('Email sent successfully');
      }
    });

    return res.status(200).json('check your mail');
  } catch (error) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const generateVerificationToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

const maxAge = 3 * 24 * 60 * 60;

const jwtToken = (id) => {
  return jwt.sign({ id }, 'authenticate it', {
    expiresIn: maxAge,
  });
};

// verifying email

const userVerification = async (req, res) => {
  try {
    const responseToken = req.params.token;
    console.log(responseToken);
    const response = await user_temp.findOne({
      verification_token: responseToken,
    });
    console.log(response);
    if (response) {
      const userData = await user.create({
        email: response.email,
        password: response.password,
        verifiedStatus: true,
      });
      const JWT_TOKEN = jwtToken(user._id);
      res.cookie('jwt', JWT_TOKEN, { httpOnly: true, maxAge: maxAge * 1000 });
      res.render('successful', { user: JSON.stringify(userData) });

      // res.status(200).json({ message: 'Sign Up successfull' });
    } else {
      res.status(404).json({ message: 'Registration Failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const userRegistration_get = (req, res) => {
  res.render('signup');
};

const userLogin_get = (req, res) => {
  res.render('login');
};

const userLogin_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const resUser = await user.login(email, password);
    const JWT_TOKEN = jwtToken(user._id);
    res.cookie('jwt', JWT_TOKEN, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: resUser._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const googleAuth = async (req, res) => {
  return res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&response_type=code&scope=openid profile email&state=${process.env.GOOGLE_STATE}&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}`
  );
};

const googleAuthCallback = async (req, res) => {
  const returnedState = req.query.state;
  const returnedError = req.query.error;

  if (!returnedState || returnedState !== process.env.GOOGLE_STATE) {
    return res.redirect('/signup');
  }

  if (!!returnedError) {
    return res.redirect('/signup');
  }

  try {
    const formData = new URLSearchParams({
      code: req.query.code,
      grant_type: 'authorization_code',
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
    });

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const tokenData = await tokenResponse.json();

    const userInfoResponse = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const userInfo = await userInfoResponse.json();

    let userId;

    const existUser = await user.find({ email: userInfo.email });
    if (existUser) {
      userId = existUser._id;
    } else {
      const userResponse = await user.create({
        password: null,
        verifiedStatus: true,
        email: userInfo.email,
      });

      userId = userResponse._id;
    }

    res.cookie('jwt', jwtToken(userId));
    return res.redirect('/');
  } catch (error) {
    return res.redirect('/signup');
  }
};

const verify = async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.clearCookie('jwt');

      return res.status(403).json({ message: 'verification failed' });
    }

    jwt.verify(token, 'authenticate it');
    return res.status(200).json({ message: 'verification successful' });
  } catch (error) {
    res.clearCookie('jwt');

    return res.status(403).json({ message: 'verification failed' });
  }
};

const logout = async (req, res) => {
  res.clearCookie('jwt');
  return res.status(200).json({ message: 'logout successful' });
};

module.exports = {
  userRegistration_post,
  userVerification,
  userRegistration_get,
  userLogin_get,
  userLogin_post,
  googleAuth,
  googleAuthCallback,
  verify,
  logout,
};
