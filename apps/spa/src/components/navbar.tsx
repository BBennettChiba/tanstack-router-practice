import { Link, useNavigate, useRouter, useRouterState } from '@tanstack/react-router'
import { signOut, useSession } from '../lib/auth-client.ts'
import type { ReactNode } from 'react'

const noNavbar = new Set(['/login'])

export default function NavBar({ children }: { children: ReactNode }) {
	const routerState = useRouterState()
	const router = useRouter()
	const currentPath = routerState.location.pathname
	const session = useSession()
	const navigate = useNavigate()

	const { data } = session

	const handleSignOut = async () => {
		router.clearCache()
		await navigate({ to: '/' })
		await signOut()
	}

	if (noNavbar.has(currentPath)) return children

	return (
		<div>
			<div className='flex gap-4 p-4'>
				<Link to='/' activeProps={{ className: 'font-bold' }}>Home</Link>
				<Link to='/about' activeProps={{ className: 'font-bold' }}>About</Link>
				<Link to='/users' activeProps={{ className: 'font-bold' }}>Users</Link>
				{data?.session ? null : <Link to='/login'>login</Link>}
				<SignOutButton isLoggedIn={!!data?.session} handleSignOut={handleSignOut} />
			</div>
			{children}
		</div>
	)
}

function SignOutButton({ isLoggedIn, handleSignOut }: { isLoggedIn: boolean; handleSignOut: () => void }) {
	if (!isLoggedIn) return null

	return (
		<button className='ml-auto bg-slate-400 p-3 rounded' onClick={handleSignOut}>
			Sign Out
		</button>
	)
}
