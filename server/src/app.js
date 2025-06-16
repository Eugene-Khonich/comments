import express from 'express'
import cors from 'cors'
import commentsRouter from './routes/comments.routes.js'
import captchaRouter from './routes/captcha.route.js'
import errorHandler from './middlewares/errorHandler.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/comments', commentsRouter)
app.use('/api/captcha', captchaRouter)
app.use(errorHandler)

export default app
