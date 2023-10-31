import { getNewClient } from '..'

export const createMigrationsTable = async () => {
  const client = await getNewClient()

  try {
    const exists = (
      await client.query(
        'SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)',
        ['migrations']
      )
    ).rows[0].exists

    if (!exists) {
      await client.query(
        `CREATE TABLE migrations (
          id SERIAL,
          name TEXT NOT NULL,
          executed_at TIMESTAMP DEFAULT NOW()
        )`
      )
      console.log('Migrations table created successfully', new Date())
    }
  } catch (err) {
    console.error(err)
  } finally {
    await client.end()
  }
}
