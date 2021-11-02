const nodemailer = require('nodemailer');
require('dotenv').config();

class CreateSenderNodemailer {
  async send(msg) {
    const config = {
      host: process.env.SEND_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_SENDER,
        pass: process.env.PASSWORD,
      },
    };
    const transporter = nodemailer.createTransport(config);
    return await transporter.sendMail({
      ...msg,
      from: process.env.MAIL_SENDER,
    });
  }
}

module.exports = { CreateSenderNodemailer };
