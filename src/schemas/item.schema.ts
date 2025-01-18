import Joi from '@hapi/joi';

export const createItemSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().min(0).required().messages({
    'number.min': 'Field "price" cannot be negative',
    'any.required': 'Field "price" is required'
  })
});

export const updateItemSchema = createItemSchema;
