const Users = require('../repository/users');
const { HttpCode } = require('../config/constants');

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
      },
    });
  } catch (error) {
    next(error);
  }
  res.json();
};

const signin = async (req, res, next) => {
  res.json();
};

const logout = async (req, res, next) => {
  res.json();
};

module.exports = {
  signup,
  signin,
  logout,
};
