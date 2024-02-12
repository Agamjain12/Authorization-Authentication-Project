const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

schema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
schema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

const user = mongoose.model('user', schema);

module.exports = user;
