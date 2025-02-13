import { initTRPC, TRPCError } from '@trpc/server'
import { Hono } from 'hono'
import { cors } from 'npm:hono/cors'
import { trpcServer } from '@hono/trpc-server'
import { AuthInstance, type Session } from './services/auth.ts'
import superjson from 'superjson'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver'
import { getRoutes } from './routes/index.ts'

interface Context {
	session?: Session
	db: PostgresJsDatabase
}

const trpc = initTRPC.context<Context>().create({ transformer: superjson })

export const router = trpc.router

export const publicProcedure = trpc.procedure

export const protectedProcedure = trpc.procedure.use(function isAuth(opts) {
	const { ctx } = opts
	if (!ctx.session) {
		throw new TRPCError({ code: 'UNAUTHORIZED' })
	}
	return opts.next(opts)
})

const appRouter = trpc.mergeRouters(getRoutes())

const createTrpcApp = (db: PostgresJsDatabase, auth: AuthInstance) => {
	const trpcApp = new Hono()

	trpcApp.use(
		'/trpc/*',
		cors({
			origin: 'http://localhost:5173', // replace with your origin
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
