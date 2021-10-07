const { Schema, model } = require('mongoose');

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set contact name'],
    },
    email: {
      type: String,
      required: [true, 'Set contact email'],
      unique: [true, 'This email already exists'],
    },
    phone: {
      type: String,
      required: [true, 'Set contact phone'],
      unique: [true, 'This phone number already exists'],
    },
    favorite: {
      type: Boolean,
      default: false,
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

const Contact = model('contact', contactSchema);

module.exports = Contact;
