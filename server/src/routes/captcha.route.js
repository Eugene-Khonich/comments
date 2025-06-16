import { Router } from 'express'
import captchaService from '../services/captcha.service.js'

const router = Router()

router.get('/', (req, res) => {
  const captcha = captchaService.generateCaptcha()
  res.json(captcha)
})

export default router
