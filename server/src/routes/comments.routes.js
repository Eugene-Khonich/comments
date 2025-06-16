import { Router } from 'express'
import commentsController from '../controllers/comments.controller.js'
import validateCaptcha from '../middlewares/captcha.middleware.js'
import { ctrlWrapper } from '../utils/ctrlWrapper.js'

const router = Router()

router.get('/', ctrlWrapper(commentsController.getComments))
router.get('/replies/:parentId', ctrlWrapper(commentsController.getReplies))
router.post('/', validateCaptcha, ctrlWrapper(commentsController.createComment))
router.post('/preview', ctrlWrapper(commentsController.previewComment))

export default router
