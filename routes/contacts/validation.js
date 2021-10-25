const Joi = require('joi');
const { HttpCode, Numbers } = require('../../config/constants');

const schemaContact = Joi.object({
  name: Joi.string()
    .trim()
    .regex(/^[a-z\d\s\-\.\,]*$/i)
    .min(Numbers.MIN_NAME_LENGTH)
    .max(Numbers.MAX_NAME_LENGTH)
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  phone: Joi.string()
    .trim()
    .regex(/^[0-9\s\-\(\)]{7,17}$/)
    .required(),
  favorite: Joi.boolean(),
});

const schemaContactStatus = Joi.object({
  favorite: Joi.boolean().required(),
});

const pattern = '\\w{24}';

const schemaId = Joi.object({
  contactId: Joi.string().pattern(new RegExp(pattern)).required(),
});

const validate = async (schema, obj, res, next) => {
  try {
    await schema.validateAsync(obj);

    next();
  } catch (err) {
    console.log(err.message);
    if (!obj.favorite) {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: 'error',
        code: HttpCode.BAD_REQUEST,
        message: `missing field favorite: ${err.message.replace(/"/g, '')}`,
      });
    }
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      message: `validation error: ${err.message.replace(/"/g, '')}`,
    });
  }
};

module.exports.validateContact = async (req, res, next) => {
  return await validate(schemaContact, req.body, res, next);
};

module.exports.validateContactStatus = async (req, res, next) => {
  return await validate(schemaContactStatus, req.body, res, next);
};

module.exports.validateId = async (req, res, next) => {
  return await validate(schemaId, req.params, res, next);
};
