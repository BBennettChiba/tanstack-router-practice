import { Link, ReactNode, useRouterState } from '@tanstack/react-router'
import { signOut, useSession } from '../lib/auth-client.ts'

const noNavbar = ['/login']

export default function NavBar({ children }: { children: ReactNode }) {
	const router = useRouterState()
	const currentPath = router.location.pathname
	const { data } = useSession()

	if (noNavbar.includes(currentPath)) return children

	return (
		<div>
			<div className='flex gap-2 p-4'>
				<Link to='/'>Home</Link>
				<Link to='/about'>About</Link>
				<Link to='/posts'>Posts</Link>
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
