import { createFileRoute, Link, Navigate } from '@tanstack/react-router'
import { trpc } from '../../lib/query.ts'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { User } from 'npm:better-auth@1.1.11/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.tsx'
import { Trash2 } from 'lucide-react'

const columns: ColumnDef<User>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		accessorKey: 'createdAt',
		header: 'Created At',
		cell: ({ cell }) => new Date(cell.row.original.createdAt).toLocaleString(),
	},
	{
		id: 'delete',
		enableHiding: false,
		cell: ({ row }) => {
			const { mutate } = trpc.user.deleteUserById.useMutation()
			return <Trash2 onClick={() => mutate(row.original.id)} />
		},
	},
]

export const Route = createFileRoute('/users/')({
	component: Users,
	errorComponent: () => <Navigate to='/login' />,
	loader: async ({ context: { trpcQueryUtils } }) => await trpcQueryUtils.user.getUsers.ensureData(),
})

function Users() {
	const { data } = trpc.user.getUsers.useQuery()

	return (
		<div className='w-4/5 m-auto'>
			<div className='flex justify-between p-4'>
				<h1 className='text-3xl'>Users</h1>
				<Link to='/users/new'>
					<button className='bg-slate-400 p-3 rounded'>create user</button>
				</Link>
			</div>
			<DataTable columns={columns} data={data || []} />
		</div>
	)
}

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
}

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	return (
		<div className='rounded-md border'>
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder ? null : flexRender(
											header.column.columnDef.header,
											header.getContext(),
										)}
									</TableHead>
								)
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length
						? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											<Link to={`/users/$userId`} params={{ userId: row.getValue('id')! }}>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</Link>
										</TableCell>
									))}
								</TableRow>
							))
						)
						: (
							<TableRow>
								<TableCell colSpan={columns.length} className='h-24 text-center'>
									No results.
								</TableCell>
							</TableRow>
						)}
				</TableBody>
			</Table>
		</div>
	)
}
