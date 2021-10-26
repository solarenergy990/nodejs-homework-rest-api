const multer = require('multer');
require('dotenv').config();
const { CustomError } = require('./customError');
const UPLOAD_DIR = process.env.UPLOAD_DIR;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now().toString() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + '-' + uniqueSuffix);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('image')) {
      return cb(null, true);
    }

    // You can always pass an error if something goes wrong:
    cb(new CustomError(400, 'Wrong avatar image format'));
  },
});

module.exports = upload;
