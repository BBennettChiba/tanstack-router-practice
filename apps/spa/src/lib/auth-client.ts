import { createAuthClient } from 'better-auth/react'
import { adminClient, magicLinkClient } from 'better-auth/client/plugins'
import env from '../env.ts'

export const { signIn, signOut, useSession, getSession } = createAuthClient({
	appName: 'Runreal-deno-template',
	plugins: [magicLinkClient(), adminClient()],
	baseURL: env.VITE_API_BASE_URL,
})
