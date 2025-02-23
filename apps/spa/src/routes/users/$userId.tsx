import { createFileRoute, Navigate, redirect } from '@tanstack/react-router'
import { trpc } from '../../lib/query.ts'
import { getSession } from '../../lib/auth-client.ts'
import { Card, CardContent, CardHeader } from '../../components/ui/card.tsx'
import { useState } from 'react'
import { useEffect } from 'react'

export const Route = createFileRoute('/users/$userId')({
	component: RouteComponent,
	beforeLoad: async () => {
		const { data: session } = await getSession()

		if (!session) throw redirect({ to: '/login' })
	},
	loader: async ({ context: { trpcQueryUtils }, params: { userId: id } }) =>
		await trpcQueryUtils.user.getUserById.ensureData(id),
	errorComponent: () => <Navigate to='/login' />,
})

function RouteComponent() {
	const { userId } = Route.useParams()
	const [now, setNow] = useState(new Date())

	const { data } = trpc.user.getUserById.useQuery(userId)

	if (!data) return null

	const difference = Number(now) - Number(data.createdAt)
	let seconds = difference / 1000
	let minutes = seconds / 60
	let hours = minutes / 60
	const days = Math.floor(hours / 24)
	seconds = Math.floor(seconds % 60)
	minutes = Math.floor(minutes % 60)
	hours = Math.floor(hours % 24)

	useEffect(() => {
		const interval = setInterval(() => setNow(new Date()), 1000)
		return () => clearInterval(interval)
	}, [])

	return (
		<div className='w-2/5 m-auto'>
			<Card>
				<CardHeader>{data?.name}</CardHeader>
				<CardContent className='grid gap-4'>
					<div className=' flex items-center space-x-4 rounded-md border p-4'>
						this account was created {days} days {hours} hours {minutes} minutes {seconds} seconds ago
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
