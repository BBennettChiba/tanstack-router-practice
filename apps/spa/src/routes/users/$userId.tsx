import { createFileRoute } from '@tanstack/react-router'
import { trpc } from '../../lib/query.ts'

export const Route = createFileRoute('/users/$userId')({
	component: RouteComponent,

	loader: async ({ context: { trpcQueryUtils }, params: { userId: id } }) =>
		await trpcQueryUtils.user.getUserById.ensureData(id),
})

function RouteComponent() {
	const { userId } = Route.useParams()

	const { data } = trpc.user.getUserById.useQuery(userId)

	return <div>{JSON.stringify(data)}</div>
}
