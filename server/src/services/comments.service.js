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
    const { username, email, homepage, text, captcha, parentId, file } = data

    if (!captcha) {
      throw createError(400, 'CAPTCHA required')
    }

    const repo = AppDataSource.getRepository(Comment)
    const newComment = repo.create({
      username,
      email,
      homepage,
      text: sanitizeComment(text),
      parentId: parentId || null,
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
