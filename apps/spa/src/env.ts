import loadEnv from '../../../envLoader.ts'

const env = loadEnv(import.meta.env, ['VITE_API_BASE_URL', 'VITE_HOST', 'VITE_PORT'])

export default env
