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
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const Contact = model('contact', contactSchema);

module.exports = Contact;
