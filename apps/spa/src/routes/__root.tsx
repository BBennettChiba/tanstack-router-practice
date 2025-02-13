import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { trpcQueryUtils } from '../lib/query.ts'
import Navbar from '../components/Navbar.tsx'

export const Route = createRootRouteWithContext<{
	trpcQueryUtils: typeof trpcQueryUtils
}>()({
	component: RootComponent,
})

function RootComponent() {
	return (
		<>
			<Navbar>
				<Outlet />
			</Navbar>
			<TanStackRouterDevtools />
			<ReactQueryDevtools initialIsOpen={false} />
		</>
	)
}
