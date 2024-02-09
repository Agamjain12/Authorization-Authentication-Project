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
        verifiedStatus: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const user = mongoose.model('user', schema);

module.exports = user;
