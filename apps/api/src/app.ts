import { Hono } from 'hono'
import { createClient, createDb } from './services/db.ts'
import { createTrpcApp } from './trpc.ts'
import { createAuth } from './services/auth.ts'
import env from './env.ts'

export function createApp() {
	const app = new Hono()

	// Initialize dependencies
	const db = createDb(createClient(env.DATABASE_URL))
	const auth = createAuth(db)

	const trpcApp = createTrpcApp(db, auth)

	app.route('/', trpcApp) // Attach the router

	return app
}
