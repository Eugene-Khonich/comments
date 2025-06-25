import createError from 'http-errors'
import captchaService from '../services/captcha.service.js'

const validateCaptcha = (req, res, next) => {
  const { captchaId, captcha } = req.body

  if (!captchaId || !captcha) {
    return next(createError(400, 'Captcha ID and text are required'))
  }

  const isValid = captchaService.validateCaptcha(captchaId, captcha)

  if (!isValid) {
    return next(createError(400, 'Invalid CAPTCHA'))
  }

  next()
}

export default validateCaptcha
