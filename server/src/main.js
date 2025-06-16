import { AppDataSource } from './config/data-source.js'
import app from './app.js'
import envs from './config/envs.js'

const PORT = envs.PORT || 3001

AppDataSource.initialize()
  .then(() => {
    console.log('📦 Database connected')
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error('❌ Failed to connect to the database:', error)
  })
