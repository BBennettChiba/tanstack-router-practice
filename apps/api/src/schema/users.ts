import { boolean, text, timestamp } from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const users = pgTable('users', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('emailVerified').notNull().default(false),
	image: text('image'),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
	twoFactorEnabled: boolean('twoFactorEnabled'),
	role: text('role'),
	banned: boolean('banned'),
	banReason: text('banReason'),
	banExpires: timestamp('banExpires'),
})
