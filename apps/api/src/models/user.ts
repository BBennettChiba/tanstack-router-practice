import { type } from 'arktype'
import type { users } from '../schema/users.ts'

type User = typeof users.$inferInsert

export const userSchema = type({
	name: 'string',
	email: 'string.email',
	'emailVerified?': 'boolean',
	'image?': 'null | string',
	'role?': 'string',
}).as<User>()
