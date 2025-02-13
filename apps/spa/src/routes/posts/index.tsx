import { createFileRoute } from '@tanstack/react-router'
import { trpc } from '../../lib/query.ts'
import { Link } from '@tanstack/react-router'
import { Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/')({
	loader: async ({ context: { trpcQueryUtils } }) => await trpcQueryUtils.getUsers.ensureData(),
	component: Posts,
	errorComponent: () => <Navigate to='/login' />,
})

function Posts() {
	const { data } = trpc.getUsers.useQuery()

	return (
		<div>
			{data?.map((user) => (
				<Link to={'/posts/$postId'} params={{ postId: user.id }} key={user.id}>
					{user.name}
				</Link>
			))}
		</div>
	)
}
