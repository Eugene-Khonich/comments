import svgCaptcha from 'svg-captcha'
import { v4 as uuidv4 } from 'uuid'
import captchaStore from '../utils/captchaStore.js'

class CaptchaService {
  generateCaptcha() {
    const captcha = svgCaptcha.create({
      size: 6,
      noise: 2,
      ignoreChars: '0o1il',
      color: true,
    })

    const id = uuidv4()
    captchaStore.set(id, captcha.text.toLowerCase())

    setTimeout(() => captchaStore.delete(id), 2 * 60 * 1000)

    return { id, data: captcha.data }
  }

  validateCaptcha(id, text) {
    const expected = captchaStore.get(id)
    if (!expected) return false

    const isValid = expected === text.toLowerCase()
    if (isValid) captchaStore.delete(id) // разове використання
    return isValid
  }
}

export default new CaptchaService()
