const express = require('express');
const router = express.Router();

const {
  signup,
  signin,
  logout,
  getCurrentUser,
  uploadAvatar,
} = require('../../controllers/users');
const guard = require('../../helpers/guard');
const loginLimit = require('../../helpers/rate-limit-login');
const upload = require('../../helpers/uploads');

router.post('/signup', signup);
router.post('/signin', loginLimit, signin);
router.post('/logout', guard, logout);
router.get('/current', guard, getCurrentUser);
router.patch('/avatar', guard, upload.single('avatar'), uploadAvatar);

module.exports = router;
