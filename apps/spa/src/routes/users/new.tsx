import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { type } from 'arktype'
import { arktypeResolver } from '@hookform/resolvers/arktype'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../../components/ui/form.tsx'
import { Button } from '../../components/ui/button.tsx'
import { Input } from '../../components/ui/input.tsx'
import { trpc } from '../../lib/query.ts'

export const Route = createFileRoute('/users/new')({
	component: RouteComponent,
})

const user = type({
	name: 'string >= 3',
	password: 'string >= 8',
	passwordConfirm: 'string >= 8',
	email: 'string.email',
}).narrow(({ password, passwordConfirm }, ctx) => {
	if (password !== passwordConfirm) {
		ctx.reject({
			message: 'Passwords do not match',
			path: ['passwordConfirm'],
		})
		ctx.reject({
			message: 'Passwords do not match',
			path: ['password'],
		})
		return false
	}
	return true
})

function RouteComponent() {
	const form = useForm({
		resolver: arktypeResolver(user),
		defaultValues: { name: '', password: '', passwordConfirm: '', email: '' },
	})

	const { mutate } = trpc.user.createUser.useMutation()

	const submit = (data: typeof user.infer) => {
		mutate(data)
	}

	return (
		<div className='w-4/5 m-auto'>
			Create a user
			<Form {...form}>
				<form onSubmit={form.handleSubmit(submit)} className='space-y-8'>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem className='w-1/3'>
								<FormLabel>name</FormLabel>
								<FormControl>
									<Input placeholder='shadcn' {...field} />
								</FormControl>
								<FormDescription>
									This is your public display name.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem className='w-1/3'>
								<FormLabel>email</FormLabel>
								<FormControl>
									<Input placeholder='example@gmail.com' type='email' {...field} />
								</FormControl>
								<FormDescription>
									please input a valid email
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem className='w-1/3'>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input {...field} type='password' />
								</FormControl>
								<FormDescription>
									please input a password
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='passwordConfirm'
						render={({ field }) => (
							<FormItem className='w-1/3'>
								<FormLabel>Password confirmation</FormLabel>
								<FormControl>
									<Input {...field} type='password' />
								</FormControl>
								<FormDescription>
									input the same password again
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type='submit'>Submit</Button>
				</form>
			</Form>
		</div>
	)
}
