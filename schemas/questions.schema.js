const Joi = require("joi");

const QUESTIONSCHEMA = Joi.object().keys({
  id: Joi.number(),
  question: Joi.string().required(),
  categoryId: Joi.number().required(),
  difficultyId: Joi.number().required(),
  isActive: Joi.number().required(),
  answers: Joi.array()
    .items(
      Joi.object({
        id: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
        answer: Joi.string().required(),
        isCorrect: Joi.number().required(),
      })
    )
    .required(),
});

const ADDQUESTIONSCHEMA = Joi.object().keys({
  id: Joi.number().allow(null),
  question: Joi.string().required(),
  categoryId: Joi.number().required(),
  difficultyId: Joi.number().required(),
  isActive: Joi.number().required(),
  answers: Joi.array()
    .items(
      Joi.object({
        id: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
        answer: Joi.string().required(),
        isCorrect: Joi.number().required(),
      })
    )
    .required(),
});

module.exports = { QUESTIONSCHEMA, ADDQUESTIONSCHEMA };
