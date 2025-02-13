import { cors } from 'npm:hono/cors'
import env from './env.ts'
import { createApp } from './app.ts'

const app = createApp()

// app.use((c) => {
// 	console.log(c)
// })

app.use(
	'/api/auth/**', // or replace with "*" to enable cors for all routes
	// "*",
	cors({
		origin: 'http://localhost:5173', // @TODO replace with our origin
		allowHeaders: ['Content-Type', 'Authorization'],
		allowMethods: ['POST', 'GET', 'OPTIONS'],
		exposeHeaders: ['Content-Length'],
		maxAge: 600,
		credentials: true,
	}),
)

console.log(`Server is running on http://localhost:${env.PORT}`)
console.log(`Database URL: ${env.DATABASE_URL}`)

Deno.serve({ port: env.PORT }, app.fetch)
