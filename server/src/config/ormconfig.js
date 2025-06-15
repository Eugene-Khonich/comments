import User from '../entities/User.js'
import Comment from '../entities/Comment.js'
import Attachment from '../entities/Attachment.js'

const entities = [User, Comment, Attachment]

export default {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'user',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'commentsdb',
  synchronize: true,
  logging: false,
  entities,
}
