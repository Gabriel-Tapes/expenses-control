import { Client, Pool, PoolClient } from 'pg'

export interface DatabaseCache {
  pool?: Pool
  maxConnections?: number
  reservedConnections?: number
  openedConnections?: number
  openedConnectionsLastUpdate?: number
}

export interface QueryOptions {
  values?: unknown[]
  transaction?: PoolClient
}
