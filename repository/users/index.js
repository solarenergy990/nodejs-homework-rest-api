const User = require('../../model/user');

const findByEmail = async email => {
  return await User.findOne({ email });
};

const createUser = async options => {
  const user = new User(options);
  return await user.save();
};

module.exports = {
  findByEmail,
  createUser,
};
