import { createFileRoute } from '@tanstack/react-router'
import { signIn } from '../lib/auth-client.ts'
import env from '../env.ts'
import { type } from 'arktype'
import { useForm } from 'react-hook-form'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../components/ui/form.tsx'
import { Input } from '../components/ui/input.tsx'
import { arktypeResolver } from '@hookform/resolvers/arktype'

export const Route = createFileRoute('/login')({
	component: RouteComponent,
})

const email = type({ email: 'string.email' })

function RouteComponent() {
	const form = useForm({ resolver: arktypeResolver(email), defaultValues: { email: '' } })

	const handleSubmit = form.handleSubmit((data) => {
		console.log(data)
		signIn.magicLink({
			email: data.email,
			// Use the dashboard url
			callbackURL: `http://${env.VITE_HOST}:${env.VITE_PORT}`,
		}).catch(console.error)
	})

	return (
		<div className='flex h-full justify-center items-center'>
			<Form {...form}>
				<form onSubmit={handleSubmit}>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type='email' {...field} />
								</FormControl>
								<FormDescription>
									We'll never share your email.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<button type='submit'>
						Send Magic Link
					</button>
				</form>
			</Form>
		</div>
	)
}
