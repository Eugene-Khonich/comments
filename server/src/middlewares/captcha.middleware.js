import createError from 'http-errors'
import captchaService from '../services/captcha.service.js'

const validateCaptcha = (req, res, next) => {
  let captcha
  try {
    captcha =
      typeof req.body.captcha === 'string'
        ? JSON.parse(req.body.captcha)
        : req.body.captcha
  } catch {
    return next(createError(400, 'Invalid CAPTCHA format'))
  }

  if (!captcha?.id || !captcha?.text) {
    return next(createError(400, 'Captcha ID and text are required'))
  }

  const isValid = captchaService.validateCaptcha(captcha.id, captcha.text)
  if (!isValid) {
    return next(createError(400, 'Invalid CAPTCHA'))
  }

  next()
}

export default validateCaptcha
