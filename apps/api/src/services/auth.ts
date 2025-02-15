import { betterAuth } from 'better-auth'
import { magicLink, openAPI } from 'better-auth/plugins'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import env from '../../env.ts'

import { schema } from './db.ts' //@TODO think about making schema a dpenendncy
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver'

export const createAuth = (db: PostgresJsDatabase<typeof schema>) =>
	betterAuth({
		// Fix the baseURL to the auth server
		baseURL: `http://localhost:${env.PORT}`,
		appName: 'Runreal-deno-template',
		// I really need this
		trustedOrigins: ['http://localhost:5173', env.FE_HOST],
		secret: env.BETTER_AUTH_SECRET,
		database: drizzleAdapter(db, {
			provider: 'pg',
			schema: {
				...schema,
			},
			usePlural: true,
		}),
		advanced: {
			crossSubDomainCookies: {
				enabled: true,
			},
			defaultCookieAttributes: {
				sameSite: 'none',
				secure: true,
			},
		},
		plugins: [
			openAPI(),
			magicLink({
				sendMagicLink: ({ email, token, url }) => {
					console.log(`sending email ${email}, token ${token}, url ${url}`)
				},
			}),
		],
	})

export type AuthInstance = ReturnType<typeof createAuth>

export type Session = AuthInstance['$Infer']['Session']
