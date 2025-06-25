import { Router } from 'express'
import multer from 'multer'
import commentsController from '../controllers/comments.controller.js'
import { ctrlWrapper } from '../utils/ctrlWrapper.js'
import validateCaptcha from '../middlewares/captcha.middleware.js'

const router = Router()
const upload = multer({ dest: 'uploads/' })

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
