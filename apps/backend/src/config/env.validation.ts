import * as Joi from 'joi';

export const envValidation = Joi.object({
  CLOUDINARY_URL: Joi.string().required(),
  PORT: Joi.number().required().default(8080),
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
});
