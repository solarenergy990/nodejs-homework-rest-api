const jwt = require('jsonwebtoken');

const path = require('path');
const Users = require('../repository/users');
const UploadService = require('../services/file-upload');
const { HttpCode } = require('../config/constants');
const { CustomError } = require('../helpers/customError');
const mkdirp = require('mkdirp');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const signup = async (req, res, next) => {
  const { password, email, subscription } = req.body;
  const user = await Users.findByEmail(email);
  if (user) {
    return res.status(HttpCode.CONFLICT).json({
      status: 'error',
      code: HttpCode.CONFLICT,
      message: 'Email already exists',
    });
  }
  try {
    const newUser = await Users.createUser({ password, email, subscription });
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        id: newUser.id,
        email: newUser.email,
        subscription: newUser.subscription,
        avatar: newUser.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
  res.json();
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await Users.findByEmail(email);
  const isValidPassword = await user.isValidPassword(password); // if user, to put ? after user
  if (!user || !isValidPassword) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: 'error',
      code: HttpCode.UNAUTHORIZED,
      message: 'Invalid credentials',
    });
  }
  const id = user._id;
  const payload = { id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
  await Users.updateToken(id, token);
  return res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    data: {
      token,
    },
  });
};

const logout = async (req, res, next) => {
  const id = req.user._id;
  await Users.updateToken(id, null);
  return res.status(HttpCode.NO_CONTENT).json({ test: 'test' });
};

const getCurrentUser = async (req, res, next) => {
  const userId = await req.user._id;

  const user = await Users.findById(userId);

  const { email, subscription } = user;
  if (user) {
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: { user: { email, subscription } },
    });
  }
  throw new CustomError(HttpCode.UNAUTHORIZED, 'Not authorized');
};

const uploadAvatar = async (req, res, next) => {
  const id = String(req.user._id);
  const file = req.file;
  const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS;
  const dest = path.join(AVATAR_OF_USERS, id);
  await mkdirp(dest);
  const uploadService = new UploadService(dest);
  const avatarUrl = await uploadService.save(file, id);
  await Users.updateAvatar(id, avatarUrl);

  return res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    data: { avatar: avatarUrl },
  });
};

module.exports = {
  signup,
  signin,
  logout,
  getCurrentUser,
  uploadAvatar,
};
