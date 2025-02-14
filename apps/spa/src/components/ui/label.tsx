// @deno-types="npm:@types/react"
import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils.ts'

const labelVariants = cva(
	'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
)

type LabelComponent = React.FC<
	& React.ComponentPropsWithoutRef<
		typeof LabelPrimitive.Root
	>
	& { ref: React.ElementRef<typeof LabelPrimitive.Root> }
	& VariantProps<typeof labelVariants>
>

const Label: LabelComponent = ({ className, ref, ...props }) => (
	<LabelPrimitive.Root
		ref={ref}
		className={cn(labelVariants(), className)}
		{...props}
	/>
)
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
