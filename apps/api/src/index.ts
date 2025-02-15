import env from '../env.ts'
import { createApp } from './app.ts'

const app = createApp()

console.log(`Server is running on http://localhost:${env.PORT}`)
console.log(`Database URL: ${env.DATABASE_URL}`)

Deno.serve({ port: env.PORT }, app.fetch)
