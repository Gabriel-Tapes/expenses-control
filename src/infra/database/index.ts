import 'dotenv/config'
import retry from 'async-retry'
import { Client, Pool, type PoolConfig, type PoolClient } from 'pg'
import { DatabaseCache, QueryOptions } from '@/types/database'

const config: PoolConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionTimeoutMillis: 2000,
  idleTimeoutMillis: 30000,
  max: 30,
  allowExitOnIdle: true
}

const cache: DatabaseCache = {}

const newClientFromPool = async () => {
  if (!cache.pool) cache.pool = new Pool(config)

  return await cache.pool.connect()
}

const tryToGetNewClientFromPool = async () => {
  return await retry(newClientFromPool, {
    retries: 12,
    minTimeout: 150,
    maxTimeout: 5000,
    factor: 2
  })
}

export const query = async (query: string, options?: QueryOptions) => {
  let client: PoolClient | null = null

  try {
    client = options?.transaction ?? (await tryToGetNewClientFromPool())

    return await client.query(query, options?.values)
  } catch (err) {
    throw new Error(`Database Query error: ${err}`)
  } finally {
    if (client && !options?.transaction) {
      client.release()
    }
  }
}

export const transaction = async () => {
  return await tryToGetNewClientFromPool()
}

export const getNewClient = async () => {
  return await tryToGetNewClient()
}

const newClient = async () => {
  const client = new Client(config)
  await client.connect()
  return client
}

const tryToGetNewClient = async () => {
  const client = await retry(newClient, {
    retries: 50,
    minTimeout: 0,
    factor: 2
  })

  return client
}
