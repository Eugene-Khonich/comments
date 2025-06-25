import Joi from 'joi'

const validationSchema = Joi.object({
  userName: Joi.string()
    .alphanum()
    .min(2)
    .max(100)
    .required()
    .label('User Name'),
  email: Joi.string().email({ tlds: false }).required().label('Email'),
  homePage: Joi.string().uri().allow('', null).label('Home Page'),
  text: Joi.string().min(1).required().label('Text'),
  captcha: Joi.string().alphanum().required().label('CAPTCHA'),
  file: Joi.any(),
})

export default validationSchema
