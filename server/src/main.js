import http from 'http'
import { AppDataSource } from './config/data-source.js'
import app from './app.js'
import envs from './config/envs.js'
import { initWebSocket } from './utils/websocket.js'

const PORT = envs.PORT || 3000
const server = http.createServer(app)
initWebSocket(server)

AppDataSource.initialize()
  .then(() => {
    console.log('📦 Database connected')
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error('❌ Failed to connect to the database:', error)
  })
