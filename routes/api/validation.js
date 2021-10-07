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
  isFavorite: Joi.boolean(),
});

const schemaContactStatus = Joi.object({
  isFavorite: Joi.boolean().required(),
});

// const pattern = '\\w{8}-\\w{4}-\\w{4}-\\w{4}-\\w{12}';

const schemaId = Joi.object({
  contactId: Joi.string().required(),
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
