import { router } from '../trpc.ts'
import { createHelloRouter } from './helloRouter.ts'
import { createUserRouter } from './userRouter.ts'

export const getRoutes = () => {
	const userRouter = createUserRouter()
	const helloRouter = createHelloRouter()

	return router({
		user: userRouter,
		hello: helloRouter,
	})
}
