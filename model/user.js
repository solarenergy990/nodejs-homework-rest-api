const { Schema, model } = require('mongoose');
const { SubscriptionType } = require('../config/constants');

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

const User = model('user', userSchema);

module.exports = User;
