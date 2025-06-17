import { AppDataSource } from '../config/data-source.js'
import Comment from '../entities/Comment.js'
import createError from 'http-errors'
import sanitizeComment from '../utils/sanitizeComment.js'
import { broadcast } from '../utils/websocket.js'

class CommentsService {
  async getRootComments({ page, limit, sort, order }) {
    const repo = AppDataSource.getRepository(Comment)
    const allowedSortFields = ['userName', 'email', 'createdAt']
    const sortField = allowedSortFields.includes(sort) ? sort : 'createdAt'
    const sortOrder = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'
    const [data, total] = await repo.findAndCount({
      where: { parentId: null },
      order: { [sortField]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    })
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

    const repo = AppDataSource.getRepository(Comment)

    let parent = null
    if (parentId) {
      parent = await repo.findOne({ where: { id: Number(parentId) } })
      if (!parent) {
        throw createError(404, 'Parent comment not found')
      }
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

  async previewComment(text) {
    return sanitizeComment(text)
  }
}

export default new CommentsService()
