const express = require('express');
const router = require('./routes/UserRoutes');
const user = require('./model/User');
const user_temp = require('./model/User-Temp');
const { default: mongoose } = require('mongoose');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

const app = express();

dotenv.config();

app.use(express.json());

app.use('/user', router);

app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'whatup',
    });
});

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
