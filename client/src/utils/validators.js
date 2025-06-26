import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  userName: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, 'Only alphanumeric characters allowed')
    .min(2, 'Too short')
    .max(100, 'Too long')
    .required('User Name is required'),

  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),

  homePage: Yup.string()
    .url('Invalid URL')
    .nullable()
    .notRequired()
    .transform((value) => (value === '' ? null : value)),

  text: Yup.string()
    .min(1, 'Message cannot be empty')
    .required('Text is required'),

  captchaText: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, 'Only alphanumeric characters allowed')
    .required('CAPTCHA is required'),

  file: Yup.mixed().notRequired(), // Валідація файлу — на сервері
})

export default validationSchema
