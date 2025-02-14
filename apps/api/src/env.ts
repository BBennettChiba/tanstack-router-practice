import loadEnv from '../../../envLoader.ts'

const env = loadEnv(Deno.env.toObject(), ['DATABASE_URL', 'PORT', 'BETTER_AUTH_SECRET', 'FE_HOST'])

export default env
