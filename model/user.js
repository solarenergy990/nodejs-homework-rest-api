const { Schema, model } = require('mongoose');
const gravatar = require('gravatar');
const { SubscriptionType } = require('../config/constants');
const bcrypt = require('bcryptjs');
const SALT_FACTOR = 6;
const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate(value) {
        const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(String(value).toLowerCase());
      },
    },
    subscription: {
      type: String,
      enum: {
        values: [
          SubscriptionType.STARTER,
          SubscriptionType.PRO,
          SubscriptionType.BUSINESS,
        ],
        message: 'Unknown subscription type',
      },
      default: 'starter',
    },
    token: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: '250' }, true);
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};
const User = model('user', userSchema);

module.exports = User;
