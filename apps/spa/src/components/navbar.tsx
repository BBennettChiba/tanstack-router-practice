import { Link, useRouterState } from '@tanstack/react-router'
import { signOut, useSession } from '../lib/auth-client.ts'
import type { ReactNode } from 'react'

const noNavbar = new Set(['/login'])

export default function NavBar({ children }: { children: ReactNode }) {
	const router = useRouterState()
	const currentPath = router.location.pathname
	const session = useSession()

	const { data } = session

	if (noNavbar.has(currentPath)) return children

	return (
		<div>
			<div className='flex gap-4 p-4'>
				<Link to='/'>Home</Link>
				<Link to='/about'>About</Link>
				<Link to='/users'>Users</Link>
				{data?.session ? null : <Link to='/login'>login</Link>}
				<SignOutButton isLoggedIn={!!data?.session} />
			</div>
			{children}
		</div>
	)
}

function SignOutButton({ isLoggedIn }: { isLoggedIn: boolean }) {
	if (!isLoggedIn) return null

	return (
		<button
			className='ml-auto bg-slate-400 p-3 rounded'
			onClick={() => signOut()}
		>
			Sign Out
		</button>
	)
}
