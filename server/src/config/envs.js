const PORT = process.env.PORT || 3000

const DATABASE_URL = process.env.DATABASE_URL || ''

const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432
const DB_USER = process.env.DB_USER || 'postgres'
const DB_PASS = process.env.DB_PASS || 'secret_password'
const DB_NAME = process.env.DB_NAME || 'comments'

const envs = {
  PORT,
  DATABASE_URL,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,
}

export default envs
