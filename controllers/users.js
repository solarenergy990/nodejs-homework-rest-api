const jwt = require('jsonwebtoken');
const fs = require('fs/promises');
// const path = require('path');
const Users = require('../repository/users');
// const UploadService = require('../services/file-upload');
const { CustomError } = require('../helpers/customError');
const UploadService = require('../services/cloud-upload');
const { HttpCode } = require('../config/constants');
const EmailService = require('../services/email/service');
const { CreateSenderNodemailer } = require('../services/email/sender');
// const mkdirp = require('mkdirp');
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
    // TODO: Send email with verification

    const newUser = await Users.createUser({ password, email, subscription });
    const emailService = new EmailService(
      process.env.NODE_ENV,
      new CreateSenderNodemailer(),
    );
    const statusEmail = await emailService.sendVerifyEmail(
      newUser.email,
      newUser.name,
      newUser.verifyToken,
    );
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        id: newUser.id,
        email: newUser.email,
        subscription: newUser.subscription,
        avatar: newUser.avatar,
        successEmail: statusEmail,
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
  const isValidPassword = await user?.isValidPassword(password); // if user, to put ? after user
  if (!user || !isValidPassword || !user?.isVerified) {
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

// Local storage
// const uploadAvatar = async (req, res, next) => {
//   const id = String(req.user._id);
//   const file = req.file;
//   const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS;
//   const dest = path.join(AVATAR_OF_USERS, id);
//   await mkdirp(dest);
//   const uploadService = new UploadService(dest);
//   const avatarUrl = await uploadService.save(file, id);
//   await Users.updateAvatar(id, avatarUrl);

//   return res.status(HttpCode.OK).json({
//     status: 'success',
//     code: HttpCode.OK,
//     data: { avatar: avatarUrl },
//   });
// };

// Cloud storage
const uploadAvatar = async (req, res, next) => {
  const { id, idUserCloud } = req.user;
  const file = req.file;

  const dest = 'Avatars';
  const uploadService = new UploadService(dest);
  const { avatarUrl, returnIdUserCloud } = await uploadService.save(
    file.path,
    idUserCloud,
  );
  await Users.updateAvatar(id, avatarUrl, returnIdUserCloud);
  try {
    await fs.unlink(file.path);
  } catch (error) {
    console.log(error);
  }

  return res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    data: { avatar: avatarUrl },
  });
};

const verifyUser = async (req, res, next) => {
  const user = await Users.findUserByVerifyToken(req.params.token);

  if (user) {
    await Users.updateTokenVerify(user._id, true, null);
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        message: 'Successfully verified',
      },
    });
  }
  return res.status(HttpCode.NOT_FOUND).json({
    status: 'error',
    code: HttpCode.NOT_FOUND,
    message: 'Not found',
  });
};

const resendUserVerification = async (req, res, next) => {
  const { email } = req.body;
  const user = await Users.findByEmail(email);

  if (!email) {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      message: 'missing required field email',
    });
  }

  if (user && user.verifyToken) {
    const { email, name, verifyToken } = user;
    const emailService = new EmailService(
      process.env.NODE_ENV,
      new CreateSenderNodemailer(),
    );

    await emailService.sendVerifyEmail(email, name, verifyToken);

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        message: 'Successfully verified',
      },
    });
  }

  return res.status(HttpCode.BAD_REQUEST).json({
    status: 'error',
    code: HttpCode.BAD_REQUEST,
    message: 'Verification has already been passed',
  });
};

module.exports = {
  signup,
  signin,
  logout,
  getCurrentUser,
  uploadAvatar,
  verifyUser,
  resendUserVerification,
};
