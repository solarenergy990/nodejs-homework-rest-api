const express = require('express');
const router = express.Router();

const {
  signup,
  signin,
  logout,
  getCurrentUser,
  uploadAvatar,
  verifyUser,
  resendUserVerification,
} = require('../../controllers/users');
const guard = require('../../helpers/guard');
const wrapError = require('../../helpers/errorHandler');

const loginLimit = require('../../helpers/rate-limit-login');
const upload = require('../../helpers/uploads');

router.post('/signup', signup);
router.post('/signin', loginLimit, signin);
router.post('/logout', guard, logout);
router.get('/current', guard, wrapError(getCurrentUser));
router.patch('/avatar', guard, upload.single('avatar'), uploadAvatar);

router.get('/verify/:verificationToken', wrapError(verifyUser));
router.post('/verify', resendUserVerification);

module.exports = router;
