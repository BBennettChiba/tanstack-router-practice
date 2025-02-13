// @deno-types="npm:@types/react"
import * as React from 'react'

import { cn } from '../../lib/utils.ts'

type TableProps = React.HTMLAttributes<HTMLTableElement> & {
	ref?: React.RefObject<HTMLTableElement>
}

type TableSectionProps = React.HTMLAttributes<HTMLTableSectionElement> & {
	ref?: React.RefObject<HTMLTableSectionElement>
}

type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
	ref?: React.RefObject<HTMLTableRowElement>
}

type TableCellProps =
	& (
		| React.ThHTMLAttributes<HTMLTableCellElement>
		| React.TdHTMLAttributes<HTMLTableCellElement>
	)
	& {
		ref?: React.RefObject<HTMLTableCellElement>
	}

type TableCaptionProps = React.HTMLAttributes<HTMLTableCaptionElement> & {
	ref?: React.RefObject<HTMLTableCaptionElement>
}

const Table: React.FC<TableProps> = ({ className, ref, ...props }) => (
	<div className='relative w-full overflow-auto'>
		<table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
	</div>
)

const TableHeader: React.FC<TableSectionProps> = ({ className, ref, ...props }) => (
	<thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
)

const TableBody: React.FC<TableSectionProps> = ({ className, ref, ...props }) => (
	<tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
)

const TableFooter: React.FC<TableSectionProps> = ({ className, ref, ...props }) => (
	<tfoot ref={ref} className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)} {...props} />
)

const TableRow: React.FC<TableRowProps> = ({ className, ref, ...props }) => (
	<tr
		ref={ref}
		className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)}
		{...props}
	/>
)

const TableHead: React.FC<TableCellProps> = ({ className, ref, ...props }) => (
	<th
		ref={ref}
		className={cn(
			'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
			className,
		)}
		{...props}
	/>
)

const TableCell: React.FC<TableCellProps> = ({ className, ref, ...props }) => (
	<td ref={ref} className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)} {...props} />
)

const TableCaption: React.FC<TableCaptionProps> = ({ className, ref, ...props }) => (
	<caption ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
)

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow }
