import { userSchema } from '../models/user.ts'
import { schema } from '../services/db.ts'
import { protectedProcedure, router } from '../trpc.ts'
import { createDummyUser } from '../useCases/createUser.ts'

export const createUserRouter = () =>
	router({
		getUsers: protectedProcedure.query(async ({ ctx: { db } }) => {
			return await db.select().from(schema.users)
		}),
		createUser: protectedProcedure
			.input(userSchema.assert)
			.mutation(async ({ input, ctx: { db } }) => {
				const user = await createDummyUser(input, db)
				return user
			}),
	})
