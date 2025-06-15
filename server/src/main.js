import { DataSource } from 'typeorm'
import envs from './config/envs.js'
import ormConfig from './config/ormconfig.js'
import app from './app.js'

const AppDataSource = new DataSource(ormConfig)

AppDataSource.initialize()
  .then(() => {
    console.log('📦 DB connected')
    const PORT = envs.PORT || 3001
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('❌ DB connection failed', err)
  })
