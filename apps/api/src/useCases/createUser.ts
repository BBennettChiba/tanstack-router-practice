import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver'
import { InsertUser } from '../services/types.ts'
import { schema } from '../services/db.ts'

export async function createDummyUser(data: InsertUser, db: PostgresJsDatabase<typeof schema>) {
	await db.insert(schema.users).values(data)
}
