const SubscriptionType = {
  STARTER: 'starter',
  PRO: 'pro',
  BUSINESS: 'business',
};

const Timings = {
  EXPIRY_TIME: 15 * 60 * 1000,
};

const Numbers = {
  REQUEST_LIMIT: 3,
  MIN_NAME_LENGTH: 1,
  MAX_NAME_LENGTH: 45,
  JSON_SIZE: 10000,
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports = {
  SubscriptionType,
  HttpCode,
  Timings,
  Numbers,
};
