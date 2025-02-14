import { eq } from 'drizzle-orm'
import { type } from 'arktype'
import { userSchema } from '../models/user.ts'
import { schema } from '../services/db.ts'
import { createDummyUser } from '../useCases/createUser.ts'
import { protectedProcedure, router } from './trpc.ts'

export const userRouter = router({
	getUsers: protectedProcedure.query(async ({ ctx: { db } }) => {
		return await db.select().from(schema.users)
	}),
	createUser: protectedProcedure
		.input(userSchema.assert)
		.mutation(async ({ input, ctx: { db } }) => {
			const user = await createDummyUser(input, db)
			return user
		}),
	getUserById: protectedProcedure
		.input(type('string').assert)
		.query(async ({ input, ctx: { db } }) => {
			return await db.query.users.findFirst({ where: eq(schema.users.id, input) })
		}),
})
