import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../schema/index.ts'

const createClient = (databaseUrl: string) => postgres(databaseUrl)

const createDb = (client: postgres.Sql) => drizzle({ client, schema })

export { createClient, createDb, schema }
export * from './types.ts'
