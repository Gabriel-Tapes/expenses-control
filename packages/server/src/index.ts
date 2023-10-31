import 'dotenv/config'
import { runMigrations } from './infra/database/migrations'
import { app } from './app'

const PORT = process.env.PORT ?? 3000
const HOST = process.env.HOST ?? '0.0.0.0'

;(async () => {
  await runMigrations()

  app.listen(PORT, HOST, () =>
    console.log(`server is listening at ${HOST}:${PORT}`)
  )
})()
