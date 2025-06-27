import { Router } from 'express'
import upload from '../middlewares/multer.js'
import commentsController from '../controllers/comments.controller.js'
import { ctrlWrapper } from '../utils/ctrlWrapper.js'
import validateCaptcha from '../middlewares/captcha.middleware.js'

const router = Router()

router.get('/', ctrlWrapper(commentsController.getComments))
router.get('/tree', ctrlWrapper(commentsController.getAllCommentsTree))
router.get('/replies/:parentId', ctrlWrapper(commentsController.getReplies))
router.post(
  '/',
  upload.single('file'),
  validateCaptcha,
  ctrlWrapper(commentsController.createComment)
)
router.post('/preview', ctrlWrapper(commentsController.previewComment))

export default router
