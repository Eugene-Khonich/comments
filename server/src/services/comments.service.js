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

    const [roots, total] = await repo.findAndCount({
      where: { parent: null },
      order: { [sortField]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    })
    async function getRepliesRecursive(comment) {
      const replies = await repo.find({
        where: { parent: comment },
        order: { [sortField]: sortOrder },
      })
      comment.replies = await Promise.all(replies.map(getRepliesRecursive))
      return comment
    }
    const data = await Promise.all(roots.map(getRepliesRecursive))
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
    broadcast({
      type: 'new_comment',
      comment: newComment,
    })
    return newComment
  }

  async buildCommentTree(parentId = null) {
    const repo = AppDataSource.getRepository(Comment)
    const comments = await repo.find({
      where: { parent: parentId ? { id: parentId } : null },
      order: { createdAt: 'ASC' },
    })
    const tree = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this.buildCommentTree(comment.id)
        return {
          ...comment,
          replies,
        }
      })
    )
    return tree
  }

  async previewComment(text) {
    return sanitizeComment(text)
  }
}

export default new CommentsService()
