const express = require('express');
const router = express.Router();

const {
  signup,
  signin,
  logout,
  getCurrentUser,
} = require('../../controllers/users');
const guard = require('../../helpers/guard');
const loginLimit = require('../../helpers/rate-limit-login');

router.post('/signup', signup);
router.post('/signin', loginLimit, signin);
router.post('/logout', guard, logout);
router.get('/current', guard, getCurrentUser);

module.exports = router;
