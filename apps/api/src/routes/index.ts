import { userRouter } from './userRouter.ts'
import { helloRouter } from './helloRouter.ts'
import { router } from './trpc.ts'

export const appRouter = router({
	user: userRouter,
	hello: helloRouter,
})

export type AppRouter = typeof appRouter
