import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getNewClient } from '..'
import { createMigrationsTable } from './createMigrationsTable'

export const runMigrations = async () => {
  const client = await getNewClient()

  const migrationsDir = join(__dirname, 'sql')

  try {
    const files = await readdir(migrationsDir)

    if (files.length > 0) {
      await createMigrationsTable()
      console.log('Migrations start', new Date())
      await client.query('BEGIN')

      const executedMigrations = (
        await client.query('SELECT name FROM migrations')
      ).rows.map(row => row.name)

      await Promise.all(
        files.map(async file => {
          if (executedMigrations.includes(file)) return -1
          const content = await readFile(join(migrationsDir, file), 'utf8')
          const migration = content.toString()

          await client.query(migration)
          await client.query(
            'INSERT INTO migrations (name, executed_at) VALUES ($1, NOW())',
            [file]
          )

          return 0
        })
      )

      await client.query('COMMIT')
    }

    console.log('Migrations done', new Date())
  } catch (err) {
    console.error(err)
    await client.query('ROLLBACK')
    throw err
  } finally {
    return await client.end()
  }
}
