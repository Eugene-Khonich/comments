import commentsService from '../services/comments.service.js'
import fileService from '../services/file.service.js'

class CommentsController {
  async getComments(req, res) {
    const {
      page = 1,
      limit = 5,
      sort = 'createdAt',
      order = 'DESC',
    } = req.query
    const result = await commentsService.getCommentTree({
      page,
      limit,
      sort,
      order,
    })
    res.json(result)
  }

  async getReplies(req, res) {
    const { parentId } = req.params
    const replies = await commentsService.getReplies(parentId)
    res.json(replies)
  }

  async createComment(req, res) {
    const commentData = req.body
    let fileInfo = null
    if (req.file) {
      fileInfo = await fileService.processUploadedFile(req.file)
    }
    const newComment = await commentsService.createComment({
      ...commentData,
      file: fileInfo?.filename || null,
    })
    res.status(201).json(newComment)
  }

  async getAllCommentsTree(req, res) {
    const tree = await commentsService.buildCommentTree()
    res.json(tree)
  }

  async previewComment(req, res) {
    const preview = await commentsService.previewComment(req.body.text)
    res.json({ preview })
  }
}

export default new CommentsController()
