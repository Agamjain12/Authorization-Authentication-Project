const express = require('express');
const router = require('./routes/UserRoutes');
const { default: mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const app = express();

dotenv.config();

app.use(cookieParser());

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static('public'));
app.use(router);
app.set('trust proxy', true);

// cookies example

// app.get('/set-cookies', (req, res) => {
//   res.cookie('jetray', true, { maxAge: 1000 });
//   res.send('cookies are here children');
// });

// app.get('/read-cookies', (req, res) => {
//   const cookies = req.cookies;
//   console.log(cookies);
// });

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('app is running on port 3001');
    });
    console.log('connect to database');
  })
  .catch((error) => {
    console.log(error);
  });
