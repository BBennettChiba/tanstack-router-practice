import { Hono } from 'hono'
import { cors } from 'npm:hono/cors'
import { trpcServer } from '@hono/trpc-server'
import { AuthInstance } from './services/auth.ts'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver'
import { appRouter } from './routes/index.ts'
import type { schema } from './services/db.ts'
import env from './env.ts'

console.log(env.FE_HOST)

const createTrpcApp = (db: PostgresJsDatabase<typeof schema>, auth: AuthInstance) => {
	const trpcApp = new Hono()

	trpcApp.use(
		'*',
		cors({
			origin: env.FE_HOST,
			allowHeaders: ['Content-Type', 'Authorization'],
			allowMethods: ['POST', 'GET', 'OPTIONS'],
			exposeHeaders: ['Content-Length'],
			maxAge: 600,
			credentials: true,
		}),
	)

	trpcApp.use(
		'/trpc/*',
		trpcServer({
			router: appRouter,
			createContext: async (_, c) => {
				const session = await auth.api.getSession({
					headers: c.req.raw.headers,
				})
				return {
					session: session,
					db,
				}
			},
		}),
	)
	return trpcApp
}

export { createTrpcApp }

export type AppRouter = typeof appRouter
