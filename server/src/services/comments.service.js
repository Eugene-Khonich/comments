import { AppDataSource } from '../config/data-source.js'
import Comment from '../entities/Comment.js'
import createError from 'http-errors'
import sanitizeComment from '../utils/sanitizeComment.js'

class CommentsService {
  async getRootComments({ page, limit, sort, order }) {
    const repo = AppDataSource.getRepository(Comment)
    const [data, total] = await repo.findAndCount({
      where: { parentId: null },
      order: { [sort]: order.toUpperCase() },
      skip: (page - 1) * limit,
      take: limit,
    })
    return { data, total, page: Number(page), limit: Number(limit) }
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
    return newComment
  }

  async previewComment(text) {
    return sanitizeComment(text)
  }
}

export default new CommentsService()
