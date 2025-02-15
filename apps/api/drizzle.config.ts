import { defineConfig } from 'drizzle-kit'
import env from './env.ts'

console.log(`Database URL: ${env.DATABASE_URL}`)

export default defineConfig({
	out: './drizzle',
	schema: './src/schema/index.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: env.DATABASE_URL,
	},
})
