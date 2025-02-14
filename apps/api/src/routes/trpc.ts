import { initTRPC } from '@trpc/server'
import { Session } from '../services/auth.ts'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver'
import superjson from 'superjson'
import { schema } from '../services/db.ts'

interface Context {
	session?: Session
	db: PostgresJsDatabase<typeof schema>
}

const trpc = initTRPC.context<Context>().create({ transformer: superjson })

export const router = trpc.router
export const publicProcedure = trpc.procedure

export const protectedProcedure = trpc.procedure.use(function isAuth(opts) {
	const { ctx } = opts
	if (!ctx.session) {
		throw new Error('Unauthorized')
	}
	return opts.next(opts)
})
