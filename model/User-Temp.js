const mongoose = require('mongoose');

const schema = mongoose.Schema(
    {
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: 'Email address is required',
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please fill a valid email address',
            ],
        },
        password: {
            type: String,
            required: 'Password is required',
            minlength: [6, 'Password must be at least 6 characters long'],
        },
        verification_token: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

schema.index({ createdAt: 1 }, { expireAfterSeconds: 1800 });

const user_temp = mongoose.model('user_temp', schema);

module.exports = user_temp;
