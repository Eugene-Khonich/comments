require('reflect-metadata')
const express = require('express')
const { DataSource } = require('typeorm')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'comments',
  entities: ['./entities/*.js'],
  synchronize: true,
})

AppDataSource.initialize()
  .then(() => {
    console.log('📦 DB connected')
    app.listen(3001, () => {
      console.log('🚀 Server running on http://localhost:3001')
    })
  })
  .catch((err) => {
    console.error('❌ DB connection failed:', err)
  })
