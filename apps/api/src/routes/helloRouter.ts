import { type } from 'arktype'
import { publicProcedure, router } from './trpc.ts'

export const helloRouter = router({
	hello: publicProcedure
		.input(type('string | undefined').assert)
		.query(({ input }) => {
			return `Hello ${input ?? 'World'}!`
		}),
})
