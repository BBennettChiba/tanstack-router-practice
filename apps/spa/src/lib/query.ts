import { QueryClient } from '@tanstack/react-query'
import type { AppRouter } from '../../../api/src/trpc.ts'
import { createTRPCQueryUtils, createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import env from '../env.ts'

export const queryClient = new QueryClient()

export const trpc = createTRPCReact<AppRouter>({})

const URL = `${env.VITE_API_BASE_URL}/trpc`

export const trpcClient = trpc.createClient({
	links: [
		httpBatchLink({
			// and since its from the same origin, we don't need to explicitly set the full URL
			url: URL,
			fetch(url, option) {
				return fetch(url, {
					...option,
					credentials: 'include',
				})
			},
			transformer: superjson,
		}),
	],
})

export const trpcQueryUtils = createTRPCQueryUtils({
	// @ts-expect-error: https://github.com/denoland/deno/issues/27171
	queryClient: queryClient,
	client: trpcClient,
})
