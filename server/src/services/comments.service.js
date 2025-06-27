import { AppDataSource } from '../config/data-source.js'
import Comment from '../entities/Comment.js'
import createError from 'http-errors'
import sanitizeComment from '../utils/sanitizeComment.js'
import { broadcast } from '../utils/websocket.js'
import { validateCommentInput } from '../utils/comment.validator.js'
import { isValidXHTML } from '../utils/htmlValidator.js'

class CommentsService {
  async getCommentTree({ page, limit, sort, order }) {
    const repo = AppDataSource.getRepository(Comment)
    const allowedSortFields = ['userName', 'email', 'createdAt']
    const sortField = allowedSortFields.includes(sort) ? sort : 'createdAt'
    const sortOrder = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'
    const [allComments, total] = await repo.findAndCount({
      relations: ['parent'],
      order: { [sortField]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    })
    const roots = allComments.filter((comment) => !comment.parent)
    async function getRepliesRecursive(comment) {
      comment.replies = allComments.filter((c) => c.parent?.id === comment.id)
      comment.replies = await Promise.all(
        comment.replies.map((r) => getRepliesRecursive(r))
      )
      return comment
    }
    const data = await Promise.all(roots.map((c) => getRepliesRecursive(c)))
    return {
      data,
      total,
      page: Number(page),
      limit: Number(limit),
      sort: sortField,
      order: sortOrder,
    }
  }

  async getReplies(parentId) {
    const repo = AppDataSource.getRepository(Comment)
    return await repo.find({
      where: { parentId: Number(parentId) },
      order: { createdAt: 'ASC' },
    })
  }

  async createComment(data) {
    const { userName, email, homePage, text, captcha, parentId, file } = data
    if (!captcha) {
      throw createError(400, 'CAPTCHA required')
    }
    const errors = validateCommentInput({ userName, email, homePage, text })
    if (errors.length > 0) throw createError(400, errors.join(', '))
    const repo = AppDataSource.getRepository(Comment)
    let parent = null
    if (parentId) {
      parent = await repo.findOne({ where: { id: Number(parentId) } })
      if (!parent) {
        throw createError(404, 'Parent comment not found')
      }
    }
    if (!isValidXHTML(text)) {
      throw createError(
        400,
        'Invalid XHTML: make sure all tags are properly closed'
      )
    }
    delete data.parentId
    const newComment = repo.create({
      userName,
      email,
      homePage,
      text: sanitizeComment(text),
      parent,
      attachment: file || null,
      createdAt: new Date(),
    })
    await repo.save(newComment)
    broadcast({ type: 'new_comment', commentId: newComment.id })
    return newComment
  }

  async previewComment(text) {
    if (!text || typeof text !== 'string') {
      throw new Error('Text is required')
    }

    if (!isValidXHTML(text)) {
      throw new Error('Invalid XHTML: tags must be properly closed')
    }
    return sanitizeComment(text)
  }
}

export default new CommentsService()
