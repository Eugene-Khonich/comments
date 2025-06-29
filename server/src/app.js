import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import commentsRouter from './routes/comments.routes.js'
import captchaRouter from './routes/captcha.route.js'
import errorHandler from './middlewares/errorHandler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distPath = path.join(__dirname, 'dist')
const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/comments', commentsRouter)
app.use('/api/captcha', captchaRouter)
app.use('/uploads', express.static(path.resolve('uploads')))
app.use(express.static(distPath))
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})
app.use(errorHandler)

export default app
