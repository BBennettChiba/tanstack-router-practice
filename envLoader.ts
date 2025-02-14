import { type } from 'arktype'

const isServer = typeof Deno !== 'undefined' && !!Deno.env

const envIsBackend = (_env: unknown): _env is BackendEnv => isServer

const backendSchema = type({
	PORT: 'string.integer',
	DATABASE_URL: 'string.url',
	BETTER_AUTH_SECRET: 'string',
	FE_HOST: 'string',
}).pipe((t) => ({ ...t, PORT: Number(t.PORT) }))

const frontendSchema = type({
	VITE_API_BASE_URL: 'string.url',
	VITE_HOST: 'string',
	VITE_PORT: 'string.integer',
}).pipe((t) => ({ ...t, VITE_PORT: Number(t.VITE_PORT) }))

type BackendEnv = typeof backendSchema.infer
type FrontendEnv = typeof frontendSchema.infer
type EnvSchema = BackendEnv & FrontendEnv
type Keys = keyof EnvSchema

export default function loadEnv<K extends Keys>(
	env: Record<string, unknown>,
	keys: readonly K[],
) {
	const parsedEnv = isServer ? backendSchema(env) : frontendSchema(env)

	if (parsedEnv instanceof type.errors) {
		console.error(parsedEnv.summary)
		throw new Error(parsedEnv.summary)
	}

	if (envIsBackend(parsedEnv)) {
		return Object.fromEntries(
			keys.map((key) => [key, parsedEnv[key as keyof BackendEnv]]),
		) as {
			[P in K]: EnvSchema[P]
		}
	} else {
		return Object.fromEntries(
			keys.map((key) => [key, parsedEnv[key as keyof FrontendEnv]]),
		) as {
			[P in K]: EnvSchema[P]
		}
	}
}
