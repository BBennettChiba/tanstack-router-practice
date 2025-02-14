import { createClient, createDb } from './services/db.ts'
import { createTrpcApp } from './trpc.ts'
import { createAuth } from './services/auth.ts'
import env from './env.ts'

export function createApp() {
	const db = createDb(createClient(env.DATABASE_URL))
	const auth = createAuth(db)

	const app = createTrpcApp(db, auth)

	app.on(['POST', 'GET'], '/api/auth/**', (c) => {
		return auth.handler(c.req.raw)
	})

	return app
}
