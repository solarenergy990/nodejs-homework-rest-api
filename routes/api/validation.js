const Joi = require('joi');

const schemaContact = Joi.object({
  name: Joi.string()
    .trim()
    .regex(/^[a-z\d\s\-\.\,]*$/i)
    .min(1)
    .max(45)
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
    console.log(err);
    res.status(400).json({
      status: 'error',
      code: 400,
      message: 'validation error',
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
