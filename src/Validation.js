import * as Joi from "joi-browser";

export const RegisterSchema = Joi.object().keys({
  richtext: Joi.any().required(),
});

export const RegisterSchema1 = Joi.object({
  richtext: Joi.any().required("Required"),
});
