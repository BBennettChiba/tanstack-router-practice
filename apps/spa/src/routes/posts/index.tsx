import { createFileRoute, Link, Navigate } from '@tanstack/react-router'
import { trpc } from '../../lib/query.ts'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { User } from 'npm:better-auth@1.1.11/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.tsx'

const columns: ColumnDef<User>[] = [{
	accessorKey: 'id',
	header: 'Id',
}, {
	accessorKey: 'email',
	header: 'Email',
}, {
	accessorKey: 'name',
	header: 'Name',
}]

export const Route = createFileRoute('/posts/')({
	component: Posts,
	errorComponent: () => <Navigate to='/login' />,
	loader: async ({ context: { trpcQueryUtils } }) => await trpcQueryUtils.user.getUsers.ensureData(),
})

function Posts() {
	const { data } = trpc.user.getUsers.useQuery()

	return (
		<div>
			<DataTable columns={columns} data={data || []} />
			{data?.map((user) => (
				<Link to={'/posts/$postId'} params={{ postId: user.id }} key={user.id}>
					{user.name}
				</Link>
			))}
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
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
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
