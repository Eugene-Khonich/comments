import { DataSource } from 'typeorm'
import Comment from '../entities/Comment.js'
import envs from './envs.js'

export const AppDataSource = envs.DATABASE_URL
  ? new DataSource({
      type: 'postgres',
      url: envs.DATABASE_URL,
      synchronize: true,
      entities: [Comment],
    })
  : new DataSource({
      type: 'postgres',
      host: envs.DB_HOST,
      port: parseInt(envs.DB_PORT),
      username: envs.DB_USER,
      password: envs.DB_PASS,
      database: envs.DB_NAME,
      synchronize: true,
      entities: [Comment],
    })
