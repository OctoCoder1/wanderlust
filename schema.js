const Joi = require('joi');

module.exports.schemaList =  Joi.object({
    listing : Joi.object({
     title : Joi.string().required(),
     description : Joi.string().required(),
     location : Joi.string().required(),
     country : Joi.string().required(),
     price: Joi.number().required(),
     image: Joi.object({
      url: Joi.string().uri().allow('', null).optional(),
      filename: Joi.string().allow('', null).optional()
    }).optional()
    }).required(),
});

module.exports.schemareview = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),
    }).required(),
});