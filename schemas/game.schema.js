const Joi = require("joi");

const SAVESCORESCHEMA = Joi.object().keys({
  userId: Joi.string().required(),
  category: Joi.number().required(),
  difficulty: Joi.number().required(),
  score: Joi.number().required(),
});

module.exports = { SAVESCORESCHEMA };
