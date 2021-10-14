const rateLimit = require('express-rate-limit');
const { HttpCode, Timings, Numbers } = require('../config/constants');

const limiter = rateLimit({
  windowMs: Timings.EXPIRY_TIME, // 15 minutes
  max: Numbers.REQUEST_LIMIT, // limit each IP to 100 requests per windowMs
  handler: (req, res, next) => {
    return res.status(HttpCode.TOO_MANY_REQUESTS).json({
      status: 'error',
      code: HttpCode.TOO_MANY_REQUESTS,
      message: 'Too many requests',
    });
  },
});

module.exports = limiter;
