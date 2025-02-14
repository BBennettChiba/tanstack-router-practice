// @deno-types="npm:@types/react"
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from 'react-hook-form'

import { cn } from '../../lib/utils.ts'
import { Label } from '@radix-ui/react-label'

const Form = FormProvider

type FormFieldContextValue<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
	name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
	{} as FormFieldContextValue,
)

const FormField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	...props
}: ControllerProps<TFieldValues, TName>) => {
	return (
		<FormFieldContext.Provider value={{ name: props.name }}>
			<Controller {...props} />
		</FormFieldContext.Provider>
	)
}

const useFormField = () => {
	const fieldContext = React.useContext(FormFieldContext)
	const itemContext = React.useContext(FormItemContext)
	const { getFieldState, formState } = useFormContext()

	const fieldState = getFieldState(fieldContext.name, formState)

	if (!fieldContext) {
		throw new Error('useFormField should be used within <FormField>')
	}

	const { id } = itemContext

	return {
		id,
		name: fieldContext.name,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		...fieldState,
	}
}

type FormItemContextValue = {
	id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
	{} as FormItemContextValue,
)

type FormItemComponent = React.FC<React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement> }>

const FormItem: FormItemComponent = ({ className, ref, ...props }) => {
	const id = React.useId()

	return (
		<FormItemContext.Provider value={{ id }}>
			<div ref={ref} className={cn('space-y-2', className)} {...props} />
		</FormItemContext.Provider>
	)
}
FormItem.displayName = 'FormItem'

type FormLabelComponent = React.FC<React.HTMLAttributes<HTMLLabelElement> & { ref?: React.RefObject<HTMLLabelElement> }>

const FormLabel: FormLabelComponent = ({ className, ref, ...props }) => {
	const { error, formItemId } = useFormField()

	return (
		<Label
			ref={ref}
			className={cn(error && 'text-destructive', className)}
			htmlFor={formItemId}
			{...props}
		/>
	)
}
FormLabel.displayName = 'FormLabel'

type FormControlComponent = React.FC<React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement> }>

const FormControl: FormControlComponent = ({ ref, ...props }) => {
	const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

	return (
		<Slot
			ref={ref}
			id={formItemId}
			aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
			aria-invalid={!!error}
			{...props}
		/>
	)
}
FormControl.displayName = 'FormControl'

type FormDescriptionComponent = React.FC<
	React.HTMLAttributes<HTMLParagraphElement> & { ref?: React.RefObject<HTMLParagraphElement> }
>

const FormDescription: FormDescriptionComponent = ({ className, ref, ...props }) => {
	const { formDescriptionId } = useFormField()

	return (
		<p
			ref={ref}
			id={formDescriptionId}
			className={cn('text-sm text-muted-foreground', className)}
			{...props}
		/>
	)
}
FormDescription.displayName = 'FormDescription'

type FormMessageComponent = React.FC<
	React.HTMLAttributes<HTMLParagraphElement> & { ref?: React.RefObject<HTMLParagraphElement> }
>

const FormMessage: FormMessageComponent = ({ className, children, ref, ...props }) => {
	const { error, formMessageId } = useFormField()
	const body = error ? String(error?.message) : children

	if (!body) {
		return null
	}

	return (
		<p
			ref={ref}
			id={formMessageId}
			className={cn('text-sm font-medium text-destructive', className)}
			{...props}
		>
			{body}
		</p>
	)
}
FormMessage.displayName = 'FormMessage'

export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, useFormField }
