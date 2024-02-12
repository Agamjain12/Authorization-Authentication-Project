const user = require('../model/User');
const user_temp = require('../model/User-Temp');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const userRegistration_post = async (req, res) => {
  try {
    const userBody = req.body;
    const uToken = generateVerificationToken();

    console.log(userBody);
    console.log(uToken);

    const userResponse = await user_temp.create({
      email: userBody.email,
      password: userBody.password,
      verification_token: uToken,
    });
    console.log(userResponse);
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
    console.log(error.message);
    return res.status(500).json({ error: error.message });
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
      await user.create({
        email: response.email,
        password: response.password,
        verifiedStatus: true,
      });
      const JWT_TOKEN = jwtToken(user._id);
      res.cookie('jwt', JWT_TOKEN, { httpOnly: true, maxAge: maxAge * 1000 });
      res.redirect('/successful');

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

module.exports = {
  userRegistration_post,
  userVerification,
  userRegistration_get,
  userLogin_get,
};
