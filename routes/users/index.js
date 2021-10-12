const express = require('express');
const router = express.Router();

const { signup, signin, logout } = require('../../controllers/users');
const guard = require('../../helpers/guard');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', guard, logout);

module.exports = router;
